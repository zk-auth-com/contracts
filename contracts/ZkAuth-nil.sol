// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

interface IVerifier {
    function verify(
        bytes calldata blob,
        uint256[] calldata init_params,
        int256[][] calldata columns_rotations,
        address gate_argument
    ) external view returns (bool result);
}

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract ZkAuthNil {
    struct User {
        uint64 nonce;
        address verifier;
        uint64 statementId;
        uint160 balance;
    }

    // bytes32 is the user's hashed login
    mapping(bytes32 => User) public users;
    mapping(bytes32 => bool) public usedProofs;
    mapping(uint64 => bool) public usedStatements;

    address public verifier;

    IERC20 underlyingToken;

    event Transfer(bytes32 indexed login, address indexed recepient, uint256 amount);
    event Registration(bytes32 indexed login, address indexed verifier, uint64 statementId);

    constructor(address _verifier, address _underlyingToken) {
        verifier = _verifier;
        underlyingToken = IERC20(_underlyingToken);
    }

    function register(bytes32 login, uint64 statementId) external {
        // todo check msg.sender is out server? centralization
        // better to receive proof and register after verification
        // think how to verify before registration?

        require(users[login].verifier == address(0), "User already exists");
        require(!usedStatements[statementId], "Statement already used");
        users[login] = User(0, msg.sender, statementId, 150 ether); // hardcoded initial balance
        usedStatements[statementId] = true;
        emit Registration(login, msg.sender, statementId);
    }

    function transfer(
        bytes32 login,
        bytes calldata proof,
        uint256[] calldata init_params,
        int256[][] calldata columns_rotations,
        address recepient,
        uint256 amount
    ) external {
        User memory user = users[login];
        require(user.verifier != address(0), "User doesn't exist");

        bytes32 proofHash = keccak256(proof);
        require(!usedProofs[proofHash], "Proof already used");

        require(user.balance >= amount, "Not enough balance");

        bool verifyResult = IVerifier(verifier).verify(proof, init_params, columns_rotations, user.verifier);
        require(verifyResult, "Proof is not valid");

        uint256 contractTokenBalance = underlyingToken.balanceOf(address(this));
        require(contractTokenBalance >= amount, "Not enough tokens in the contract");

        underlyingToken.transfer(recepient, amount);
        emit Transfer(login, recepient, amount);

        usedProofs[proofHash] = true;
        users[login].nonce++;
    }
}
