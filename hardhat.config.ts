import { HardhatUserConfig } from "hardhat/config";
import dotenv from "dotenv";
import "@nomicfoundation/hardhat-toolbox-viem";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    linea_sepolia: {
      url: "https://rpc.sepolia.linea.build/",
      accounts: [process.env.PRIVATE_KEY_DEPLOYER],
    },
  },
  etherscan: {
    apiKey: {
      linea_sepolia: process.env.LINEASCAN_API_KEY,
    },
    customChains: [
      {
        network: "linea_sepolia",
        chainId: 59141,
        urls: {
          apiURL: "https://api-sepolia.lineascan.build/api",
          browserURL: "https://sepolia.lineascan.build/address",
        },
      },
    ],
  },
};

export default config;
