// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";





contract HeatToken is ERC20, AccessControl {
    bytes32 private  _MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 private  _ADMIN_ROLE = keccak256("ADMIN");

    constructor() ERC20("HeatToken", "HT") {

    }
    function _setRole(address minter) public {
        _setupRole(_MINTER_ROLE, minter);
    }
    

    function mint(address to, uint256 amount) external {
        _mint(to, amount);

    }

    function _setApprovalForAll(address owner, address operator) public {
        _setApprovalForAll(owner, operator);
    }
    
   function burn(uint256 _amount) external {
        _burn(msg.sender, _amount);
   }


}