// SPDX-License-Identifier: UNLINSED
pragma solidity ^0.8.0;

contract TestShop {
    // uint, uint256 - unsignet integer (2**256)
    // uint8 - 0-255 (2**8)
    // address - address of blockchain user or smart_contract address

    uint public price_wei = 2; // 2 wei
    uint public price = 2 ether; // 2 ethereum
    address public owner;
    address public contractAddress;

    // mapping (key => value). Like array
    mapping(address => bool) buyers;
    bool sales = false;

    // create new event
    event PaidEvent(uint price, address contractAddress);

    // this function is called when the contract is deployed on the blockchain
    constructor(){
        // msg - global variable
        owner = msg.sender;

        // this - this contract
        // address() - change type to address
        contractAddress = address(this);
    }

    // view - function doesn't change anything, it only return some value
    function getBalance() public view returns (uint){
        // all vars with type address have field balance (owner.balance)
        return contractAddress.balance;
    }

    // no "view" because we modify our data
    function addBuyer(address payable buyerAddress) public{
        // it's condition
        // only owner of this contract can call this method
        require(owner == msg.sender, "you are not owner!");

        // add this address to buyers mapping
        buyers[buyerAddress] = true;
    }

    function getBuyer(address buyerAddress) public view returns(bool) {
        return buyers[buyerAddress];
    }

    // external - function is called only outside of our contract
    // payable - function can receive money
    receive() external payable {
        require(
            buyers[msg.sender] // this buyer exists
            && msg.value != price
            && !sales, // reject transaction with amount, that is more than the price
            "You've payed the wrong amount"
        );

        if(contractAddress.balance == price) {
            sales = true;

            // call event
            emit PaidEvent(price, msg.sender);
        }
    }


    function withdraw() public{
        require(owner == msg.sender && sales && contractAddress.balance > 0, "Rejected");

        // create local variable with address of receiver (owner)
        // only payable can do some actions with ether
        address payable receiver = payable(msg.sender);

        // send to receiver all ethereum from contract address
        receiver.transfer(contractAddress.balance);
    }
}