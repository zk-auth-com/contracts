import hre, { ethers } from "hardhat";
import { getDeployedAddress, saveDeployedAddress } from "./utils";
import { ZKAuthToken__factory, ZkAuth__factory } from "../typechain";

async function main() {
  const mainAdress = getDeployedAddress("zkAuth");

  const zkAuth = await ZkAuth__factory.connect(
    mainAdress,
    (
      await ethers.getSigners()
    )[0]
  );

  const underlying = await zkAuth.underlyingToken();

  console.log("underlying token is:", underlying);

  saveDeployedAddress("underlying", underlying);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
