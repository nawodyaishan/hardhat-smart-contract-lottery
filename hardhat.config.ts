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

const MAINNET_RPC_URL =
    process.env.MAINNET_RPC_URL ||
    process.env.ALCHEMY_MAINNET_RPC_URL ||
    "https://eth-mainnet.alchemyapi.io/v2/your-api-key"
const SEPOLIA_RPC_URL =
    process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/126fa49371d24f01b0ea6599f3307e63"
const AVALANCHE_FUJI_RPC_URL =
    process.env.AVALANCHE_FUJI_RPC_URL || "https://avalanche-fuji.infura.io/v3/126fa49371d24f01b0ea6599f3307e63"
const PRIVATE_KEY = process.env.PRIVATE_KEY
// optional
const MNEMONIC = process.env.MNEMONIC || "your mnemonic"

const FUGI_RPC_URL = process.env.SEPOLIA_RPC_URL

// Your API key for Etherscan, obtain one at https://etherscan.io/
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "Your etherscan API key"
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "Your polygonscan API key"
const REPORT_GAS = process.env.REPORT_GAS || false

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
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
            sepolia: ETHERSCAN_API_KEY,
            polygon: POLYGONSCAN_API_KEY
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