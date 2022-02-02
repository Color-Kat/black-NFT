// SPDX-License-Identifier: UNLINSED
pragma solidity ^0.8.0;

// contracts that implements NFT methods to our contract
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "base64-sol/base64.sol"; // base64 encode
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol"; // generate random number

struct AuctionContent {
    address owner;
    string title;
    string description;
    uint256 nftTokenId;
    uint256 startPrice;
    uint256 endTime;
}

contract AuctionBox {
    // auctions array
    Auction[] public auctions;

    // call event when auction is created
    event AuctionCreated(Auction _auction);
    event Log(string _message);

    // add to auctions array new Auction instance
    function createAuction(
        string memory _title,
        string memory _description,
        string memory _svg,
        uint256 _startPrice,
        uint256 _duration //time when auction will be closed
    ) public {
        // create new Auction instance
        Auction newAuction = new Auction(
            payable(msg.sender),
            _title,
            _description,
            _svg,
            _startPrice,
            _duration
        );

        emit AuctionCreated(newAuction);

        // emit Log(newAuction.ownerOf(newAuction.tokenCounter() - 1 ));

        auctions.push(newAuction); // add auction to list

    }

    // just return our auctions array
    function getAuctions() public view returns (Auction[] memory) {
        return auctions;
    }

    function getAuctionById(uint256 _id) public view returns (Auction) {
        return auctions[_id];
    }

    function getAuctionTokenURIById(uint256 _id)
        public
        view
        returns (string memory)
    {
        return auctions[_id].tokenURI(_id);
    }

    // return content of auction by id
    function getContent(uint256 _id)
        public
        view
        returns (AuctionContent memory)
    {
        return auctions[_id].getContent();
    }
}

contract NFT is ERC721URIStorage {
    uint256 public tokenCounter; // id of current nft

    string public nft_name;
    string public nft_description;

    // for VRFConsumerBase
    bytes32 private keyHash;
    uint256 private fee;

    mapping (bytes32 => address) public requestIdToSender;
    mapping (bytes32 => uint256) public requestIdToTokenId;
    mapping (uint256 => uint256) public tokenIdToRandomNumber;

    event NFTCreated(uint256 newItemId, string tokenURI);
    event RequestedRandomSVG(bytes32 indexed requestId, uint256 indexed tokenId);
    event CreatedUnfinishedRandomSVG(uint256 indexed tokenId, uint256 randomNumber);
    event CreatedRandomSVG(uint256 indexed tokenId, string svg);

    // get in constructor some parameters to VRMConsumerBase
    constructor(address _VRFCoordinator, address _LinkToken, bytes32 _keyHash, uint256 _fee) 
        VRFConsumerBase(_VRFCoordinator, _LinkToken) 
        ERC721("Nigga NFT", "NiggaNFT"
    ) {
        keyHash = _keyHash;
        fee = _fee;

        tokenCounter = 0; // count of NFT equals 0 when we deploy contract
    }

    function generateSVG(uint256 _randomNumber) public view returns(string memory finalSVG) {

    }

    // convert svg string to imageURI
    function svgToImageURI(string memory svg) private pure returns (string memory) {
        string memory baseURL = "data:image/svg+xml;base64,";
        string memory svgBase64Encoded = Base64.encode(bytes(string(abi.encodePacked(svg))));
        return string(abi.encodePacked(baseURL,svgBase64Encoded));
    }

    function formatTokenURI(string memory imageURI, string memory name, string memory description) private pure returns (string memory) {
        return string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"', name, '",',
                                '"description":"', description, '",', 
                                '"attributes":"",',  
                                '"image":"',imageURI,'"}'
                            )
                        )
                    )
                )
            );
    }

    // function mintNFT(
    //     string memory svg, 
    //     string memory _title, 
    //     string memory _description
    // ) public returns (uint256) {
    //     uint256 newItemId = tokenCounter;

    //     // create new NFT by owner(sender) and new NFT id
    //     _mint(msg.sender, newItemId);
    //     string memory imageURI = svgToImageURI(svg);
    //     string memory tokenURI = formatTokenURI(imageURI, _title, _description);

    //     _setTokenURI(newItemId, tokenURI);

    //     emit NFTCreated(newItemId, tokenURI);

    //     tokenCounter++; // increase count of NFT

    //     return newItemId;
    // }

    // -----------------------------
    function createNFT(
        string memory _nft_name, 
        string memory _nft_description
    ) public returns (bytes32 requestId) {
        requestId = requestRandomness(keyHash, fee); // get id of random number request
        requestIdToSender[requestId] = msg.sender; // save it to sender(address)

        // here reserve tokenId for this mint
        // by save tokenId to our requestId (for random number)
        uint256 tokenId = tokenCounter;
        requestIdToTokenId[requestId] = tokenId;

        // save nft name and description to future finishMint
        nft_name = _nft_name;
        nft_description = _nft_description;

        tokenCounter++;

        emit RequestedRandomSVG(requestId, tokenId);
    }

    function fulfillRandomness(bytes32 _requestId, uint256 _randomNumber) internal override{
        // here we have a random number - randomNumber
        address nftOwner = requestIdToSender[_requestId]; // get address of owner by requestId 
        uint256 tokenId = requestIdToTokenId[_requestId]; // and so get nft tokenId by the same requestId

        _mint(nftOwner, tokenId);

        // now generate random SVG
        tokenIdToRandomNumber[tokenId] = _randomNumber;
        emit CreatedUnfinishedRandomSVG(tokenId, _randomNumber);
    }

    function finishMint(uint256 _tokenId) public {
        require(bytes(tokenURI(_tokenId)).length, "tokenURI is already all set!");
        require(tokenCounter > _tokenId, "TokenId has not minted yet");
        require(tokenIdToRandomNumber[_tokenId] > 0, "Need to wait for Chainlink VRF create a random number");

        uint256 randomNumber = tokenIdToRandomNumber[_tokenId];
        string memory svg = generateSVG(randomNumber);
        string memory imageURI = svgToImageURI(svg);
        string memory tokenURI = formatTokenURI(imageURI, nft_name, nft_description);
        _setTokenURI(_tokenId, tokenURI);

        emit CreatedRandomSVG(_tokenId, svg);
    }
}

contract Auction is NFT {
    address payable private owner;
    string public title;
    uint256 public startPrice;
    // uint256 public startTime; // block.timestamp - time when auction created
    uint256 public endTime; //time when auction will be closed
    string public descriprion;
    uint256 public nftTokenId;

    // create enum type of auction states
    enum State {
        Running,
        Finallized
    }
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
        string memory _svg,
        uint256 _startPrice,
        uint256 _duration
    ) {
        // set data by input data from constructor parameters
        owner = _owner;
        title = _title;
        descriprion = _description;
        startPrice = _startPrice;
        endTime = block.timestamp + _duration; // count end date (now + auction duration)

        // tokenCounter = 0;
        nftTokenId = mintNFT(_svg, _title, _description);
    }

    // just return title of this auction
    function getTitle() public view returns (string memory) {
        return title;
    }

    // return structure of fields this auction
    function getContent() public view returns (AuctionContent memory) {
        return
            AuctionContent(
                owner,
                title,
                descriprion,
                nftTokenId,
                startPrice,
                endTime
            );
    }
}