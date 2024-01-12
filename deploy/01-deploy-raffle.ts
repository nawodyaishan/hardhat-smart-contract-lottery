import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { developmentChains, networkConfig } from "../helper-hardhat-config"
import verify from "../utils/verify"

const deployRaffle: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
    const { network, getNamedAccounts, deployments, ethers } = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (!chainId) {
        console.log("Invalid chain Id detected.")
        throw new Error("Invalid chain Id.")
    }

    console.log(`🚚 - Preparing to deploy Raffle Contract on chainId: ${chainId}`)
    console.log("----------------------------------")

    const VRF_SUBSCRIPTION_FUND_AMOUNT = ethers.utils.parseEther("2")
    let vrfCoordinatorV2Address: string | undefined, subscriptionId: string | undefined

    if (chainId === 31337) {

        console.log("Local chain detected. Accessing Deployed mocks...")
        console.log("----------------------------------")

        const VRFCoordinatorV2MockContractDeployment = await deployments.get("VRFCoordinatorV2Mock")

        if (!VRFCoordinatorV2MockContractDeployment) {
            console.log("VRFCoordinatorV2MockContractDeployment not found. Deploying Mocks")
            await deployments.fixture(["VRFCoordinatorV2Mock"])
        }
        vrfCoordinatorV2Address = VRFCoordinatorV2MockContractDeployment.address

        console.log(`VRFCoordinatorV2Mock deployed at ${vrfCoordinatorV2Address}`)

        const VRFCoordinatorV2MockContract = await ethers.getContractAt(
            VRFCoordinatorV2MockContractDeployment.abi, vrfCoordinatorV2Address
        )

        const transactionResponse = await VRFCoordinatorV2MockContract.createSubscription()
        const transactionReceipt = await transactionResponse.wait(1)
        subscriptionId = transactionReceipt.events[0].args.subId.toString()

        await VRFCoordinatorV2MockContract.fundSubscription(subscriptionId, VRF_SUBSCRIPTION_FUND_AMOUNT)
        console.log(`Subscription ${subscriptionId} funded with ${VRF_SUBSCRIPTION_FUND_AMOUNT.toString()} ether.`)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]?.vrfCoordinatorV2
        subscriptionId = networkConfig[chainId]?.subscriptionId
    }

    if (!vrfCoordinatorV2Address || !subscriptionId) {
        throw new Error("VRF Coordinator address or subscription ID not found.")
    }

    const networkSettings = networkConfig[chainId]
    if (!networkSettings) {
        throw new Error(`No configuration found for chain ID: ${chainId}`)
    }

    const { raffleEntranceFee, gasLane, callbackGasLimit, keepersUpdateInterval } = networkSettings
    if (!raffleEntranceFee || !gasLane || !callbackGasLimit || !keepersUpdateInterval) {
        throw new Error("Network settings are incomplete.")
    }

    const args: any[] = [
        vrfCoordinatorV2Address, raffleEntranceFee, gasLane, subscriptionId, callbackGasLimit, keepersUpdateInterval
    ]

    console.log("----------------------------------")
    console.log("Deploying Raffle Contract.........")

    const raffleContract = await deploy("Raffle", {
        from: deployer, args, log: true, waitConfirmations: /*network.config.blockConfirmations ||*/ 1
    })

    if (!developmentChains.includes(network.name) && process.env.INFURA_API_KEY) {
        console.log("Verifying deployment...")
        await verify(raffleContract.address, args)
    }

    console.log(`🚀 - Raffle Contract deployed to ${network.name}. Address: ${raffleContract.address}`)
    console.log("----------------------------------")
}

export default deployRaffle
deployRaffle.tags = ["all", "Raffle"]
