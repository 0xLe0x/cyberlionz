import { ethers } from "hardhat";
import { expect } from 'chai';
import { Contract, ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

describe('CyberlionStaking', function () {

  const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
  const MINTER_ROLE = ethers.utils.solidityKeccak256([ "string", ], [ "MINTER_ROLE" ])

  let deployer: SignerWithAddress, other: SignerWithAddress;
  let HeatTokenInstance : Contract;
  let CLStakingInstance : Contract;
  let contractFactory: ContractFactory;
  let HeatToken: ContractFactory;
  let CLStaking: ContractFactory;

  before(async function() {
    [deployer, other] = await ethers.getSigners();
    HeatToken = await ethers.getContractFactory("HeatToken", deployer);
    CLStaking = await ethers.getContractFactory("CyberlionStaking", deployer);
  });

  beforeEach(async function() {
    HeatTokenInstance = await contractFactory.deploy();
    await HeatTokenInstance.deployed()
    CLStakingInstance = await contractFactory.deploy(HeatTokenInstance.address);
  });



  it('minter role admin is the default admin', async function () {
    expect(await HeatTokenInstance.getRoleAdmin(MINTER_ROLE)).to.equal(DEFAULT_ADMIN_ROLE);
  });

  describe('minting', function () {
    it('deployer can mint tokens', async function () {
      const tokenId = ethers.BigNumber.from("0")

      await expect( CLStakingInstance.connect(deployer).mintertest(other.address))


      expect(await HeatTokenInstance.balanceOf(other.address)).to.be.equal('1');
    });

    it('other accounts cannot mint tokens', async function () {
      await expect(
        HeatTokenInstance.connect(other).mint(other.address)
      ).to.be.revertedWith('Must have minter role to mint');
    });
  });

});