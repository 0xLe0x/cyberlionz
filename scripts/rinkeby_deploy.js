const { ethers } = require('hardhat');

require('dotenv').config({path:__dirname+'/.env'});

async function main() {

  const {
    REVENUE_RECIPIENT,
    WHITELIST,
    URI
  } = process.env

  // Deploy CyberLionzCubz
  const CyberLionzCubz = await ethers.getContractFactory("CyberLionzCubz");
  const cyberLionzCubz = await CyberLionzCubz.deploy(
      "ipfs://QmYfsUQEdmaaw8zDmR8qR7Cua6dakPGBuXsAPks7pedX4u/", 
      WHITELIST
  )
  await cyberLionzCubz.deployed();
  console.log("CyberLionzCuz deployed to address:", cyberLionzCubz.address)


  // Deploy HeatToken
  const HeatToken = await ethers.getContractFactory("HeatTokenMock");
  const heatToken = await HeatToken.deploy()
  await heatToken.deployed();
  console.log("HeatToken deployed at address:", heatToken.address)

  // Deploy CyberLionzMerger
  const CyberLionzMerger = await ethers.getContractFactory("CyberLionzMerger");
  const cyberLionzMerger = await CyberLionzMerger.deploy(
    cyberLionzCubz.address,
    heatToken.address,
    ethers.utils.parseEther("500")
  )
  await cyberLionzMerger.deployed();
  console.log("CyberLionzMerger deployed at address:", cyberLionzMerger.address)

  // Deploy CyberLionzAdults
  const CyberLionzAdults = await ethers.getContractFactory("CyberLionzAdults");
  const cyberLionzAdults = await CyberLionzAdults.deploy(
    "ipfs://QmYfsUQEdmaaw8zDmR8qR7Cua6dakPGBuXsAPks7pedX4u/",
    WHITELIST,
    REVENUE_RECIPIENT,
    cyberLionzMerger.address
  )
  await cyberLionzAdults.deployed()
  console.log("CyberLionzAdults deployed at address:", cyberLionzAdults.address)

  // set CyberLionzAdults address in CyberLionzMerger
  await cyberLionzMerger.setCyberLionzAdults(cyberLionzAdults.address);
  console.log("CyberLionzAdults address set on CyberLionzMerger");

}
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
  