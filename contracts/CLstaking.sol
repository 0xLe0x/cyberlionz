// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./libs/Array.sol";

contract CyberlionStaking is Ownable {
    using SafeMath for uint256;
    using Address for address;
    using Array for uint256[];

    bytes4 private constant _ERC721_RECEIVED = 0x150b7a02;
    uint256 constant SECONDS_PER_DAY = 24 * 60 * 60;

    IERC20 public rewardsToken;

    struct UserInfo {
        mapping(address => uint256[]) stakedTokens;
        mapping(address => uint256) timeStaked;
        uint256 amountStaked;
    }

    struct CollectionInfo {
        address collectionAddress;
        uint256 rewardPerDay;
        uint256 totalAmountStaked;
    }

    mapping(address => UserInfo) public userInfo;
    mapping(address => mapping(uint256 => address)) public tokenOwners;

    CollectionInfo[] public collectionInfo;

    constructor(IERC20 _rewardsToken) {
        rewardsToken = _rewardsToken;
    }

    function stake(uint256 _collectionID, uint256 _tokenID) external {
        _stake(msg.sender, _collectionID, _tokenID);
    }

    function _stake(
        address _userAddress,
        uint256 _collectionID,
        uint256 _tokenID
    ) internal {
        UserInfo storage user = userInfo[_userAddress];
        CollectionInfo storage collection = collectionInfo[_collectionID];

        IERC721(collection.collectionAddress).transferFrom(_userAddress, address(this), _tokenID);

        user.amountStaked += 1;
        collection.totalAmountStaked += 1;
        user.timeStaked[collection.collectionAddress] = block.timestamp;
        user.stakedTokens[collection.collectionAddress].push(_tokenID);
        tokenOwners[collection.collectionAddress][_tokenID] = _userAddress;
    }

    function batchStake(uint256 _cid, uint256[] memory _ids) external {
        for (uint256 i = 0; i < _ids.length; ++i) {
            _stake(msg.sender, _cid, _ids[i]);
        }
    }

    function batchUnstake(uint256 _cid, uint256[] memory _ids) external {
        for (uint256 i = 0; i < _ids.length; ++i) {
            _unstake(msg.sender, _cid, _ids[i]);
        }
    }

    function unstake(uint256 _collectionID, uint256 _tokenID) external {
        _unstake(msg.sender, _collectionID, _tokenID);
    }

    function _unstake(
        address _userAddress,
        uint256 _collectionID,
        uint256 _tokenID
    ) internal {
        UserInfo storage user = userInfo[_userAddress];
        CollectionInfo storage collection = collectionInfo[_collectionID];

        require(
            tokenOwners[collection.collectionAddress][_tokenID] == _userAddress,
            "sender doesn't owns this token"
        );

        _claimReward(msg.sender, _collectionID);

        user.stakedTokens[collection.collectionAddress].removeElement(_tokenID);

        delete tokenOwners[collection.collectionAddress][_tokenID];

        user.timeStaked[collection.collectionAddress] = block.timestamp;
        user.amountStaked -= 1;
        collection.totalAmountStaked -= 1;

        if (user.amountStaked == 0) {
            delete userInfo[_userAddress];
        }

        IERC721(collection.collectionAddress).transferFrom(address(this), _userAddress, _tokenID);
    }

    function _claimReward(address _userAddress, uint256 _collectionID) internal {
        UserInfo storage user = userInfo[_userAddress];
        CollectionInfo storage collection = collectionInfo[_collectionID];

        uint256 payableAmount = (block.timestamp - user.timeStaked[collection.collectionAddress])
            .div(SECONDS_PER_DAY)
            .mul(collection.rewardPerDay);
        rewardsToken.transfer(_userAddress, payableAmount);
    }

    function setCollection(address _collectionAddress, uint256 _rewardPerDay) public onlyOwner {
        collectionInfo.push(
            CollectionInfo({collectionAddress: _collectionAddress, rewardPerDay: _rewardPerDay, totalAmountStaked: 0})
        );
    }

    function updateCollection(
        uint256 _collectionID,
        address _collectionAddress,
        uint256 _rewardPerDay
    ) public onlyOwner {
        CollectionInfo storage collection = collectionInfo[_collectionID];
        collection.collectionAddress = _collectionAddress;
        collection.rewardPerDay = _rewardPerDay;
    }

    function getUserInformation(address _userAddress, address _collectionAddr) external view returns (uint256[] memory, uint256, uint256) {
        return (userInfo[_userAddress].stakedTokens[_collectionAddr], userInfo[_userAddress].timeStaked[_collectionAddr], userInfo[_userAddress].amountStaked);
    }

    function getTotalStakedItemsCount(uint256 _collectionID) external view returns (uint256) {
        CollectionInfo storage collection = collectionInfo[_collectionID];
        return collection.totalAmountStaked;
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata data
    ) public returns (bytes4) {
        return _ERC721_RECEIVED;
    }
}
