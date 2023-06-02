// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {ZKAuthToken} from "./Token.sol";

interface IVerifier {
    function verifyProof(uint256[2] memory a, uint256[2][2] memory b, uint256[2] memory c, uint256[2] memory input)
        external
        view
        returns (bool r);
}

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ZkAuth {
    struct User {
        uint hashedPwd;
        bool registered;
    }

    // key is hashed login
    mapping(bytes32 => User) public users;

    address public verifier;

    ERC20 public underlyingToken;

    event Transfer(bytes32 indexed login, address indexed recepient, uint256 amount);
    event Registration(bytes32 indexed login, address sender);

    constructor(address _verifier, address _underlying) {
        verifier = _verifier;
        underlyingToken = ZKAuthToken(_underlying);
    }

    function register(bytes32 login, uint hashedPwd) external {
        require(!users[login].registered, "User already exists");
        // require(!usedStatements[statementId], "Statement already used");
        users[login] = User(hashedPwd, true);
        emit Registration(login, msg.sender);
    }

    function transfer(
        bytes32 login,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input,
        address recepient,
        uint256 amount
    ) external {
        User memory user = users[login];
        require(user.registered, "User doesn't exist");

        uint hashedPwd = input[1];

        require(user.hashedPwd == hashedPwd, "Wrong password");

        bool verifyResult = IVerifier(verifier).verifyProof(a, b, c, input);
        require(verifyResult, "Proof is not valid");

        underlyingToken.transfer(recepient, amount);

        emit Transfer(login, recepient, amount);
    }

    function isUserRegistered(bytes32 login) external view returns (bool) {
        return users[login].registered;
    }
}
