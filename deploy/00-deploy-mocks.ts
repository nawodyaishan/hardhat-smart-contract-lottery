import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { ethers } from "hardhat"

const BASE_FEE = ethers.utils.parseEther("0.25") // 0.25 is this the premium in 0.25 LINK
const GAS_PRICE_LINK = 1e9 // = 1000000000 link per gas, is this the gas lane? // 0.000000001 LINK per gas

export const deployMocks: DeployFunction = async function(
    hre: HardhatRuntimeEnvironment
) {
    const { deployments, getNamedAccounts, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const contractArguments = [BASE_FEE, GAS_PRICE_LINK]
    const chainId = network.config.chainId
    if (!chainId) throw Error("Invalid chain Id!!")

    // If we are on a local development network, we need to deploy mocks!
    if (chainId == 31337) {
        log("Local network detected! Deploying mocks...")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: contractArguments
        })

        log("Mocks Deployed!")
        log("----------------------------------")

        log("You are deploying to a local network, you'll need a local network running to interact")
        log(
            "Please run `yarn hardhat console --network localhost` to interact with the deployed smart contracts!"
        )
        log("----------------------------------")

    }
}

deployMocks.tags = ["all", "mocks"]