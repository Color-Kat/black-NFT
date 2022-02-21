// SPDX-License-Identifier: UNLINSED
pragma solidity ^0.8.0;

contract Users {
    mapping(address => User) public users;

    NFT public nftInstance;
    Auctions public auctionInstance;

    constructor() {
        // Create instances to have access to general storage of NFTs and auctions
        nftInstance = new NFT();
        auctionInstance = new Auctions(nftInstance);
    }

    event UserConnect(User user);

    // Add user address in users list
    function connectUser() public {
        address userAddress = msg.sender;

        if (address(users[userAddress]) != address(0)) emit UserConnect(users[userAddress]); // User already exists
        else {
            // Create new user
            User user = new User(userAddress, nftInstance, auctionInstance);
            users[userAddress] = user;

            emit UserConnect(user);
        }
    }

    function getUser(address _userAddress) public view returns (User) {
        return users[_userAddress];
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

    event NiggaCollect(string tokenURI);
    function collectNigga() public {
        require(msg.sender == userAddress, "You are wrong user");

        nftInstance.setApprovalForAll(userAddress, true);

        // Create new nft and get tokentID and emit tokenURI
        uint256 tokenId = nftInstance.createNFT(userAddress);
        emit NiggaCollect(nftInstance.tokenURI(tokenId));
    }

    function getNiggaTokenIdById(uint256 _id) public view returns (uint256) {
        require(msg.sender == userAddress, "You are wrong user");
        return nftInstance.getTokenIdsFromAddress(userAddress)[_id]; // Return tokenId by index
    }

    function getNiggaById(uint256 _id) public view returns (string memory) {
        require(msg.sender == userAddress, "You are wrong user");
        return nftInstance.tokenURI(
            getNiggaTokenIdById(_id)
        );
    }

    // Return list of user's nigga-tokenIDs
    function getMyNiggaTokenIds() public view returns ( uint256[] memory) {
        require(msg.sender == userAddress, "You are wrong user");

        return nftInstance.getTokenIdsFromAddress(userAddress);
    }

    // event GetTokenIds(uint256[] tokenIds, uint256 count);

    // Return list of nigga-tokenURIs
    function getMyNiggasTokenURI() public view returns(string[] memory NFTs) {
        uint256[] memory tokenIds = getMyNiggaTokenIds();
        uint256 tokenIdsCount = tokenIds.length;

        NFTs = new string[](tokenIdsCount);

        for (uint256 i = 0; i < tokenIdsCount; i++) {
            NFTs[i] = nftInstance.tokenURI(tokenIds[i]);
        }

        return NFTs;
    }
    
    // Create new auction of niggaId with message and start price
    event AuctionCreated(uint256 auctionId);
    function sellNigga(uint256 _niggaId, string memory _message, uint256 _startPrice) public {
        require(msg.sender == userAddress, "You are wrong user");

        uint256 tokenId = getNiggaTokenIdById(_niggaId); // Get tokenId of auction lot

        uint256 auctionId = auctionInstance.createAuction(userAddress, tokenId, _message, _startPrice);

        emit AuctionCreated(auctionId);
    }

    // Return address of nftAddress and auction address to user can approve auction address
    function getAuctionApprovingData(uint256 _auctionId) public view returns(address, address) {
        address auctionAddress = address(auctionInstance.getAuctionById(_auctionId));
        address nftAddress = address(nftInstance);
        return (nftAddress, auctionAddress);
    }

    // Return list of ids of my auction 
    function getMyAuctionIds() public view returns (uint256[] memory) {
        require(msg.sender == userAddress, "You are wrong user");
        return auctionInstance.getAuctionIdsFromAddress(userAddress);
    }

    // Return content of auction by auctionId
    function getAuctionContentById(uint256 _id) public view returns(AuctionContent memory) {
        require(msg.sender == userAddress, "You are wrong user");
        return auctionInstance.getContent(_id);
    } 

    function getMyAuctionsContracts() public view returns (Auction[] memory) {
        require(msg.sender == userAddress, "You are wrong user");
        return auctionInstance.getAuctions();
    }

    // place the bid in the auction by id
    event PlaceBid(bool result);
    function placeBid(uint256 _auctionId) public payable {
        require(msg.sender == userAddress, "You are wrong user");

        Auction auction = auctionInstance.getAuctionById(_auctionId);
        bool result = auction.placeBid{value: msg.value}(payable(msg.sender), msg.value); // Call auction.placeBid with eth value

        emit PlaceBid(result);
    }

    // Finalize the auction by id, trandfer eth to owner and transfer nft to highest bidder
    event AuctionFinalazed(bool result);
    function finalizeAuction(uint256 _auctionId) public returns (bool){
        require(msg.sender == userAddress, "You are wrong user");
        bool result = (auctionInstance.getAuctionById(_auctionId)).finalizeAuction();
        
        emit AuctionFinalazed(result);
        return result;
    }
}

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "base64-sol/base64.sol"; // base64 encode

contract NFT is ERC721URIStorage {
    uint256 public tokenCounter; // id of current nft
    mapping(address => uint256[]) public userAddressToTokenId;

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

        _mint(userAddress, tokenCounter); // mint the nft to user

        // setApprovalForAll(userAddress, true); 

        uint256 tokenId = tokenCounter;

        // save nft name and description to future finishMint
        string memory nft_name = "nigga";
        string memory nft_description = "Nigga description";

        emit RequestRandomSVG(randomNumber);

        // Generate nigga svg
        string memory svg = generateSVG(randomNumber);
        // string memory svg = "<svg></svg>";
        string memory imageURI = svgToImageURI(svg);
        string memory tokenURI = formatTokenURI(
            imageURI,
            nft_name,
            nft_description
        );
        emit CreatedRandomSVG(svg);

        _setTokenURI(tokenId, tokenURI); // Add tokenURI to nft
        emit NFTCreated(tokenId, tokenURI);

        tokenCounter++; // Increase token counter
        userAddressToTokenId[userAddress].push(tokenId); // save created tokenId for user address

        return tokenId;
    }

    function getTokenIdsFromAddress(address _userAddress) public view returns(uint256[] memory) {
        return userAddressToTokenId[_userAddress];
    }

    function niggaTransfer(address _from, address _to, uint256 _tokenId) public {
        transferFrom(ownerOf(_tokenId), _to, _tokenId);

        // Transfer id in userAddressToTokenId
        uint256[] memory userTokenIds = userAddressToTokenId[_from];
        uint256 userTokenIdsCount = userTokenIds.length;

        // Transfer tokenId in userAddressToTokenId mapping 
        for (uint256 i = 0; i < userTokenIdsCount; i++) {
            if (userTokenIds[i] == _tokenId) { // Find index of needed index of transfering tokenId
                for(uint256 j = i; j < userTokenIdsCount-1; j++) {
                    // From index i move elements back
                    userAddressToTokenId[_from][i] = userAddressToTokenId[_from][i + 1];
                }
                userAddressToTokenId[_from].pop(); // Remove last element (it's empty)

                userAddressToTokenId[_to].push(_tokenId); // Add this tokenId for new owner
                break;
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

    // Create pseudo random number
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
    uint256 highestPrice;
}

contract Auctions {
    Auction[] public auctions; // Auctions array
    NFT public nftInstance;
    mapping(address => uint256[]) private userAddressToAuctionIds;

    constructor(NFT _nftInstance) {
        nftInstance = _nftInstance;
    }

    // Add to auctions array new Auction instance
    event AuctionCreated(Auction auction, uint256 auctionId);
    function createAuction(
        address _userAddress,
        uint256 _tokenId,
        string memory _message,
        uint256 _startPrice
    ) public payable returns (uint256) {
        // Create new Auction instance
        Auction newAuction = new Auction(
            nftInstance,
            payable(_userAddress),
            _tokenId,
            _message,
            _startPrice
        );

        auctions.push(newAuction); // Add auction to list

        uint256 auctionId = (auctions.length - 1);
        userAddressToAuctionIds[_userAddress].push(auctionId);

        emit AuctionCreated(newAuction, auctionId);

        return auctionId;
    }

    // Return list of auctionIds of userAddress
    function getAuctionIdsFromAddress(address _userAddress) public view returns(uint256[] memory) {
        return userAddressToAuctionIds[_userAddress];
    }

    // Return our auctions array fully
    function getAuctions() public view returns (Auction[] memory) {
        return auctions;
    }

    // Return Auction addres by auctionId
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
    string public message;

    NFT public nftInstance; // To interact with nft storage
   
    // Create enum type of auction states
    enum State { Running, Finallized }
    State public auctionState; // create auction state

    // Data of bidder
    uint256 public highestPrice;
    address payable public highestBidder;
    address[] public bidders;
    mapping(address => uint256) public bids; // Bids list

    constructor(
        NFT _nftInstance,
        address payable _owner,
        uint256 _nftTokenId,
        string memory _message,
        uint256 _startPrice
    ) {
        // set data by input data from constructor parameters
        owner = _owner;
        nftTokenId = _nftTokenId;
        message = _message;
        startPrice = _startPrice;
        startTime = block.timestamp;
        highestPrice = 0;

        nftInstance = _nftInstance;
    }

    // return structure of fields this auction
    function getContent() public view returns (AuctionContent memory) {
        return
            AuctionContent(
                owner,
                nftTokenId,
                message,
                startPrice,
                highestPrice
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

        // Count real value if this address already have a bid
        uint256 realValue = _value;
        if (bids[_sender] > 0) realValue += bids[_sender];

        require(realValue > startPrice, "You must pay more than the starting price");
        require(realValue > highestPrice, "Your bid is too low. Increase it");

        bids[_sender] = realValue;  // Add new bid for msg.sender
        bidders.push(_sender); // Add sender to bidders list
        // Update the highest price and highest bidder
        highestPrice = realValue;
        highestBidder = _sender;

        emit PlaceBid(_sender, realValue); // TODODODODO
        
        return true;
    }

    event AuctionFinalized(address oldOwner, address newOwner, uint256 tokenId);
    event WhoIsOwner(address owner, address auction);

    // Finalize the auction, transfer nft to highest bidder and send eth to owner
    function finalizeAuction() public returns (bool) {
        // Only owner can finalize the auction
        require(tx.origin == owner, "You are not owner");
        // require(nftInstance.isApprovedForAll(owner, address(this)), "You are not approved");
        emit WhoIsOwner(owner, address(this));

        // Highest bidder is not empry
        if (highestBidder != address(0)) {
            uint256 price = highestPrice;

            // Transfer nft from owner to highest bidder address
            nftInstance.niggaTransfer(owner, highestBidder, nftTokenId);

            owner.transfer(price); // Send eth to owner

            // Return money to rest bidders
            for (uint256 i = 0; i < bidders.length; i++){
                if(highestBidder != bidders[i]) { // don't return money to highest bidder
                    payable(bidders[i]).transfer(bids[bidders[i]]); // transfer money to rest bidder
                }
            }
        }
        
        // No more bids, auction is finalized
        auctionState = State.Finallized; 

        emit AuctionFinalized(owner, highestBidder, nftTokenId);
        return true;
    }
}
