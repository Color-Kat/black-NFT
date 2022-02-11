// SPDX-License-Identifier: UNLINSED
pragma solidity ^0.8.0;

contract Users {
    // data struct to know, what user exists
    struct UserData {
        User user;
        bool exists;
    }

    mapping(address => UserData) public users;

    NFT public nftInstance;
    Auctions public auctionInstance;

    constructor() {
        nftInstance = new NFT();
        auctionInstance = new Auctions(nftInstance);
    }

    event UserConnect(User user);

    // add user address in users list
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
    NFT public nftInstance;
    Auctions public auctionInstance;

    constructor(address _userAddress, NFT _nftInstance, Auctions _auctionInstance) {
        userAddress = _userAddress;
        nftInstance = _nftInstance;
        auctionInstance = _auctionInstance;
    }

    function sayHello() public view returns (string memory) {
        require(msg.sender == userAddress, "You are wrong user");
        return "Hi, i have a nigger)";
    }

    event NiggaCollect(string tokenURI);

    function collectNigga() public {
        require(msg.sender == userAddress, "You are wrong user");

        uint256 tokenId = nftInstance.createNFT(userAddress);

        nftInstance.niggaApproving(address(userAddress));
        nftInstance.niggaApproving(address(auctionInstance));

        emit NiggaCollect(nftInstance.tokenURI(tokenId));
    }

    function getNiggaTokenIdById(uint256 _id) public view returns (uint256) {
        require(msg.sender == userAddress, "You are wrong user");

        return nftInstance.getTokenIdsFromAddress(userAddress)[_id];
    }

    function getNiggaById(uint256 _id) public view returns (string memory) {
        require(msg.sender == userAddress, "You are wrong user");

        return nftInstance.tokenURI(
            getNiggaTokenIdById(_id)
        );
    }

    event GetTokenIds(uint256[] tokenIds, uint256 count);

    function getMyNiggas() public returns (string[] memory) {
        require(msg.sender == userAddress, "You are wrong user");

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
        require(msg.sender == userAddress, "You are wrong user");

        uint256 tokenId = getNiggaTokenIdById(_niggaId); // get tokenId of auction lot

        auctionInstance.createAuction(userAddress, tokenId, _message, _startPrice, _duration);
    }

    function getMyAuctionIds() public view returns (uint256[] memory) {
        require(msg.sender == userAddress, "You are wrong user");
        return auctionInstance.getAuctionIdsFromAddress(userAddress);
    }

    function getAuctionContentById(uint256 _id) public view returns(AuctionContent memory) {
        require(msg.sender == userAddress, "You are wrong user");
        return auctionInstance.getContent(_id);
    } 

    function finalizeAuction(uint256 _auctionId) public {
        require(msg.sender == userAddress, "You are wrong user");

        nftInstance.niggaApproving(address(auctionInstance.getAuctionById(_auctionId)));

        auctionInstance.getAuctionById(_auctionId).finalizeAuction();
    }

    function placeBid(uint256 _auctionId) public payable {
        require(msg.sender == userAddress, "You are wrong user");

        auctionInstance.getAuctionById(_auctionId).placeBid(payable(msg.sender), msg.value);
    }
}

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "base64-sol/base64.sol"; // base64 encode

contract NFT is ERC721URIStorage {
    uint256 public tokenCounter; // id of current nft
    mapping(address => uint256[]) private userAddressToTokenId;

    // svg parameters
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
        tokenCounter = 0; // count of NFT equals 0 when we deploy contract

        // set default parameters for svg
        maxNumberOfPaths = 10;
        maxNumberOfPathCommands = 5;
        size = 500;
        pathCommands = ["M", "L"];
        colors = ["#fcba03", "#3163eb", "#479900", "black"];
    } 

    function createNFT(address userAddress) public returns (uint256) {
        uint256 randomNumber = getRandomNumber(); // get id of random number re

        emit RequestNFT(randomNumber, userAddress);

        _mint(userAddress, tokenCounter);

        setApprovalForAll(userAddress, true);

        uint256 tokenId = tokenCounter;

        // save nft name and description to future finishMint
        string memory nft_name = "nigga";
        string memory nft_description = "Nigga description";

        emit RequestRandomSVG(randomNumber);

        // string memory svg = generateSVG(randomNumber);
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

    function niggaApproving(address approved) public {
        setApprovalForAll(approved, true);
    }

    event Mapp( uint256[] Shit);
    function addTokenIdToUser(address _userAddress, uint256 _tokenId) public {
        userAddressToTokenId[_userAddress].push(_tokenId);
        emit Mapp(userAddressToTokenId[_userAddress]);
    }
    function getTokenIdsFromAddress(address _userAddress) public view returns(uint256[] memory) {
        return userAddressToTokenId[_userAddress];
    }

    event WhoIsSenderInNFT(address sender, address owner, address NFTAddress);

    function niggaTransfer(address _from, address _to, uint256 _tokenId) public {
        emit WhoIsSenderInNFT(msg.sender, ownerOf(_tokenId), address(this));

        // transferFrom(_from, _to, _tokenId);
        transferFrom(ownerOf(_tokenId), _to, _tokenId);

        // transfer id in userAddressToTokenId
        uint256[] memory userTokenIds = userAddressToTokenId[_from];
        uint256 userTokenIdsCount = userTokenIds.length;

        for (uint256 i = 0; i < userTokenIdsCount; i++) {
            if (userTokenIds[i] == _tokenId) {
                delete userAddressToTokenId[_from][i]; // delete for current user this tokenId
                userAddressToTokenId[_to].push(_tokenId); // Add this tokenId for new owner
            }
        }
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
    Auction[] public auctions; // auctions array
    NFT public nftInstance;
    mapping(address => uint256[]) private userAddressToAuctionIds;

    event AuctionCreated(Auction _auction);

    constructor(NFT _nftInstance) {
        nftInstance = _nftInstance;
    }

    // add to auctions array new Auction instance
    function createAuction(
        address _userAddress,
        uint256 _tokenId,
        string memory _message,
        uint256 _startPrice,
        uint256 _duration //time when auction will be closed
    ) public payable returns (uint256) {
        // create new Auction instance
        Auction newAuction = new Auction(
            nftInstance,
            payable(_userAddress),
            _tokenId,
            _message,
            _startPrice,
            _duration
        );

        emit AuctionCreated(newAuction);

        auctions.push(newAuction); // Add auction to list

        uint256 auctionId = (auctions.length - 1);
        userAddressToAuctionIds[_userAddress].push(auctionId);

        nftInstance.niggaApproving(address(newAuction));
        nftInstance.niggaApproving(address(auctions[auctionId]));

        return auctionId;
    }

    function getAuctionIdsFromAddress(address _userAddress) public view returns(uint256[] memory) {
        return userAddressToAuctionIds[_userAddress];
    }

    // Return our auctions array
    function getAuctions() public view returns (Auction[] memory) {
        return auctions;
    }

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
    uint256 public endTime; //time when auction will be closed
    string public message;

    NFT public nftInstance; // to interact with nft storage
   
    // create enum type of auction states
    enum State { Running, Finallized }
    State public auctionState; // create auction state

    // data of bidder
    uint256 public highestPrice;
    address payable public highestBidder;
    mapping(address => uint256) public bids; // bids list

    constructor(
        NFT _nftInstance,
        address payable _owner,
        uint256 _nftTokenId,
        string memory _message,
        uint256 _startPrice,
        uint256 _duration
    ) {
        // set data by input data from constructor parameters
        owner = _owner;
        nftTokenId = _nftTokenId;
        message = _message;
        startPrice = _startPrice;
        startTime = block.timestamp;
        endTime = block.timestamp + _duration; // count end date (now + auction duration)

        nftInstance = _nftInstance;

        // nftInstance.setApprovalForAll(address(this), true);
    }

    // return structure of fields this auction
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

    modifier notOwner(){
        require(msg.sender != owner);
        _;
    }

    event PlaceBid(address bidder, uint256 value);

    // Place bid, update the highest price and highest bidder
    function placeBid(address payable _sender, uint256 _value) public payable notOwner returns(bool) {
        require(auctionState == State.Running, "Auction is already closed");
        require(_value > startPrice, "You must pay more than the starting price");
        require(_value > highestPrice, "Your bid is too low. Increase it");

        emit PlaceBid(_sender, _value);

        // Add new bid for msg.sender
        bids[_sender] = _value;
        // Update the highest price and highest bidder
        highestPrice = _value;
        highestBidder = _sender;
        
        return true;
    }

    event AuctionFinalized(address oldOwner, address newOwner, uint256 tokenId);
    event WhoIsSenderInAuction(address sender, address owner, address auctionAddress);

    // Finalize the auction, transfer nft to highest bidder and send eth to owner
    function finalizeAuction() public {
        // Only owner can finalize the auction
        // require(msg.sender == owner, "You are not owner");

        emit WhoIsSenderInAuction(msg.sender, owner, address(this));

        // highest bidder is not empry
        if (highestBidder != address(0)) {
            uint256 price = highestPrice;

            // nftInstance.setApprovalForAll(address(this), true);

            // transfer nft from owner to highest bidder address
            nftInstance.niggaTransfer(owner, highestBidder, nftTokenId);

            owner.transfer(price); // send eth to owner
        }
        
        // No more bids, auction is finalized
        auctionState = State.Finallized; 

        emit AuctionFinalized(owner, highestBidder, nftTokenId);
    }
}
