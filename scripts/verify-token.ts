import hre, { ethers } from "hardhat";
import { getDeployedAddress } from "./utils";

async function main() {
  const address = getDeployedAddress("token");

  await hre.run("verify:verify", {
    address: address,
    constructorArguments: ["ZKT", "ZKT"],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
