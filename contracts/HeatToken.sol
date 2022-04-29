pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HeatToken is ERC20 {
    constructor() ERC20("HeatToken", "HT") {}

    function mint(uint256 amount) external {
        _mint(msg.sender, amount);
    }
}