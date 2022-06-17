/*
CyberLionz Adults (https://www.cyberlionz.io)

Code crafted by Fueled on Bacon (https://fueledonbacon.com)
*/

// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./CyberLionzAdults.sol";

pragma solidity ^0.8.12;

contract CyberLionzMerger is Context, Ownable {

    event UnstakeCub(address owner, uint256 tokenId);

    using EnumerableSet for EnumerableSet.UintSet;

    address private immutable _cyberLionz;
    address private immutable _cyberLionzAdult;
    address private immutable _heatToken;

    uint256 public mergePrice;
    uint256 public cub2StakingPeriod;

    mapping(uint256 => uint256) public cubStakeTimestampMap;
    mapping(uint256 => address) public cubStakeOwnerMap;

    uint256[] private _lockedLionz;

    EnumerableSet.UintSet private _stakedLionz;

    constructor(
        address cyberLionz, 
        address cyberLionzAdult, 
        address heatToken, 
        uint256 mergePrice_, 
        uint256 cub2StakingPeriod_) 
    {
        _cyberLionz = cyberLionz;
        _cyberLionzAdult = cyberLionzAdult;
        _heatToken = heatToken;
        mergePrice = mergePrice_;
        cub2StakingPeriod = cub2StakingPeriod_;
    }   

    /// @notice cub1 will be the one that will be locked forever
    /// TODO: what happens with cub2, maybe stake it here for a while??
    function mergeCubz(uint256 cub1, uint256 cub2) external {
        address sender = _msgSender();
        ERC721(_cyberLionz).transferFrom(sender, address(this), cub1);
        ERC20(_heatToken).transferFrom(sender, address(this), mergePrice);
        cubStakeTimestampMap[cub2] = block.timestamp;
        cubStakeOwnerMap[cub2] = sender;
        _lockedLionz.push(cub1);
        _stakedLionz.add(cub2);
        CyberLionzAdults(_cyberLionzAdult).mintFromMerger(sender);
    }

    function unstakeCub(uint256 cub) external {
        address sender = _msgSender();
        require(cubStakeOwnerMap[cub] == sender, "Not cub owner");
        require(cubStakeTimestampMap[cub] + cub2StakingPeriod < block.timestamp, "Unstake deadline not over");
        _stakedLionz.remove(cub);
        ERC721(_cyberLionz).transferFrom(address(this), sender, cub);
        emit UnstakeCub(sender, cub);
    }

    function withdrawFunds(address to) external onlyOwner {
        ERC20 token = ERC20(_heatToken);
        token.transfer(to, token.balanceOf(address(this)));
    }

    function getLockedLionz() external view returns(uint256[] memory) {
        return _lockedLionz;
    }   

    function getStakedLionz() external view returns(uint256[] memory) {
        return _stakedLionz.values();
    }   

    
}