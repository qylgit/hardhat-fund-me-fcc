require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("solidity-coverage")
require("hardhat-deploy")
/** @type import('hardhat/config').HardhatUserConfig */


const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""
const SEPOLIA_RPC_URL =
    process.env.SEPOLIA_RPC_URL ||
    "https://eth-sepolia.g.alchemy.com/v2/RIKm0qgpqUxCbiaTwH2CWfrsSaUwmWSJ"
const PRIVATE_KEY =
    process.env.PRIVATE_KEY ||
    "7a5caf4c131ddd7a988ba8f6e71c6fa6aa21d377c24a77ef57ad0777a77406ce"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "U8EX6UQTD5HZYSDU3UTZM87QUQHITHR1S2"

module.exports = {
  // solidity: "0.8.7",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
        chainId: 31337,
        // gasPrice: 130000000000,
    },
    sepolia: {
        url: SEPOLIA_RPC_URL,
        accounts: [PRIVATE_KEY],
        chainId: 11155111,
        blockConfirmations: 6,
    },
  },
  solidity: {
      compilers: [
          {
              version: "0.8.7",
          },
          {
              version: "0.8.19",
          },
          {
              version: "0.6.6",
          },
      ],
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
    // customChains: [], // uncomment this line if you are getting a TypeError: customChains is not iterable
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    // coinmarketcap: COINMARKETCAP_API_KEY,
  },
  namedAccounts: {
    deployer: {
        default: 0, // here this will by default take the first account as deployer
        1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
    user: {
      default: 1
    }
  },
  mocha: {
    timeout: 500000,
  },
};
