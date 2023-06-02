import hre, { ethers } from "hardhat";
import fs from "fs";
import { saveDeployedAddress } from "./utils";

async function main() {
  const Verifier = await ethers.getContractFactory(
    "contracts/verifier.sol:Verifier"
  );
  const verifier = await Verifier.deploy();

  console.log("Verifier deploying, waiting...");

  await verifier.deployed();

  console.log("Verifier deployed to:", verifier.address);

  saveDeployedAddress("verifier", verifier.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
