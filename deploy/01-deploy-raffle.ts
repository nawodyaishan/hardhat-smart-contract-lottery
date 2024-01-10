import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { networkConfig } from "../helper-hardhat-config"

const deployRaffle: DeployFunction = async (hardhatRuntimeEnvironment: HardhatRuntimeEnvironment): Promise<void> => {
    const { network, getNamedAccounts, deployments, ethers } = hardhatRuntimeEnvironment
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    if (!chainId) throw Error("Invalid chain Id!!")

    let vrfCoordinatorV2Address: string | undefined, subscriptionId: string | undefined
    if (chainId == 31337) {

        // Creating VRF V2 Subscription
        await deployments.fixture(["VRFCoordinatorV2Mock"]);
        const VRFCoordinatorV2MockContractDeployment = await deployments.get("VRFCoordinatorV2Mock");
        const VRFCoordinatorV2MockContract = await ethers.getContractAt(
            VRFCoordinatorV2MockContractDeployment.abi,
            VRFCoordinatorV2MockContractDeployment.address
        );
        vrfCoordinatorV2Address = VRFCoordinatorV2MockContract.address
        // const transactionResponse = await VRFCoordinatorV2MockContract.createSubscription()
        // const transactionReceipt = await transactionResponse.wait()
        // subscriptionId = transactionReceipt.events[0].args.subId
        //
        // // Fund the subscription
        // // Our mock makes it so we don't actually have to worry about sending fund
        // await VRFCoordinatorV2MockContract.fundSubscription(subscriptionId, FUND_AMOUNT)
    } else {
        vrfCoordinatorV2Address = networkConfig[network.config.chainId!]["vrfCoordinatorV2"]
        subscriptionId = networkConfig[network.config.chainId!]["subscriptionId"]
    }



    log("----------------------------------------------------")
    const args: any[] = [
        vrfCoordinatorV2Address,
        subscriptionId,
        networkConfig[network.config.chainId!]["gasLane"],
        networkConfig[network.config.chainId!]["keepersUpdateInterval"],
        networkConfig[network.config.chainId!]["raffleEntranceFee"],
        networkConfig[network.config.chainId!]["callbackGasLimit"],
    ]
    //
    // const  waitBlockConfirmations = developmentChains.includes(network.name)
    //     ? 1
    //     : VERIFICATION_BLOCK_CONFIRMATIONS

    const raffleContract = await deploy("Raffle", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: 1
    })
}