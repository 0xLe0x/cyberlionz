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
import "@openzeppelin/contracts/access/AccessControl.sol";


contract CyberLionzAdults is ERC721, Ownable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE"); 

    event Mint(address to, uint tokenId);

contract CyberLionzAdults is ERC721, Ownable {

    event Mint(address to, uint tokenId);

    using Counters for Counters.Counter;
    using Strings for uint;

    Counters.Counter private _tokenIds;
    address private immutable _revenueRecipient;
    address private immutable _cyberlionzMerger;
    bytes32 public presaleMerkleRoot;

    uint public constant PUBLIC_MINT_LIMIT = 6;
    uint public COLLECTION_SIZE = 500;
    uint public constant MINT_PRICE = 0.077 ether;
    SaleStatus public saleStatus = SaleStatus.PAUSED;

    bool public finalized = false;
    
    string private _baseUri;

    modifier onlyMinter(){
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || 
        hasRole(MINTER_ROLE, msg.sender), "Must be a Minter or Admin");
        _;
    }

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


    function totalSupply() external view returns (uint) {
        return _tokenIds.current();
    }

    /// @dev override base uri. It will be combined with token ID
    function _baseURI() internal view override returns (string memory) {
        return _baseUri;
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

    /// @dev mint tokens
    function _mintTokens(address to, uint count) internal {
        for(uint index = 0; index < count; index++) {

            _tokenIds.increment();
            uint id = _tokenIds.current();

            _safeMint(to, id);
             emit Mint(to, id);
        }
    }

    function mintFromMerger(address to) external onlyMinter() {
        _mintTokens(to, 1);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function mintFromMerger(address to) external {
        require(_msgSender() == _cyberlionzMerger, "Sender is not merger");
        _mintTokens(to, 1);
        
    }
}