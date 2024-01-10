import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const deployRaffle: DeployFunction = async (hardhatRuntimeEnvironment: HardhatRuntimeEnvironment): Promise<void> => {
    const { network, getNamedAccounts, deployments } = hardhatRuntimeEnvironment
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()




    // log("----------------------------------------------------")
    // const args: any[] = [
    //     vrfCoordinatorV2Address,
    //     subscriptionId,
    //     networkConfig[network.config.chainId!]["gasLane"],
    //     networkConfig[network.config.chainId!]["keepersUpdateInterval"],
    //     networkConfig[network.config.chainId!]["raffleEntranceFee"],
    //     networkConfig[network.config.chainId!]["callbackGasLimit"],
    // ]
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