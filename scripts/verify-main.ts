import hre, { ethers } from "hardhat";
import { getDeployedAddress } from "./utils";

async function main() {
  const mainAdress = getDeployedAddress("zkAuth");
  const verifierAdress = getDeployedAddress("verifier");
  const token = getDeployedAddress("token");

  await hre.run("verify:verify", {
    address: mainAdress,
    constructorArguments: [verifierAdress, token],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
