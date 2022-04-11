import "@nomiclabs/hardhat-waffle";
import "solidity-coverage";
import "hardhat-gas-reporter";
import "@typechain/hardhat";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-etherscan";
import { HardhatUserConfig, task } from "hardhat/config";
require("dotenv").config();

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    mumbai: {
      url: 'https://speedy-nodes-nyc.moralis.io/' + process.env.SPEEDY_NODES + '/polygon/mumbai',
      accounts: [process.env.DEV_PRIVATE_KEY as string],
      gasPrice: 3 * 1000000000,
    },
    polygon: {
      url: 'https://speedy-nodes-nyc.moralis.io/' + process.env.SPEEDY_NODES + '/polygon/mainnet',
    },
    goerli: {
      url: 'https://speedy-nodes-nyc.moralis.io/' + process.env.SPEEDY_NODES + '/eth/goerli',
      accounts: [process.env.DEV_PRIVATE_KEY as string],
    },
    rinkeby: {
      url: 'https://speedy-nodes-nyc.moralis.io/' + process.env.SPEEDY_NODES + '/eth/rinkeby',
      accounts: [process.env.DEV_PRIVATE_KEY as string],
    },
    kovan: {
      url: 'https://speedy-nodes-nyc.moralis.io/' + process.env.SPEEDY_NODES + '/eth/kovan',
      accounts: [process.env.DEV_PRIVATE_KEY as string],
    },
    mainnet: {
      url: 'https://mainnet.infura.io/v3/19a1a11180b14862a1f5769b4da68a85',
    },
    hardhat: {
      initialBaseFeePerGas: 0,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 10000,
          },
        },
      },
    ],
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 200,
    enabled: !!process.env.REPORT_GAS,
    coinmarketcap: process.env.COINMARKETCAP_KEY,
    url: 'https://speedy-nodes-nyc.moralis.io/' + process.env.SPEEDY_NODES + '/eth/mainnet',
    token: 'ETH'
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API,
      ropsten: process.env.ETHERSCAN_API,
      rinkeby: process.env.ETHERSCAN_API,
      goerli: process.env.ETHERSCAN_API,
      polygon: process.env.POLYGON_API,
      polygonMumbai: process.env.POLYGON_API
    },
  },
};

task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

export default config;
