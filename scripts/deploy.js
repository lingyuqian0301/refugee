import { ethers } from "hardhat";

async function main() {
  const RefugeeIdentity = await ethers.getContractFactory("RefugeeIdentity");
  const [deployer] = await ethers.getSigners();
  const refugeeIdentity = await RefugeeIdentity.deploy(deployer.address);

  await refugeeIdentity.waitForDeployment();

  console.log("RefugeeIdentity deployed to:", await refugeeIdentity.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
