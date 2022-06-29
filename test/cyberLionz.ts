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
    cyberlionzAdults = await CyberLionzAdults.deploy("www.cyberlionz.com", cyberlionzMerger.address);

    await cyberlionzMerger.setCyberLionzAdults(cyberlionzAdults.address);

    await cyberlionz.airdrop(signers[1].address, 10);

    await heatToken.setMinterRole(signers[0].address);
    await heatToken.mint(signers[1].address, ethers.utils.parseEther("10000"));
    
  });


  it('Merge cubz', async function () {
    expect((await cyberlionz.totalSupply()).toNumber()).to.be.equal(10)

    await heatToken.connect(signers[1]).approve(cyberlionzMerger.address, ethers.utils.parseEther("10000"));
    await cyberlionz.connect(signers[1]).setApprovalForAll(cyberlionzMerger.address, true);
    await cyberlionzMerger.connect(signers[1]).mergeCubz(1, 2);

    expect((await heatToken.balanceOf(signers[1].address))).to.be.equal(ethers.utils.parseEther("9900"));
    expect((await heatToken.balanceOf(cyberlionzMerger.address))).to.be.equal(ethers.utils.parseEther("100"));

    expect((await cyberlionz.ownerOf(1)).toLowerCase()).to.be.equal(cyberlionzMerger.address.toLowerCase());
    expect((await cyberlionz.ownerOf(2)).toLowerCase()).to.be.equal(signers[1].address.toLowerCase());

    //tries to use it again
    await expect(
      cyberlionzMerger.connect(signers[1]).mergeCubz(3, 2)
    ).to.be.revertedWith('Cub reached max');

    let lockedCubz = await cyberlionzMerger.getLockedLionz();
    expect(lockedCubz.length).to.be.equal(1);
    expect(lockedCubz[0]).to.be.equal(1);

    expect((await cyberlionzAdults.balanceOf(signers[1].address)).toNumber()).to.be.equal(1);
    expect((await cyberlionzAdults.ownerOf(1)).toLowerCase()).to.be.equal(signers[1].address.toLowerCase())

    await cyberlionzMerger.withdrawFunds(signers[0].address);
    expect((await heatToken.balanceOf(cyberlionzMerger.address))).to.be.equal(ethers.utils.parseEther("0"));
    expect((await heatToken.balanceOf(signers[0].address))).to.be.equal(ethers.utils.parseEther("100"))

    await cyberlionzMerger.setMergePrice(ethers.utils.parseEther("500"))

    await cyberlionzMerger.setCubMaxTimesAllowedToUse(2);
    await cyberlionzMerger.connect(signers[1]).mergeCubz(3, 2);

    expect((await heatToken.balanceOf(signers[1].address))).to.be.equal(ethers.utils.parseEther("9400"));
    expect((await heatToken.balanceOf(cyberlionzMerger.address))).to.be.equal(ethers.utils.parseEther("500"));

    lockedCubz = await cyberlionzMerger.getLockedLionz();
    expect(lockedCubz.length).to.be.equal(2);
    expect(lockedCubz[1]).to.be.equal(3);

    //tries to use it again
    await expect(
      cyberlionzMerger.connect(signers[1]).mergeCubz(4, 2)
    ).to.be.revertedWith('Cub reached max');


    expect(await cyberlionzMerger.cubTimesUsed(2)).to.be.equal(2);

  });
});