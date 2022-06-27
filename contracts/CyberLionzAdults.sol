/*
CyberLionz Adults (https://www.cyberlionz.io)

Code crafted by Fueled on Bacon (https://fueledonbacon.com)
*/

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract CyberLionzAdults is ERC721, Ownable {

    event Mint(address to, uint tokenId);

    using Counters for Counters.Counter;
    using Strings for uint;
    enum SaleStatus{ PAUSED, PRESALE, PUBLIC }

    Counters.Counter private _tokenIds;
    address private immutable _revenueRecipient;
    address private immutable _cyberlionzMerger;
    bytes32 public presaleMerkleRoot;

    uint public constant PUBLIC_MINT_LIMIT = 6;
    uint public COLLECTION_SIZE = 500;
    uint public constant MINT_PRICE = 0.077 ether;
    SaleStatus public saleStatus = SaleStatus.PAUSED;

    bool public finalized = false;
    uint public airdropped = 0;
    
    string private _baseUri;

    mapping(address => uint) private _mintedCountMap;
    mapping(address => bool) private _presaleMap;

    constructor(
        string memory baseUri, 
        bytes32 merkleRoot, 
        address revenueRecipient,
        address cyberlionzMerger
    ) ERC721("CyberLionzAdults", "CLA") {
        _baseUri = baseUri;
        presaleMerkleRoot = merkleRoot;
        _revenueRecipient = revenueRecipient;
        _cyberlionzMerger = cyberlionzMerger;
    }

    function setPresaleMerkleRoot(bytes32 merkleRoot) onlyOwner external {
        require(!finalized, "The presale list has been finalized.");
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
    function airdrop(address to, uint count) onlyOwner external{
        require(airdropped + count <= 15, "Can not airdrop more than publicly disclosed to team");
        require(_tokenIds.current() + count <= COLLECTION_SIZE, "Number of tokens requested exceeds collection size");
        
        airdropped += count;
        _mintTokens(to, count);
    }

    /// @notice Set sales status
    function setSaleStatus(SaleStatus status) onlyOwner external {
        saleStatus = status;
    }

    /// @notice After metadata is revealed and all is in working order, it will be finalized permanently.
    function finalizeMetadata() onlyOwner external {
        require(!finalized, "Metadata has already been finalized.");
        finalized = true;
    }

    /// @notice Reveal metadata for all the tokens
    function setBaseURI(string memory baseUri) onlyOwner external {
        require(!finalized,"Metadata has already been finalized.");
        _baseUri = baseUri;
    }

    /// @notice Get token's URI.
    /// @param tokenId token ID
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token ID does not exist in this collection");
        return string(abi.encodePacked(_baseURI(), tokenId.toString(), ".json"));
    }

    /// @notice Withdraw's contract's balance to stakeholders
    function withdraw() external {
        uint256 balance = address(this).balance;
        require(balance > 0, "withdraw: no balance");
        
        (bool success, ) = payable(_revenueRecipient).call{ value: balance } ("");
        require(success, "withdraw: withdraw failed");
    }

    function onWhitelist(address addr, bytes32[] calldata _merkleProof) public view returns(bool) {
        return (MerkleProof.verify(_merkleProof, presaleMerkleRoot, keccak256(abi.encodePacked(addr))) == true);
    }

    function presaleMint(bytes32[] calldata _merkleProof) external payable {
        require(saleStatus == SaleStatus.PRESALE, "Presale is not active");
        require(onWhitelist(msg.sender, _merkleProof), "Sender is not on the presale list");
        require(msg.value >= MINT_PRICE, "Ether value sent is less than .077");
        require(_tokenIds.current() + 1 <= COLLECTION_SIZE, "Collection size limit has already been reached");
        require(!_presaleMap[msg.sender], "This address has already minted during presale");
        
        _presaleMap[msg.sender] = true;
        _mintTokens(msg.sender, 1);
    }

    function mint(uint count) external payable {
        require(saleStatus == SaleStatus.PUBLIC, "Public mint is not active");
        require(msg.value >= count * MINT_PRICE, "Ether value sent is not sufficient");
        require(_tokenIds.current() + count <= COLLECTION_SIZE, "Minting this many tokens would exceed the total collection size");
        require(_mintedCountMap[msg.sender] + count <= PUBLIC_MINT_LIMIT, "Each address may only mint 6 tokens");

        _mintedCountMap[msg.sender] += count;
        _mintTokens(msg.sender, count);
    }

    /// @dev mint tokens
    function _mintTokens(address to, uint count) internal {
        for(uint index = 0; index < count; index++) {

            _tokenIds.increment();
            uint id = _tokenIds.current();

            _safeMint(to, id);
             emit Mint(to, id);
        }
    }

    function setCollectionSize(uint256 newSize) external onlyOwner {
        COLLECTION_SIZE = newSize;
    }

    function mintFromMerger(address to) external {
        require(_msgSender() == _cyberlionzMerger, "Sender is not merger");
        _mintTokens(to, 1);
        
    }
}