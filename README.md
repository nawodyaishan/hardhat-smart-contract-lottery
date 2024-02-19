# Hardhat Smart Contract Lottery 

This Ethereum project provides a decentralized, transparent lottery system built using Solidity and the Hardhat development environment. It leverages Chainlink VRF for secure randomness in winner selection.

**Prerequisites**

* Node.js ([https://nodejs.org/](https://nodejs.org/))
* Bun ([https://bun.sh/](https://bun.sh/))
* Knowledge of Solidity and smart contract development fundamentals.
* Experience with Hardhat for development and testing.
* Understanding of Chainlink VRF for a verifiable source of randomness.

**Setup**

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/nawodyaishan/hardhat-smart-contract-lottery.git
   cd hardhat-smart-contract-lottery
   ```

2. **Install Dependencies:**

   ```bash
   bun install
   ```

3. **Environment Variables:**

   *  Create a `.env` file in the project root (not tracked by version control).
   *  Use this file to store:
      *  API Keys: Etherscan, Infura, CoinMarketCap.
      *  Network RPC URLs (Sepolia, Mainnet, etc.).
      *  Private keys or mnemonic phrases for testing and deployment.

**Core Smart Contracts**

*  **Raffle.sol**
   *   Entry management (purchase tickets).
   *   Chainlink VRF integration to obtain provably random numbers.
   *   Automated winner selection logic.
   *   Distribution of the prize pool to the winner.

*  **VRFCoordinatorV2Mock.sol**
   *  Implements essential VRF functionality for local development and testing. 

**Essential Hardhat Tasks**

*  `bun run compile`: Compiles smart contracts.
*  `bun run test`: Executes the test suite.
*  `bun run deploy:contracts`: Deploys to the specified network.
*  `bun run verify`: Verifies contracts on Etherscan (use `--network networkName`).

**Development Workflow**

1. **Modify Contracts:** Update Solidity contracts in the `contracts/` directory.
2. **Write Tests:**  Write comprehensive tests in the `test/` directory using Mocha/Chai.
3. **Local Testing:**
    *  `bun run deploy:contracts --network hardhat`
    *  Interact with the contracts, and check test results.
4. **Testnet Deployment:**
    * Configure target testnet in `hardhat.config.ts`
    * Obtain testnet ETH via faucets.
    * Deploy using `bun run deploy:contracts --network <targetNetwork>`
5. **Verification:** Verify contracts on Etherscan using `bun run verify`.


