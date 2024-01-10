// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

// Error declaration for custom error handling.
error Raffle__NotEnoughETHEntered();
error Raffle__TransferFailed();
error Raffle__ContractIsNotOpenYet();
error Raffle__UpKeepNotNeeded(
    bool isTimeIntervalPassed,
    bool isRaffleOpen,
    bool hasBalance,
    bool hasPlayers
);

/**
 * @title Raffle Contract
 * @author Nawodya Ishan GitHub - nawodyaishan
 * @dev This contract implements a simple raffle game using Chainlink VRF for randomness and Chainlink Automation services.
 * It's an example contract and not meant for production use.
 */
contract Raffle is VRFConsumerBaseV2, AutomationCompatibleInterface {
    /*Type Declarations*/
    enum RaffleState {
        OPEN,
        CALCULATING_WINNER
    } // uint256 0 = OPEN ......

    // State Variables
    address payable[] private s_players; // Array of participants' addresses
    uint256 private immutable i_entranceFee; // Entrance fee to participate in the raffle
    bytes32 private immutable i_gasLane; // Key hash used for requesting randomness
    uint64 private immutable i_subscriptionId; // Chainlink subscription ID
    uint32 private immutable i_callbackGasLimit; // Gas limit for the callback request
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator; // Chainlink VRF Coordinator contract
    address private s_recentWinner; // Address of the most recent winner
    RaffleState private s_raffleState;
    uint256 private s_lastTimestamp;
    uint256 private immutable i_timeInterval;

    // Constants
    uint16 private constant REQUEST_CONFIRMATIONS = 3; // Number of confirmations for VRF request
    uint16 private constant NUMBER_OF_WORDS = 1; // Number of random words requested

    // Events
    event RaffleEnter(address indexed player); // Emitted when a player enters the raffle
    event RequestedRaffleWinner(uint256 indexed requestId); // Emitted when a winner request is made
    event WinnerPicked(address indexed winner); // Emitted when a winner is picked

    /**
     * @notice Constructor to initialize the raffle contract with necessary Chainlink parameters.
     * @param vrfCoordinatorV2 Address of the Chainlink VRF Coordinator contract
     * @param entranceFee Fee required to enter the raffle
     * @param gasLane Key hash for requesting randomness
     * @param subscriptionId Chainlink subscription ID for funding VRF requests
     * @param callbackGasLimit Gas limit for the callback of the randomness request
     */
    constructor(
        address vrfCoordinatorV2,
        uint256 entranceFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        uint256 timeInterval
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        s_raffleState = RaffleState.OPEN;
        s_lastTimestamp = block.timestamp;
        i_timeInterval = timeInterval;
    }

    /**
     * @notice Allows a user to enter the raffle by paying the entrance fee.
     * @dev Emits a RaffleEnter event upon successful entry.
     */
    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }
        if (s_raffleState != RaffleState.OPEN) {
            revert Raffle__ContractIsNotOpenYet();
        }
        s_players.push(payable(msg.sender));
        emit RaffleEnter(msg.sender);
    }

    /**
     * @notice Initiates a request to the Chainlink VRF for a random number to select a winner.
     * @dev Emits a RequestedRaffleWinner event. Restricted access may be required in a real scenario.
     */
    function performUpkeep(bytes calldata /*performData*/) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert Raffle__UpKeepNotNeeded(
                isTimeIntervalPassed(),
                isRaffleOpen(),
                hasBalance(),
                hasPlayers()
            );
        }

        // Changing contract state prior to do picking winner process
        s_raffleState = RaffleState.CALCULATING_WINNER;
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUMBER_OF_WORDS
        );
        emit RequestedRaffleWinner(requestId);
    }

    /*
    @dev this function is called by off chain chainlink keeper nodes to look for the 'upkeepNeeded' to return true by checking the time interval
    * Following should become true to picking a random winner
    * Conditions
    * 1. Time Interval Conditions
    * 2. Lottery should have 1 player nad ETH
    * 3. Our subscription for automation must funded with LINK tokens.
    * 4. Lottery contract should be in open state
    */
    function checkUpkeep(
        bytes memory /* checkData */
    ) public override returns (bool upkeepNeeded, bytes memory performData) {
        upkeepNeeded = (isTimeIntervalPassed() && isRaffleOpen() && hasBalance() && hasPlayers());
        performData = ""; // or return an appropriate value if needed
    }

    /**
     * @notice Callback function used by VRF Coordinator to return the random number.
     * @param randomWords Array of random words returned by VRF Coordinator.
     * @dev Selects the winner based on the random number. Emits a WinnerPicked event.
     */
    function fulfillRandomWords(
        uint256 /* requestId */,
        uint256[] memory randomWords
    ) internal override {
        require(s_players.length > 0, "No players to select from");
        require(randomWords.length > 0, "No random words provided");

        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;

        // Resetting States
        s_raffleState = RaffleState.OPEN; // Changing state of the contract for accepting new players
        s_players = new address payable[](0); // Resetting the player array for new session
        s_lastTimestamp = block.timestamp; // Setting new time s_lastTimestamp

        (bool success, ) = recentWinner.call{value: address(this).balance}("");

        if (!success) {
            revert Raffle__TransferFailed();
        }
        emit WinnerPicked(recentWinner);
    }

    // Public View Functions

    /**
     * @notice Returns the entrance fee for the raffle.
     * @return Fee amount in ETH.
     */
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    /**
     * @notice Retrieves a player's address based on the provided index.
     * @param index Index of the player in the array.
     * @return Address of the player.
     */
    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }

    /**
     * @notice Returns the address of the most recent raffle winner.
     * @return Address of the recent winner.
     */
    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }

    /**
     * @notice Checks if the specified time interval has passed since the last timestamp.
     * @return isTimePassed A boolean indicating if the time interval has passed.
     */
    function isTimeIntervalPassed() public view returns (bool isTimePassed) {
        isTimePassed = ((block.timestamp - s_lastTimestamp) >= i_timeInterval);
    }

    /*
     * @dev Returns the value of the `s_lastTimestamp` state variable.
     * This function is marked as `view` since it reads the contract's state but doesn't modify it.
     * It's used to retrieve the timestamp of the last significant event or action in the contract.
     *
     * @return uint256 The value of the last recorded timestamp in the contract's state.
     */
    function getLastTimestamp() public view returns (uint256 lastTimestamp) {
        lastTimestamp = s_lastTimestamp;
    }

    /**
     * @notice Checks if the raffle is in the OPEN state.
     * @return isOpen A boolean indicating if the raffle is currently open.
     */
    function isRaffleOpen() public view returns (bool isOpen) {
        isOpen = (s_raffleState == RaffleState.OPEN);
    }

    /**
     * @notice Checks if there are any players in the raffle.
     * @return hasMinimumPlayers A boolean indicating if there are any players.
     */
    function hasPlayers() public view returns (bool hasMinimumPlayers) {
        hasMinimumPlayers = (s_players.length > 0);
    }

    /**
     * @notice returns the number of players.
     * @return numberOfPlayers A number that indicates the current player count in the contract.
     */
    function getNumberOfPlayers() public view returns (uint256 numberOfPlayers) {
        numberOfPlayers = s_players.length;
    }

    /**
     * @notice Checks if the contract's balance is greater than zero.
     * @return hasMinimumBalance A boolean indicating if the contract has a positive balance.
     */
    function hasBalance() public view returns (bool hasMinimumBalance) {
        hasMinimumBalance = (address(this).balance > 0);
    }

    /*
     * @dev Returns the constant value of NUMBER_OF_WORDS.
     * This function is marked as `pure` since it doesn't read or modify the contract's state. Actually it reads from the byte code
     * It's used to retrieve the number of random words that will be requested from Chainlink VRF.
     *
     * @return uint256 The number of random words to be requested.
     */
    function getNumWords() public pure returns (uint256) {
        return NUMBER_OF_WORDS;
    }

    /*
     * @dev Returns the constant value of `REQUEST_CONFIRMATIONS`.
     * This function is marked as `pure` as it neither reads nor modifies the contract's state.
     * It's used to retrieve the number of confirmations required for a request,
     * typically in the context of external service interactions like Chainlink VRF.
     *
     * @return uint256 The number of confirmations required for a request.
     */
    function getRequestConfirmations() public pure returns (uint256) {
        return REQUEST_CONFIRMATIONS;
    }
}
