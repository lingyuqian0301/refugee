import { ethers } from "hardhat";

async function main() {
  const contractAddress = "0x06e60C0620343873403544614052b21c82D8Ab28";
  const RefugeeIdentity = await ethers.getContractFactory("RefugeeIdentity");
  const contract = RefugeeIdentity.attach(contractAddress);

  // Test registering a refugee
  await contract.registerRefugee("R001", "John Doe", "Country A", 946684800); // Unix timestamp for 2000-01-01
  console.log("Refugee registered");

  // Test retrieving refugee data
  const refugee = await contract.getRefugee("R001");
  console.log("Retrieved refugee:", refugee);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

