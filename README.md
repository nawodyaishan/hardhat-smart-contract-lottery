# Hardhat Smart Contract Lottery

## Description
"Hardhat Smart Contract Lottery" is a blockchain project that leverages Ethereum smart contracts to implement a lottery system. Developed using Hardhat, this project provides a comprehensive setup for Solidity development, testing, and deployment. It's an ideal template for developers looking to build and deploy Ethereum-based decentralized applications.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/)
- [Bun](https://bun.sh/)

### Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/nawodyaishan/hardhat-smart-contract-lottery.git
cd hardhat-smart-contract-lottery
bun install
```

## Usage

### Available Scripts
- `clean`: Clears the build artifacts and cache.
- `compile`: Compiles the smart contracts.
- `coverage`: Runs tests with coverage analysis.
- `deploy:contracts`: Deploys contracts to the specified network.
- `lint`: Lints Solidity and TypeScript files.
- `prettier:check`: Checks code formatting.
- `prettier:write`: Formats code.
- `test`: Runs tests for the contracts.
- `typechain`: Generates TypeScript typings for contracts.

### Deploying Contracts
Deploy the smart contracts using:
```bash
bun run deploy:contracts
```

## Managing Environment Variables

### `.env` File Setup
The project uses an `.env` file to manage sensitive and network-specific variables. This file should be located at the root of the project directory and is not tracked by version control for security reasons.

### Required Variables
Here are the key environment variables used in the project:

- `SEPOLIA_RPC_URL`: RPC URL for the Sepolia Ethereum test network.
- `AVALANCHE_FUJI_RPC_URL`: RPC URL for the Avalanche Fuji C-Chain test network.
- `MAINNET_RPC_URL`: RPC URL for the Ethereum Mainnet.
- `PRIVATE_KEY`: Your Ethereum private key. **Do not share this publicly**.
- `MNEMONIC`: A mnemonic phrase for generating Ethereum accounts. **Keep this secure**.
- `ETHERSCAN_API_KEY`: API key for Etherscan, used for contract verification.
- `INFURA_API_KEY`: API key for Infura, used to access Ethereum networks.
- `COINMARKETCAP_API_KEY`: API key for CoinMarketCap, used for fetching token prices.
- `REPORT_GAS`: Set to `true` to enable gas reporting.
- `AUTO_FUND`: Set to `true` to automatically fund accounts in local testing.

### Creating the `.env` File
1. Create a file named `.env` in the root directory of the project.
2. Add the environment variables listed above with your specific values. For example:
   ```
   MAINNET_RPC_URL='https://mainnet.infura.io/v3/YOUR_INFURA_KEY'
   PRIVATE_KEY='your_private_key_here'
   ETHERSCAN_API_KEY='your_etherscan_api_key_here'
   ```
3. Save the file.

### Security Considerations
- **Do not commit the `.env` file to version control**. This file contains sensitive information that should remain confidential.
- Use a `.env.example` file to share the required structure of the `.env` file without revealing sensitive details.
- For added security, especially in production, consider using secret management tools or services.

### Accessing Environment Variables
In your Hardhat and JavaScript files, access these variables using `process.env`. For example:
```javascript
const privateKey = process.env.PRIVATE_KEY;
```

## Smart Contracts

### `Raffle.sol`
Implements the lottery system, allowing users to enter the raffle and automatically selects winners.

### `VRFCoordinatorV2Mock.sol`
A mock contract for local testing of Chainlink's VRF (Verifiable Random Function).

## Development

### Hardhat Configuration
Configured to support a range of networks. The `hardhat.config.ts` file contains network configurations and other Hardhat settings.

### Helper Scripts
`helper-hardhat-config.ts` provides utility functions and configurations used across the project.

### Deployment Scripts
- `00-deploy-mocks.ts`: Deploys mock contracts for local testing.
- `01-deploy-raffle.ts`: Deploys the Raffle contract.

### Testing and Verification
Tests are written using Mocha and Chai. The `verify.ts` script is used for Etherscan verification.

## Author
- Nawodya Ishan - [GitHub](https://github.com/nawodyaishan)
