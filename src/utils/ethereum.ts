import { ethers } from 'ethers';
import RefugeeIdentityABI from '../contracts/RefugeeIdentity.json';
import RefugeeVerificationInfoABI from '../contracts/RefugeeVerificationInfo.json';
import SkillVerificationABI from '../contracts/SkillVerification.json';

// Define the contract addresses
const REFUGEE_IDENTITY_ADDRESS = "0xf89a921fA5d6F334E6Ee509C2d34eCB9DEe7d820";
const REFUGEE_VERIFICATION_INFO_ADDRESS = "0xE9E3d1D72Af2d834338465F6A20CD2609B6A36b9";
const SKILL_VERIFICATION_ADDRESS = "0x93E1cA925742d6B548bDbfe2afbF384467F8c2de";

export const getEthereumContract = async (
  contractType: 'refugeeIdentity' | 'refugeeVerificationInfo' | 'skillVerification'
) => {
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      let contractAddress: string;
      let contractABI: any;

      switch (contractType) {
        case 'refugeeIdentity':
          contractAddress = REFUGEE_IDENTITY_ADDRESS;
          contractABI = RefugeeIdentityABI.abi;
          break;
        case 'refugeeVerificationInfo':
          contractAddress = REFUGEE_VERIFICATION_INFO_ADDRESS;
          contractABI = RefugeeVerificationInfoABI.abi;
          break;
        case 'skillVerification':
          contractAddress = SKILL_VERIFICATION_ADDRESS;
          contractABI = SkillVerificationABI.abi;
          break;
        default:
          throw new Error("Invalid contract type");
      }

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
