import "@typechain/hardhat"
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-ethers"
import "hardhat-gas-reporter"
import "dotenv/config"
import "solidity-coverage"
import "hardhat-deploy"
import { HardhatUserConfig } from "hardhat/config"

/**
 * @type import('hardhat/config').HardhatUserConfig
 */


// Accessing Environment variables
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL
if (!MAINNET_RPC_URL) throw new Error("Environment variable MAINNET_RPC_URL is not set!")

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
if (!SEPOLIA_RPC_URL) throw new Error("Environment variable SEPOLIA_RPC_URL is not set!")

const AVALANCHE_FUJI_RPC_URL = process.env.AVALANCHE_FUJI_RPC_URL
if (!AVALANCHE_FUJI_RPC_URL) throw new Error("Environment variable AVALANCHE_FUJI_RPC_URL is not set!")

const PRIVATE_KEY = process.env.PRIVATE_KEY
if (!PRIVATE_KEY) throw new Error("Environment variable PRIVATE_KEY is not set!")

const MNEMONIC = process.env.MNEMONIC
if (!MNEMONIC) throw new Error("Environment variable MNEMONIC is not set!")

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
if (!COINMARKETCAP_API_KEY) throw new Error("Environment variable COINMARKETCAP_API_KEY is not set!")

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
if (!ETHERSCAN_API_KEY) throw new Error("Environment variable ETHERSCAN_API_KEY is not set!")

const INFURA_API_KEY = process.env.INFURA_API_KEY
if (!INFURA_API_KEY) throw new Error("Environment variable INFURA_API_KEY is not set!")

const REPORT_GAS = process.env.REPORT_GAS || false


const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337
        },
        localhost: {
            chainId: 31337
        },
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
            //   accounts: {
            //     mnemonic: MNEMONIC,
            //   },
            saveDeployments: true,
            chainId: 11155111
        },
        mainnet: {
            url: MAINNET_RPC_URL,
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
            //   accounts: {
            //     mnemonic: MNEMONIC,
            //   },
            saveDeployments: true,
            chainId: 1
        },
        fuji: {
            url: AVALANCHE_FUJI_RPC_URL,
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
            saveDeployments: true,
            chainId: 43113
        }
    },
    etherscan: {
        // npx hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
        apiKey: {
            sepolia: ETHERSCAN_API_KEY
        }
    },
    gasReporter: {
        enabled: false,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true
        // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0 // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
        player: {
            default: 1
        }
    },
    solidity: {
        compilers: [
            {
                version: "0.8.22"
            },
            {
                version: "0.4.24"
            }
        ]
    },
    mocha: {
        timeout: 200000 // 200 seconds max for running tests
    }
}

export default config