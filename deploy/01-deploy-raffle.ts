import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"


const deployRaffle: DeployFunction = async (hardhatRuntimeEnvironment: HardhatRuntimeEnvironment): Promise<void> => {
    const {  network, getNamedAccounts, deployments} = hardhatRuntimeEnvironment
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
}