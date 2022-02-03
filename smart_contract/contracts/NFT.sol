// SPDX-License-Identifier: UNLINSED
pragma solidity ^0.8.0;

// contracts that implements NFT methods to our contract
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "base64-sol/base64.sol"; // base64 encode

contract NFT is ERC721URIStorage {
    uint256 public tokenCounter; // id of current nft

    string public nft_name;
    string public nft_description;

    // svg parameters
    uint256 private maxNumberOfPaths;
    uint256 private maxNumberOfPathCommands;
    uint256 private size;
    string[] private pathCommands;
    string[] private colors;

    event RequestRandomSVG(
        uint256 numberOfPaths,
        uint256 randomNumber
    );

    event CreatedRandomSVG(string svg);

    event NFTCreated(uint256 indexed tokenId, string tokenURI);


    constructor()
        ERC721("Nigga NFT", "NiggaNFT")
    {
        tokenCounter = 0; // count of NFT equals 0 when we deploy contract

        // set default parameters for svg
        maxNumberOfPaths = 10;
        maxNumberOfPathCommands = 5;
        size = 500;
        pathCommands = ["M", "L"];
        colors = ["#fcba03", "#3163eb", "#479900", "black"];
    }

    function generateSVG(uint256 _randomNumber)
        public
        view
        returns (string memory finalSVG)
    {
        // get random number of paths
        uint256 numberOfPaths = (_randomNumber % maxNumberOfPaths) + 1;

        emit RequestRandomSVG(numberOfPaths, _randomNumber);

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

        emit CreatedRandomSVG(finalSVG);

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
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender)));
    }

    function createNFT(string memory _nft_name, string memory _nft_description)
        public returns (uint256)
    {
        uint256 randomNumber = getRandomNumber(); // get id of random number re

        _mint(msg.sender, tokenCounter);

        uint256 tokenId = tokenCounter;

        // save nft name and description to future finishMint
        nft_name = _nft_name;
        nft_description = _nft_description;

        string memory svg = generateSVG(randomNumber);
        string memory imageURI = svgToImageURI(svg);
        string memory tokenURI = formatTokenURI(
            imageURI,
            nft_name,
            nft_description
        );

        _setTokenURI(tokenId, tokenURI);

        emit NFTCreated(tokenId, tokenURI);

        tokenCounter++;

        return tokenId;
    }
}