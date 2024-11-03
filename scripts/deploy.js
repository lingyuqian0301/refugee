import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  try {
    // Deploy RefugeeVerificationInfo
    console.log("Deploying RefugeeVerificationInfo...");
    const RefugeeVerificationInfo = await ethers.getContractFactory("RefugeeVerificationInfo");
    const refugeeVerificationInfo = await RefugeeVerificationInfo.deploy(
      deployer.address,           // initialOwner
      deployer.address           // _refugeeIdentityContract - using deployer address as placeholder
    );
    await refugeeVerificationInfo.waitForDeployment();
    const refugeeVerificationInfoAddress = await refugeeVerificationInfo.getAddress();
    console.log("RefugeeVerificationInfo deployed to:", refugeeVerificationInfoAddress);

    // Deploy SkillVerification
    console.log("Deploying SkillVerification...");
    const SkillVerification = await ethers.getContractFactory("SkillVerification");
    const skillVerification = await SkillVerification.deploy(deployer.address);
    await skillVerification.waitForDeployment();
    const skillVerificationAddress = await skillVerification.getAddress();
    console.log("SkillVerification deployed to:", skillVerificationAddress);

    console.log("\nDeployment Summary:");
    console.log("-------------------");
    console.log("RefugeeVerificationInfo:", refugeeVerificationInfoAddress);
    console.log("SkillVerification:", skillVerificationAddress);

  } catch (error) {
    console.error("Detailed error:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });