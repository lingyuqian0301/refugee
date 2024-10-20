import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Address of the previously deployed RefugeeIdentity contract
  const refugeeIdentityAddress = " 0xC5a4896Da3088225E0933832b2687C3833ec20EE"; // Replace with your actual contract address

  console.log("Existing RefugeeIdentity contract at:", refugeeIdentityAddress);

  // Deploying SkillVerification
  const SkillVerification = await ethers.getContractFactory("SkillVerification");
  const skillVerification = await SkillVerification.deploy(deployer.address);

  await skillVerification.waitForDeployment();

  console.log("SkillVerification deployed to:", await skillVerification.getAddress());



  // Interacting with the existing RefugeeIdentity contract
  const RefugeeIdentity = await ethers.getContractFactory("RefugeeIdentity");
  const refugeeIdentity = RefugeeIdentity.attach(refugeeIdentityAddress);

  // Example: Fetching a refugee's data (replace "R001" with an actual ID you've registered)
  try {
    const refugee = await refugeeIdentity.getRefugee("R001");
    console.log("Retrieved refugee:", refugee);
  } catch (error) {
    console.error("Error fetching refugee data:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
