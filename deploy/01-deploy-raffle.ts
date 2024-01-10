import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { developmentChains, networkConfig } from "../helper-hardhat-config"
import verify from "../utils/verify"

const deployRaffle: DeployFunction = async (hardhatRuntimeEnvironment: HardhatRuntimeEnvironment): Promise<void> => {
    try {
        const { network, getNamedAccounts, deployments, ethers } = hardhatRuntimeEnvironment
        const { deploy, log } = deployments
        const { deployer } = await getNamedAccounts()
        const chainId = network.config.chainId
        if (!chainId) throw Error("Invalid chain Id!!")
        log("ChainID", chainId)
        const VRF_SUBSCRIPTION_FUND_AMOUNT = ethers.utils.parseEther("2")

        let vrfCoordinatorV2Address: string | undefined, subscriptionId: string | undefined
        if (chainId == 31337) {
            log("----------------------------------------------------")

            // Creating VRF V2 Subscription
            await deployments.fixture(["VRFCoordinatorV2Mock", "mocks"])
            const VRFCoordinatorV2MockContractDeployment = await deployments.get("VRFCoordinatorV2Mock")
            if (!VRFCoordinatorV2MockContractDeployment) throw Error("⚠️ - VRFCoordinatorV2MockContractDeployment not found!")
            log(`VRFCoordinatorV2MockContractDeployment Address - ${VRFCoordinatorV2MockContractDeployment.address}`)
            const VRFCoordinatorV2MockContract = await ethers.getContractAt(
                VRFCoordinatorV2MockContractDeployment.abi,
                VRFCoordinatorV2MockContractDeployment.address
            )
            vrfCoordinatorV2Address = VRFCoordinatorV2MockContract.address
            const transactionResponse = await VRFCoordinatorV2MockContract.createSubscription()
            const transactionReceipt = await transactionResponse.wait(1)
            subscriptionId = transactionReceipt.events[0].args.subId

            // Fund the subscription
            // Our mock makes it, so we don't actually have to worry about sending fund
            await VRFCoordinatorV2MockContract.fundSubscription(subscriptionId, VRF_SUBSCRIPTION_FUND_AMOUNT)
        } else {
            vrfCoordinatorV2Address = networkConfig[network.config.chainId!]["vrfCoordinatorV2"]
            subscriptionId = networkConfig[network.config.chainId!]["subscriptionId"]
        }

        log("----------------------------------------------------")

        // Defining Raffle Contract Constructor Args
        const networkSettings = networkConfig[chainId]
        if (!networkSettings) throw new Error(`No configuration found for chain ID: ${chainId}`)
        const raffleEntranceFee = networkSettings["raffleEntranceFee"]
        if (!raffleEntranceFee) throw new Error("Raffle entrance fee is undefined!")
        const gasLane = networkSettings["gasLane"]
        if (!gasLane) throw new Error("Gas lane is undefined!")
        const callbackGasLimit = networkSettings["callbackGasLimit"]
        if (!callbackGasLimit) throw new Error("Callback gas limit is undefined!")
        const keepersUpdateIntervalTime = networkSettings["keepersUpdateInterval"]
        if (!keepersUpdateIntervalTime) throw new Error("Keepers update interval time is undefined!")
        if (!vrfCoordinatorV2Address) throw new Error("vrfCoordinatorV2Address is undefined!")
        if (!subscriptionId) throw new Error("subscriptionId is undefined!")

        const args: any[] = [
            vrfCoordinatorV2Address,
            raffleEntranceFee,
            gasLane,
            subscriptionId,
            callbackGasLimit,
            keepersUpdateIntervalTime
        ]
        //
        // const  waitBlockConfirmations = developmentChains.includes(network.name)
        //     ? 1
        //     : VERIFICATION_BLOCK_CONFIRMATIONS

        log("🚀 - Starting deploying Raffle Contract")
        const raffleContract = await deploy("Raffle", {
            from: deployer,
            args: args,
            log: true,
            waitConfirmations: 1
        })

        // Verify the deployment
        if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
            log("Verifying...")
            await verify(raffleContract.address, args)
        }

        log("Run Price Feed contract with command:")
        const networkName = network.name == "hardhat" ? "localhost" : network.name
        log(`yarn hardhat run scripts/enterRaffle.ts --network ${networkName}`)
        log("----------------------------------------------------")
    } catch (e) {
        console.log(e)
    }
}
export default deployRaffle

deployRaffle.tags = ["all", "Raffle"]