// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// contracts that implements NFT methods to our contract
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage{
    uint256 public tokenCounter; // id of current 

    constructor() ERC721("MyNiggeNFT", "Nigga") {
        tokenCounter = 0; // count of NFT equals 0 when we deploy contract
    }

    function mintNFT(string memory tokenURI) public returns (uint256){
        uint256 newItemId = tokenCounter;

        // create new NFT by owner(sender) and new NFT id
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        
        tokenCounter++; // increase count of NFT

        return newItemId;
    }
}