import { ethers } from 'ethers';
import RefugeeIdentityABI from '../contracts/RefugeeIdentity.json';
import { SkillVerificationABI } from '../contractABIs';


// Define the contract addresses
const REFUGEE_IDENTITY_ADDRESS = "0xf89a921fA5d6F334E6Ee509C2d34eCB9DEe7d820";
const SKILL_VERIFICATION_ADDRESS = "0x832A3F886366eFC0D432c8bC8d96de9815198ae7";

export const getEthereumContract = async (contractType: 'refugeeIdentity' | 'skillVerification') => {
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      let contractAddress: string;
      let contractABI: any;

      if (contractType === 'refugeeIdentity') {
        contractAddress = REFUGEE_IDENTITY_ADDRESS;
        contractABI = RefugeeIdentityABI.abi;
      } else if (contractType === 'skillVerification') {
        contractAddress = SKILL_VERIFICATION_ADDRESS;
        contractABI = SkillVerificationABI;
      } else {
        throw new Error("Invalid contract type");
      }

      console.log("Contract Address:", contractAddress);
      console.log("Contract ABI:", contractABI);

      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      console.log("Created contract instance:", contract);
      return contract;
    } catch (error) {
      console.error("Error connecting to Ethereum:", error);
      throw error;
    }
  }
  throw new Error("Ethereum provider not found");
};
