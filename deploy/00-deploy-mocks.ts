import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { ethers } from "hardhat"

const BASE_FEE = ethers.utils.parseEther("0.25") // Premium fee in LINK (0.25 LINK)
const GAS_PRICE_LINK = 1e9 // Gas price in LINK (0.000000001 LINK per gas unit)

const deployMocks: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, network } = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    console.log("----------------------------------")

    if (!chainId) {
        console.log("Invalid chain ID detected.")
        throw new Error("Invalid chain ID.")
    }

    // Deploy mocks only on local development network
    if (chainId === 31337) {
        console.log("🐳 - Local network detected! Deploying mocks...")

        // Deploy the VRFCoordinatorV2Mock contract
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            args: [BASE_FEE, GAS_PRICE_LINK],
            log: true
        })

        console.log("🚀 - Mocks Deployed!")
        console.log("----------------------------------")
    }
}

export default deployMocks
deployMocks.tags = ["all", "mocks", "VRFCoordinatorV2Mock"]
