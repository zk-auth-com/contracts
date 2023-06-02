import hre, { ethers } from "hardhat";
import { getDeployedAddress, saveDeployedAddress } from "./utils";

async function main() {
  const Token = await ethers.getContractFactory("ZKAuthToken");
  const token = await Token.deploy("ZKT", "ZKT");

  console.log("token deploying, waiting...");
  await token.deployed();
  console.log("token deployed to:", token.address);
  saveDeployedAddress("token", token.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
