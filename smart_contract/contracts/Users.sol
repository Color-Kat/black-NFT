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

    constructor() {
        nftInstance = new NFT();
    }

    event UserConnect(User user);

    // add user address in users list
    function connectUser() public {
        address userAddress = msg.sender;

        if (users[userAddress].exists)
            emit UserConnect(users[userAddress].user);
        else {
            User user = new User(userAddress, nftInstance);
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

    constructor(address _userAddress, NFT _nftInstance) {
        userAddress = _userAddress;
        nftInstance = _nftInstance;
    }

    function sayHello() public pure returns (string memory) {
        return "Hi, i have a nigger)";
    }

    event NiggaCollect(string tokenURI);

    function collectNigga() public {
        uint256 tokenId = nftInstance.createNFT(userAddress);
        emit NiggaCollect(nftInstance.tokenURI(tokenId));
    }

    function getNiggaById(uint256 _id) public view returns (uint256) {
        return nftInstance.getTokenIdsFromAddress(userAddress)[_id];
    }

    event GetTokenIds(uint256[] tokenIds, uint256 count);
    event GetMyNFTs(string[] NFTs);

    // return tokenURIs of all my niggas
    function getMyNiggas() public returns (string[] memory) {
        uint256[] memory tokenIds = nftInstance.getTokenIdsFromAddress(userAddress); // get tokenIds
        uint256 tokenIdsCount = tokenIds.length; // number of my niggas
        string[] memory NFTs = new string[](tokenIdsCount); // init array of tokenURIs

        emit GetTokenIds(tokenIds, tokenIdsCount);
        
        // iterate all tokenIds and convert it to tokenURI
        for (uint256 i = 0; i < tokenIdsCount; i++) {
            NFTs[i] = nftInstance.tokenURI(tokenIds[i]);
        }

        emit GetMyNFTs(NFTs);

        return NFTs;
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

    event Mapp( uint256[] Shit);
    function addTokenIdToUser(address _userAddress, uint256 _tokenId) public {
        userAddressToTokenId[_userAddress].push(_tokenId);
        emit Mapp(userAddressToTokenId[_userAddress]);
    }

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
