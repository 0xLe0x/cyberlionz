/*
CyberLionz Adults (https://www.cyberlionz.io)

Code crafted by Fueled on Bacon (https://fueledonbacon.com)
*/

// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./CyberLionzAdults.sol";

pragma solidity ^0.8.12;

contract CyberLionzMerger is Context, Ownable {

    address private immutable _cyberLionz;
    address private immutable _heatToken;
    address private _cyberLionzAdult;

    uint8 public cubMaxTimesAllowedToUse = 1;

    uint256 public mergePrice;

    mapping(uint256 => uint8) public cubTimesUsed;


    uint256[] private _lockedLionz;

    constructor(
        address cyberLionz, 
        address heatToken, 
        uint256 mergePrice_) 
    {
        _cyberLionz = cyberLionz;
        _heatToken = heatToken;
        mergePrice = mergePrice_;
    }   

    /// @notice cub1 will be the one that will be locked forever
    function mergeCubz(uint256 cub1, uint256 cub2) external {
        cubTimesUsed[cub2] += 1;
        require(cubTimesUsed[cub2] <= cubMaxTimesAllowedToUse, "Cub reached max");
        address sender = _msgSender();
        ERC721(_cyberLionz).transferFrom(sender, address(this), cub1);
        ERC20(_heatToken).transferFrom(sender, address(this), mergePrice);
        _lockedLionz.push(cub1);
        CyberLionzAdults(_cyberLionzAdult).mintFromMerger(sender);
        
    }

    function withdrawFunds(address to) external onlyOwner {
        ERC20 token = ERC20(_heatToken);
        token.transfer(to, token.balanceOf(address(this)));
    }

    function setCyberLionzAdults(address cyberLionzAdult) external onlyOwner {
        require(_cyberLionzAdult == address(0), "Contract already set");
        require(cyberLionzAdult != address(0), "Contract address is 0");
        _cyberLionzAdult = cyberLionzAdult;
    }

    function getLockedLionz() external view returns(uint256[] memory) {
        return _lockedLionz;
    }   

    
}