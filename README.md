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
