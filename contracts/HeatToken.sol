// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HeatToken is ERC20, AccessControl {
    bytes32 public  MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public  ADMIN_ROLE = keccak256("ADMIN");

    constructor() ERC20("HeatToken", "HT") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);
    }

    function setMinterRole(address minter) public onlyRole(ADMIN_ROLE){
        _setupRole(MINTER_ROLE, minter);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function _setApprovalForAll(address owner, address operator) public {
        _setApprovalForAll(owner, operator);
    }
    
    function burn(address from, uint256 amount) public onlyRole(MINTER_ROLE) {
        _burn(from, amount);
    }
}