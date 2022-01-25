// SPDX-License-Identifier: UNLINSED
pragma solidity ^0.8.0;

// contracts that implements NFT methods to our contract
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract AuctionBox {
    // auctions array
    Auction[] public auctions;

    // add to auctions array new Auction instance
    function createAuction(
        string memory title,
        uint startPrice,
        string memory description
    ) public {

    }

    // just return our auctions array
    function getAutcions() public view returns (Auction[] memory) {
        return auctions;
    }
}

contract Auction {
    address payable private owner;
    string title;
    uint256 startPrice;
    uint256 startTime; // now - time when auction created
    uint256 endTime; //time when auction will be closed
    string descriprion;

    // create enum type of auction states
    enum State{Running, Finallized}
    // create auction state
    State public auctionState;

    // data of bidder
    uint256 public highestPrice;
    address payable public highestBidder;

    // bids list
    mapping(address => uint256) bids;

}

contract NFT is ERC721URIStorage{
    uint256 public tokenCounter; // id of current 

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
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