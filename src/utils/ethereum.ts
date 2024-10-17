import { ethers } from 'ethers';
import RefugeeIdentityABI from '../contracts/RefugeeIdentity.json';

const contractAddress = "0x06e60C0620343873403544614052b21c82D8Ab28";

export const getEthereumContract = async () => {
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, RefugeeIdentityABI.abi, signer);
      return contract;
    } catch (error) {
      console.error("Error connecting to Ethereum:", error);
      throw error;
    }
  }
  throw new Error("Ethereum provider not found");
};
