// SPDX-License-Identifier: UNLINSED
pragma solidity ^0.8.0;

// contracts that implements NFT methods to our contract
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

struct AuctionContent {
    address owner;
    string title;
    string description;
    uint256 nftTokenId;
    uint256 startPrice;
    uint256 endTime;
}

contract AuctionBox{
    // auctions array
    Auction[] public auctions;

    // call event when auction is created
    event AuctionCreated(Auction _auction);
    event Log(address _message);

    // add to auctions array new Auction instance
    function createAuction(
        string memory _title,
        string memory _description,
        string memory _tokenURI,
        uint256 _startPrice,
        uint256 _duration //time when auction will be closed
    ) public {
        // create new Auction instance
        Auction newAuction = new Auction(payable(msg.sender), _title, _description, _tokenURI, _startPrice, _duration);

        emit AuctionCreated(newAuction);

        emit Log(newAuction.ownerOf(newAuction.tokenCounter() - 1 ));

        auctions.push(newAuction); // add auction to list
    }

    // just return our auctions array
    function getAutcions() public view returns (Auction[] memory) {
        return auctions;
    }

    function getAuctionById(uint256 _id) public view returns (Auction) {
        return auctions[_id];
    }

    function getAuctionTokenURIById(uint256 _id) public view returns (string memory) {
        return auctions[_id].tokenURI(_id);
    }

    // return content of auction by id
    function getContent(uint256 _id) public view returns (AuctionContent memory) {
        return auctions[_id].getContent();
    }
}

contract NFT is ERC721URIStorage{
    uint256 public tokenCounter; // id of current 

    constructor() ERC721("NiggaNFT", "Nigga") {
        tokenCounter = 0; // count of NFT equals 0 when we deploy contract
    }

    //  constructor(string memory name, string memory symbol) ERC721(name, symbol) {
    //     tokenCounter = 0; // count of NFT equals 0 when we deploy contract
    // }

    function mintNFT(string memory tokenURI) public returns (uint256){
        uint256 newItemId = tokenCounter;

        // create new NFT by owner(sender) and new NFT id
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        
        tokenCounter++; // increase count of NFT

        return newItemId;
    }
}

contract Auction is NFT {
    address payable private owner;
    string public title;
    uint256 public startPrice;
    // uint256 public startTime; // block.timestamp - time when auction created
    uint256 public endTime; //time when auction will be closed
    string public descriprion;
    NFT public product;

    // create enum type of auction states
    enum State{Running, Finallized}
    // create auction state
    State public auctionState;

    // data of bidder
    uint256 public highestPrice;
    address payable public highestBidder;

    // bids list
    mapping(address => uint256) public bids;

    constructor(
        address payable _owner,
        string memory _title,
        string memory _description,
        string memory _tokenURI,
        uint256 _startPrice,
        uint256 _duration
    ) {
        // set data by input data from constructor parameters
        owner = _owner;
        title = _title;
        descriprion = _description;
        startPrice = _startPrice;
        endTime = block.timestamp + _duration; // count end date (now + auction duration)

        // create new NFT product
        // NFT nft = new NFT();
        // nftTokenId = nft.mintNFT(_tokenURI);

        // tokenCounter = 0;
        mintNFT(_tokenURI);
    }

    // just return title of this auction
    function getTitle() public view returns(string memory) {
        return title;
    }
    
    // return structure of fields this auction
    function getContent() public view returns (AuctionContent memory) {
        return AuctionContent(
            owner,
            title,
            descriprion,
            tokenCounter,
            startPrice,
            endTime
        );
    }

    // // return tuple of fields this auction
    // function getContent() public view returns (
    //     address, // owner
    //     string memory, // title
    //     string memory, // descr
    //     uint256, // startPrice
    //     uint256 // endTime
    // ) {
    //     return (
    //         owner,
    //         title,
    //         descriprion,
    //         startPrice,
    //         endTime
    //     );
    // }
}

// abstract contract AuctionStructure is AuctionBox, Auction{

// }