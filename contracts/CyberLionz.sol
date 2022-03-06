s/*
CyberLionz (https://www.cyberlionz.io)
Twitter @cyberlionz

Contract crafted by Fueled on Bacon (https://fueledonbacon.com)
*/

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract CyberLionz is ERC721, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint;
    enum SaleStatus{ PAUSED, PRESALE, PUBLIC }

    Counters.Counter private _tokenIds;

    bytes32 public presaleMerkleRoot;

    uint public constant PUBLIC_MINT_LIMIT = 6;
    uint public constant COLLECTION_SIZE = 500;
    uint public constant MINT_PRICE = 0.077 ether;
    SaleStatus public saleStatus = SaleStatus.PAUSED;

    bool public finalized = false;
    bool public airdropped = false;
    
    string private _baseUri;
    //address private immutable _revenueRecipient;

    mapping(address => uint) private _mintedCountMap;
    mapping(address => bool) private _presaleMap;

    // constructor(string memory baseUri, address revenueRecipient) 
    // ERC721("CyberLionz", "CLZ")
    // {
    //     _baseUri = baseUri;
    //     _revenueRecipient = revenueRecipient;
    // }
    constructor() ERC721("CyberLionz", "CLZ") {}

    function setPresaleMerkleRoot(bytes32 merkleRoot) external onlyOwner {
        presaleMerkleRoot = merkleRoot; 
    }

    function totalSupply() external view returns (uint) {
        return _tokenIds.current();
    }

    /// @dev override base uri. It will be combined with token ID
    function _baseURI() internal view override returns (string memory) {
        return _baseUri;
    }

    /// @notice sets aside 15 tokens for use
    function airdrop(address to, uint count) external onlyOwner{
        require(airdropped == false, "already airdropped");
        require(count <= 15, "Can not airdrop more than publicly disclosed to team.");
        require(_tokenIds.current() + count <= COLLECTION_SIZE, "Number of requested tokens will exceed collection size");

        _mintTokens(to, count);
        airdropped = true;
    }

    /// @notice Set sales status
    function setSaleStatus(SaleStatus status) onlyOwner external {
        saleStatus = status;
    }

    /// @notice After metadata is revealed and all is in working order, it will be finalized permanently.
    function finalizeMetadata() external onlyOwner {
        require(finalized == false, "Metadata is already finalized.");
        finalized = true;
    }

    /// @notice Reveal metadata for all the tokens
    function setBaseURI(string memory baseUri) onlyOwner external {
        require(!finalized,"Metadata has been finalized already.");
        _baseUri = baseUri;
    }

    /// @notice Get token's URI. In case of delayed reveal we give user the json of the placeholer metadata.
    /// @param tokenId token ID
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token ID does not exist in this collection");
        return string(abi.encodePacked(_baseURI(), tokenId.toString(), ".json"));
    }

    /// @notice Withdraw's contract's balance to stakeholders
    function withdraw() external {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance");

        uint256 payout1 = balance * 6500 / 10000; 
        uint256 payout2 = balance * 2500 / 10000; 
        uint256 payout3 = balance * 1000 / 10000; 

        payable(0xaff176E6bedDdF28cBBC8579C54A81ACa7b90f4c).transfer(payout1);
        payable(0xCf83D441D8838acb8C4d77f7Dbc661aD9aAea7Da).transfer(payout2);
        payable(0x09949453Aea9876764fEB874b198693BaCD7E0d3).transfer(payout3);
    }

    function onWhitelist(address addr, bytes32[] calldata _merkleProof) public view returns(bool) {
        return (MerkleProof.verify(_merkleProof, presaleMerkleRoot, keccak256(abi.encodePacked(addr))) == true);
    }

    function presaleMint(uint count, bytes32[] calldata _merkleProof) public payable {
        require(saleStatus == SaleStatus.PRESALE, "Presale is not happening right now");
        require(MerkleProof.verify(_merkleProof, presaleMerkleRoot, keccak256(abi.encodePacked(msg.sender))) == true, "You are not on the presale list");
        require(msg.value >= count * MINT_PRICE, "Ether value sent is not sufficient");
        require(_tokenIds.current() + count <= COLLECTION_SIZE, "Number of requested tokens will exceed collection size");

        require(!_presaleMap[msg.sender], "Presale already redeemed by this address.");
        _presaleMap[msg.sender] = true;

        _mintTokens(msg.sender, count);
    }

    function mint(uint count) external payable {
        require(saleStatus == SaleStatus.PUBLIC, "Public mint is not active right now.");
        require(msg.value >= count * MINT_PRICE, "Ether value sent is not sufficient");
        require(_tokenIds.current() + count <= COLLECTION_SIZE, "Number of requested tokens will exceed collection size");
        require(_mintedCountMap[msg.sender] + count <= PUBLIC_MINT_LIMIT, "Each address may only mint 6 tokens");
        require(saleStatus == SaleStatus.PUBLIC, "Public sale is off");
        _mintedCountMap[msg.sender] += count;

        _mintTokens(msg.sender, count);
    }

    /// @dev mint tokens
    function _mintTokens(address to, uint count) internal {
        for(uint index = 0; index < count; index++) {

            _tokenIds.increment();
            uint newItemId = _tokenIds.current();

            _safeMint(to, newItemId);
        }
    }
}
