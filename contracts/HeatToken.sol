// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract HeatToken is ERC20, AccessControl {
    bytes32 private  _MINTER_ROLE = keccak256("MINTER_ROLE");


    constructor(address minter) ERC20("HeatToken", "HT") {
        _setupRole(_MINTER_ROLE, minter);

    }

    function mint(address to, uint256 amount) external {
        require(hasRole(_MINTER_ROLE, msg.sender), "DOES_NOT_HAVE_MINTER_ROLE");
        _mint(to, amount);

    }

    function _setApprovalForAll(address owner, address operator) public {
        _setApprovalForAll(owner, operator);
    }

   function _burn(uint256 tokenId) external {
       // Todo write this funcionality
   }


}