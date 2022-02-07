// SPDX-License-Identifier: UNLINSED
pragma solidity ^0.8.0;

contract Users {
    // Data struct to know, what user exists
    struct UserData {
        User user;
        bool exists;
    }

    mapping(address => UserData) public users;

    NFT public nftInstance;
    Auctions public auctionInstance;

    constructor() {
        nftInstance = new NFT();
        auctionInstance = new Auctions();
    }

    event UserConnect(User user);

    // Add user address in users list
    function connectUser() public {
        address userAddress = msg.sender;

        if (users[userAddress].exists)
            emit UserConnect(users[userAddress].user);
        else {
            User user = new User(userAddress, nftInstance, auctionInstance);
            users[userAddress].user = user;
            users[userAddress].exists = true;

            emit UserConnect(user);
        }
    }

    function getUser(address _userAddress) public view returns (User) {
        return users[_userAddress].user;
    }
}

contract User {
    address public userAddress;
    NFT private nftInstance;
    Auctions public auctionInstance;

    constructor(address _userAddress, NFT _nftInstance, Auctions _auctionInstance) {
        userAddress = _userAddress;
        nftInstance = _nftInstance;
        auctionInstance = _auctionInstance;
    }

    function sayHello() public pure returns (string memory) {
        return "Hi, i have a nigger)";
    }

    event NiggaCollect(string tokenURI);

    function collectNigga() public {
        uint256 tokenId = nftInstance.createNFT(userAddress);
        emit NiggaCollect(nftInstance.tokenURI(tokenId));
    }

    function getNiggaTokenIdById(uint256 _id) public view returns (uint256) {
        return nftInstance.getTokenIdsFromAddress(userAddress)[_id];
    }

    function getNiggaById(uint256 _id) public view returns (string memory) {
        return nftInstance.tokenURI(
            getNiggaTokenIdById(_id)
        );
    }

    event GetTokenIds(uint256[] tokenIds, uint256 count);

    function getMyNiggas() public returns (string[] memory) {
        uint256[] memory tokenIds = nftInstance.getTokenIdsFromAddress(userAddress);
        uint256 tokenIdsCount = tokenIds.length;

        emit GetTokenIds(tokenIds, tokenIdsCount);

        string[] memory NFTs = new string[](tokenIdsCount);

        for (uint256 i = 0; i < tokenIdsCount; i++) {
            NFTs[i] = nftInstance.tokenURI(tokenIds[i]);
        }

        return NFTs;
    }

    function sellNigga(uint256 _niggaId, string memory _message, uint256 _startPrice, uint256 _duration) public {
        uint256 tokenId = getNiggaTokenIdById(_niggaId); // Get tokenId of auction lot

        auctionInstance.createAuction(userAddress, tokenId, _message, _startPrice, _duration);
    }

    function getMyAuctionIds() public view returns (uint256[] memory) {
        return auctionInstance.getAuctionIdsFromAddress(userAddress);
    }

    function getAuctionContentById(uint256 _id) public view returns(AuctionContent memory) {
        return auctionInstance.getContent(_id);
    } 
}

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "base64-sol/base64.sol"; // base64 encode

contract NFT is ERC721URIStorage {
    uint256 public tokenCounter; // Id of current nft
    mapping(address => uint256[]) private userAddressToTokenId;

    // SVG parameters
    uint256 private maxNumberOfPaths;
    uint256 private maxNumberOfPathCommands;
    uint256 private size;
    string[] private pathCommands;
    string[] private colors;

    event RequestNFT(uint256 randomNumber, address userAddress);
    event RequestRandomSVG(uint256 randomNumber);
    event CreatedRandomSVG(string svg);
    event NFTCreated(uint256 indexed tokenId, string tokenURI);

    constructor() ERC721("Nigga NFT", "NiggaNFT") {
        tokenCounter = 0; // Count of NFT equals 0 when we deploy contract

        // Set default parameters for svg
        maxNumberOfPaths = 10;
        maxNumberOfPathCommands = 5;
        size = 500;
        pathCommands = ["M", "L"];
        colors = ["#fcba03", "#3163eb", "#479900", "black"];
    }

    function createNFT(address userAddress) public returns (uint256) {
        uint256 randomNumber = getRandomNumber(); // Get id of random number re

        emit RequestNFT(randomNumber, userAddress);

        _mint(userAddress, tokenCounter);

        uint256 tokenId = tokenCounter;

        // Save nft name and description to future finishMint
        string memory nft_name = "nigga";
        string memory nft_description = "Nigga description";

        emit RequestRandomSVG(randomNumber);

        // String memory svg = generateSVG(randomNumber);
        string memory svg = "<svg></svg>";
        string memory imageURI = svgToImageURI(svg);
        string memory tokenURI = formatTokenURI(
            imageURI,
            nft_name,
            nft_description
        );

        emit CreatedRandomSVG(svg);

        _setTokenURI(tokenId, tokenURI);

        emit NFTCreated(tokenId, tokenURI);

        tokenCounter++;

        userAddressToTokenId[userAddress].push(tokenId);

        return tokenId;
    }

    event Mapp( uint256[] Shit);
    function addTokenIdToUser(address _userAddress, uint256 _tokenId) public {
        userAddressToTokenId[_userAddress].push(_tokenId);
        emit Mapp(userAddressToTokenId[_userAddress]);
    }

    // Return list of tokenIds of userAddress
    function getTokenIdsFromAddress(address _userAddress) public view returns(uint256[] memory) {
        return userAddressToTokenId[_userAddress];
    }

    function generateSVG(uint256 _randomNumber)
        public
        view
        returns (string memory finalSVG)
    {
        // get random number of paths
        uint256 numberOfPaths = (_randomNumber % maxNumberOfPaths) + 1;

        // svg start
        finalSVG = string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" height="',
                uint2str(size),
                '210" width="',
                uint2str(size),
                '">'
            )
        );

        // generate <paths>
        for (uint256 i = 0; i < numberOfPaths; i++) {
            // as i understand, we make hash by randomNumber and i and create from hash new number
            uint256 newRNG = uint256(keccak256(abi.encode(_randomNumber, i)));
            string memory pathSVG = generatePath(newRNG);
            finalSVG = string(abi.encodePacked(finalSVG, pathSVG));
        }

        finalSVG = string(abi.encodePacked(finalSVG, "</svg>"));

        return finalSVG;
    }

    function generatePath(uint256 _randomNumber)
        internal
        view
        returns (string memory pathSVG)
    {
        // get random number of path commands
        uint256 numberOfPathCommands = (_randomNumber %
            maxNumberOfPathCommands) + 1;

        // path start
        pathSVG = '<path d="';

        for (uint256 i = 0; i < numberOfPathCommands; i++) {
            // create new random number
            // size + i to make this number different from the previous
            uint256 newRNG = uint256(
                keccak256(abi.encode(_randomNumber, size + i))
            );

            // generate string with path commands
            string memory pathCommand = generatePathCommand(newRNG);

            pathSVG = string(abi.encodePacked(pathSVG, pathCommand));
        }

        // pick a random color from the list
        string memory color = colors[_randomNumber % colors.length];

        pathSVG = string(
            abi.encodePacked(
                pathSVG,
                '" fill="transparent" stroke="',
                color,
                '"/>'
            )
        );

        return pathSVG;
    }

    function generatePathCommand(uint256 _randomNumber)
        internal
        view
        returns (string memory pathCommand)
    {
        pathCommand = pathCommands[_randomNumber % pathCommands.length];

        uint256 parameterOne = uint256(
            keccak256(abi.encode(_randomNumber, size * 2))
        ) % size;
        uint256 parameterTwo = uint256(
            keccak256(abi.encode(_randomNumber, size * 3))
        ) % size;

        pathCommand = string(
            abi.encodePacked(
                pathCommand,
                uint2str(parameterOne),
                " ",
                uint2str(parameterTwo),
                " "
            )
        );

        return pathCommand;
    }

    function uint2str(uint256 _i)
        internal
        pure
        returns (string memory _uintAsString)
    {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    // convert svg string to imageURI
    function svgToImageURI(string memory svg)
        internal
        pure
        returns (string memory)
    {
        string memory baseURL = "data:image/svg+xml;base64,";
        string memory svgBase64Encoded = Base64.encode(
            bytes(string(abi.encodePacked(svg)))
        );
        return string(abi.encodePacked(baseURL, svgBase64Encoded));
    }

    function formatTokenURI(
        string memory imageURI,
        string memory name,
        string memory description
    ) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                name,
                                '",',
                                '"description":"',
                                description,
                                '",',
                                '"attributes":"",',
                                '"image":"',
                                imageURI,
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    function getRandomNumber() public view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.difficulty,
                        msg.sender
                    )
                )
            );
    }
}

struct AuctionContent {
    address owner;
    uint256 nftTokenId;
    string message;
    uint256 startPrice;
    uint256 endTime;
}

contract Auctions {
    Auction[] public auctions; // Auctions array
    mapping(address => uint256[]) private userAddressToAuctionIds;

    event AuctionCreated(uint256 auctionId, Auction auction);

    // Add to auctions array new Auction instance
    function createAuction(
        address _userAddress,
        uint256 _tokenId,
        string memory _message,
        uint256 _startPrice,
        uint256 _duration // Time when auction will be closed
    ) public payable returns (uint256) {
        // Create new Auction instance
        Auction newAuction = new Auction(
            payable(_userAddress),
            _tokenId,
            _message,
            _startPrice,
            _duration
        );

        auctions.push(newAuction); // Add auction to list

        uint256 auctionId = (auctions.length - 1);
        userAddressToAuctionIds[_userAddress].push(auctionId);

        emit AuctionCreated(auctionId, newAuction);

        return auctionId;
    }

    // Return list of auction ids (indexes) of userAddress
    function getAuctionIdsFromAddress(address _userAddress) public view returns(uint256[] memory) {
        return userAddressToAuctionIds[_userAddress];
    }

    // Return auctions array
    function getAuctions() public view returns (Auction[] memory) {
        return auctions;
    }

    // return auction instance by auctionId
    function getAuctionById(uint256 _id) public view returns (Auction) {
        return auctions[_id];
    }

    // Return content of auction by id
    function getContent(uint256 _id)
        public
        view
        returns (AuctionContent memory)
    {
        return auctions[_id].getContent();
    }
}

contract Auction {
    address payable public owner;
    uint256 public nftTokenId;
    uint256 public startPrice;
    uint256 public startTime; // block.timestamp - time when auction created
    uint256 public endTime; // Time when auction will be closed
    string public message;
   
    // Create enum type of auction states
    enum State { Running, Finallized }
    State public auctionState; // Create auction state

    // Data of bidder
    uint256 public highestPrice;
    address payable public highestBidder;
    mapping(address => uint256) public bids; // Bids list

    constructor(
        address payable _owner,
        uint256 _nftTokenId,
        string memory _message,
        uint256 _startPrice,
        uint256 _duration
    ) {
        // Set data by input data from constructor parameters
        owner = _owner;
        nftTokenId = _nftTokenId;
        message = _message;
        startPrice = _startPrice;
        startTime = block.timestamp;
        endTime = block.timestamp + _duration; // Count end date (now + auction duration)
    }

    // Return structure of fields this auction
    function getContent() public view returns (AuctionContent memory) {
        return
            AuctionContent(
                owner,
                nftTokenId,
                message,
                startPrice,
                endTime
            );
    }
}