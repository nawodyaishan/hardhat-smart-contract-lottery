import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { BigNumberish } from "ethers"
import { deployments, ethers, network } from "hardhat"
import { developmentChains, networkConfig } from "../../helper-hardhat-config"
import { assert } from "chai"
import { Raffle, VRFCoordinatorV2Mock } from "../../typechain-types"


const checkForNetworkNameInChain = developmentChains.includes(network.name)

const raffleContractUnitTests = describe("🧪 - Raffle Unit Tests", () => {
    let raffle: Raffle
    let vrfCoordinatorV2Mock: VRFCoordinatorV2Mock
    let raffleEntranceFee: BigNumberish
    let interval: number
    let player: SignerWithAddress
    let accounts: SignerWithAddress[]


    beforeEach(async () => {
        accounts = await ethers.getSigners()
        // deployer = accounts[0]
        player = accounts[1]

        await deployments.fixture(["VRFCoordinatorV2Mock", "Raffle"])
        const raffleDeployment = await deployments.get("Raffle")
        const vrfCoordinatorV2MockDeployment = await deployments.get("VRFCoordinatorV2Mock")
        raffle = await ethers.getContractAt(raffleDeployment.abi, raffleDeployment.address)
        vrfCoordinatorV2Mock = await ethers.getContractAt(vrfCoordinatorV2MockDeployment.abi, vrfCoordinatorV2MockDeployment.address)

        raffle = raffle.connect(player)
        raffleEntranceFee = await raffle.getEntranceFee()
        interval = (await raffle.getInterval()).toNumber()
    })
    describe("👷🏽‍ - Constructor", () => {
        it("initializes the raffle correctly", async () => {
            console.log(network.config.chainId)
            // Ideally, we'd separate these out so that only 1 assert per "it" block
            // And ideally, we'd make this check everything
            const raffleState = (await raffle.isRaffleOpen()).toString()
            assert.equal(raffleState, "true")
            assert.equal(
                interval.toString(),
                networkConfig[network.config.chainId!]["keepersUpdateInterval"]
            )
        })

    })
})

// Conditional Execution
!checkForNetworkNameInChain ? describe.skip : raffleContractUnitTests