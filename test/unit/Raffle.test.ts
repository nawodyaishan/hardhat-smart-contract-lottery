import { developmentChains } from "../../helper-hardhat-config"
import { network } from "hardhat"

const checkForNetworkNameInChain = developmentChains.includes(network.name)

// !checkForNetworkNameInChain ? describe.skip :

const raffleContractUnitTests = describe("🧪 - Raffle Unit Tests", () => {

})