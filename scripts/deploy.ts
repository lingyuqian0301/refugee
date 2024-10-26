import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const RefugeeIdentity = await ethers.getContractFactory("RefugeeIdentity");
  const refugeeIdentity = await RefugeeIdentity.deploy(deployer.address);

  await refugeeIdentity.waitForDeployment();

  console.log("RefugeeIdentity deployed to:", await refugeeIdentity.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
