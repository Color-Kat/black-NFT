// SPDX-License-Identifier: UNLINSED
pragma solidity ^0.8.0;

contract Users {
    // data struct to know, what user exists
    struct UserData{
        User user;
        bool exists;
    }

    mapping (address => UserData) public users;

    // return user by msg.sender
    // if user already exists, return this
    // if it is new user, create new User instance and save it
    function getUser() public returns (User) {
        address userAddress = msg.sender;

        if(users[userAddress].exists) return users[userAddress].user;
        else {
            User user = new User(userAddress);
            users[userAddress].user = user;
            users[userAddress].exists = true;

            return user;
        }
    }
}

contract User {
    address public userAddress;

    constructor (address _userAddress) {
        userAddress = _userAddress;
    }

    function sayHello() public pure returns(string memory){
        return "Hi, i am nigger:(";
    }
}