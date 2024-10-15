import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import { Network, Alchemy } from "alchemy-sdk";

const config = {
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
        accounts: ["7fc9e86628c8a31dfb48ebe49ba51ae60ce672e943af7b026eb5f3cddc96e8b3"]
    },
  },
};

export default config;
