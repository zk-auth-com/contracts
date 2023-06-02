import hre, { ethers } from "hardhat";
import { getDeployedAddress, saveDeployedAddress } from "./utils";

async function main() {
  const verifierAddress = getDeployedAddress("verifier");
  const ZkAuth = await ethers.getContractFactory("ZkAuth");
  const tokenAddress = getDeployedAddress("token");

  const zkAuth = await ZkAuth.deploy(verifierAddress, tokenAddress);

  console.log("ZkAuth deploying, waiting...");
  await zkAuth.deployed();
  console.log("zkAuth deployed to:", zkAuth.address);
  saveDeployedAddress("zkAuth", zkAuth.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
