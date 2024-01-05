// Raffle
// Enter the lottery
// Pick a Random Winner
// Winner Should selected automatically { Every x minutes }
// ChainLink Oracle => Randomness and Automated Execution (Off Chain ChainLink Keepers)

// SPDX-License-Identifier: MIT
// The above line is a license identifier used to inform users about the license governing this piece of software.

pragma solidity ^0.8.7;

// Error declaration for custom error handling.
    error Raffle__NotEnoughETHEntered();

// This is the start of the Raffle contract.
contract Raffle {
    // State Variables

    // 'i_entranceFee' holds the entrance fee for the raffle. It's an immutable variable, meaning it can only be set once and cannot be changed later.
    uint256 private immutable i_entranceFee;

    // 's_players' is an array to hold the addresses of the participants in the raffle.
    address payable[] private s_players;

    // This is the constructor function which runs once upon contract deployment.
    // It sets the value of 'i_entranceFee'.
    constructor(uint256 entranceFee){
        i_entranceFee = entranceFee;
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

        // Events

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
