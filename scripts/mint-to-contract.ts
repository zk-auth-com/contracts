import hre, { ethers } from "hardhat";
import { getDeployedAddress, saveDeployedAddress } from "./utils";
import { ZKAuthToken__factory } from "../typechain";
import { BigNumber } from "ethers";

async function main() {
  const tokenADdress = getDeployedAddress("token");
  const tokenContract = await ZKAuthToken__factory.connect(
    tokenADdress,
    (
      await ethers.getSigners()
    )[0]
  );

  const mainAdress = getDeployedAddress("zkAuth");

  console.log("minting to:", mainAdress);

  const tx = await tokenContract.mint(mainAdress, "10000000000000000000000");

  await tx.wait();

  console.log(tx.hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
