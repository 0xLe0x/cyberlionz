import { ethers } from "hardhat";
import { expect } from 'chai';
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

describe('CyberlionzMerger', function () {

  const WHITELIST = '0x0000000000000000000000000000000000000000000000000000000000000000'
 
  let signers: Array<SignerWithAddress>;
  let cyberlionzMerger: Contract;
  let cyberlionzAdults: Contract;
  let cyberlionz: Contract;
  let heatToken: Contract

  before(async function() {
    signers = await ethers.getSigners();
  });

  beforeEach(async function() {
    const CyberLionz = await ethers.getContractFactory("CyberLionzCubz");
    cyberlionz = await CyberLionz.deploy("www.cyberlionz.com", WHITELIST);
    await cyberlionz.deployed()

    const HeatToken = await ethers.getContractFactory("HeatToken");
    heatToken = await HeatToken.deploy();
    await heatToken.deployed()

    const CyberlionzMerger = await ethers.getContractFactory("CyberLionzMerger");
    cyberlionzMerger = await CyberlionzMerger.deploy(cyberlionz.address, heatToken.address, ethers.utils.parseEther("100"));
    await cyberlionzMerger.deployed()

    const CyberLionzAdults = await ethers.getContractFactory("CyberLionzAdults");
    cyberlionzAdults = await CyberLionzAdults.deploy("www.cyberlionz.com", WHITELIST, signers[0].address, cyberlionzMerger.address);

    await cyberlionzMerger.setCyberLionzAdults(cyberlionzAdults.address);

    await cyberlionz.airdrop(signers[1].address, 10);

    await heatToken.mint(signers[1].address, ethers.utils.parseEther("10000"));
    
  });



  it('Merge cubz', async function () {
    expect(2).to.equal(2);
  });

  

});