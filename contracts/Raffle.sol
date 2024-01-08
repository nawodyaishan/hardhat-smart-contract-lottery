// Raffle
// Enter the lottery
// Pick a Random Winner
// Winner Should selected automatically { Every x minutes }
// ChainLink Oracle => Randomness and Automated Execution (Off Chain ChainLink Keepers)

// SPDX-License-Identifier: MIT
// The above line is a license identifier used to inform users about the license governing this piece of software.

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

// Error declaration for custom error handling.
    error Raffle__NotEnoughETHEntered();

// This is the start of the Raffle contract.
contract Raffle is VRFConsumerBaseV2 {
    // State Variables

    // 's_players' is an array to hold the addresses of the participants in the raffle.
    address payable[] private s_players;

    // immutable variables, meaning it can only be set once and cannot be changed later when deploying the contract.
    uint256 private immutable i_entranceFee;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;

    // Constants
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint16 private constant NUMBER_OF_WORDS = 1;

    // Events
    event RaffleEnter(address indexed Player);
    event RequestedRaffleWinner(uint256 indexed requestId);

    // Constructor function which runs once upon contract deployment.
    constructor(address vrfCoordinatorV2, uint256 entranceFee, bytes32 gasLane, uint64 subscriptionId, uint32 callbackGasLimit) VRFConsumerBaseV2(vrfCoordinatorV2){
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    // 'enterRaffle' is a function that allows a user to enter the raffle.
    function enterRaffle() public payable {
        // Checks if the sent value is less than the entrance fee.
        // If true, it reverts the transaction and triggers the custom error.
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }

        // If the check passes, the address of the sender is added to the 's_players' array.
        s_players.push(payable(msg.sender));

        // Event for emit when updating a dynamic array or mapping
        // Named events with functions name reversed (enterRaffle()=> raffleEnter())
        emit RaffleEnter(msg.sender);
    }

    // Picking Random winners using chain-link
    function pickRandomWinner() external {
        // Req a Random Number from Chainlink VRF v2 Coordinator
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUMBER_OF_WORDS
        );

        // Emitting event for the selected winner
        emit RequestedRaffleWinner(requestId);

        // Using it to pick a winner
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        require(s_players.length > 0, "No players to select from");
        require(randomWords.length > 0, "No random words provided");

        // Using modulo operator for selecting a winner
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address winner = s_players[indexOfWinner];

    }

    // Public view functions

    // 'getEntranceFee' allows anyone to view the entrance fee for the raffle.
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    // 'getPlayer' allows anyone to retrieve an address of a player from the 's_players' array using an index.
    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }
}
