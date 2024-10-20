import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.27",
      },
      {
        version: "0.8.19",
      }
    ],
  },
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/XedNFVIHuMt04sNpalK0YrNpPsfwgzPy",
      accounts: ["7fc9e86628c8a31dfb48ebe49ba51ae60ce672e943af7b026eb5f3cddc96e8b3"],
      gasPrice: 1000000000,  // 1 gwei
      gas: 2100000,           // Gas limit
    },
  },
};

export default config;
