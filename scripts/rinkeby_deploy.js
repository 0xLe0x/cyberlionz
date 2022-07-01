const { ethers } = require('hardhat');

require('dotenv').config({path:__dirname+'/.env'});

async function main() {

  const {
    REVENUE_RECIPIENT,
    WHITELIST,
    URI
  } = process.env

  // Deploy CyberLionzCubz
  const CyberLionzCubz = await ethers.getContractFactory("CyberLionzCubzMock");
  const cyberLionzCubz = await CyberLionzCubz.deploy(
      "https://cyberlionz-test.s3.amazonaws.com/Cubz/json/1.json", 
      WHITELIST
  )
  await cyberLionzCubz.deployed();
  console.log("CyberLionzCuz deployed to address:", cyberLionzCubz.address)


  // Deploy HeatToken
  const HeatToken = await ethers.getContractFactory("HeatTokenMock");
  const heatToken = await HeatToken.deploy()
  await heatToken.deployed();
  console.log("HeatToken deployed at address:", heatToken.address)

  // Deploy CyberLionzAdults
  const CyberLionzAdults = await ethers.getContractFactory('CyberLionzAdults')
	const cyberLionzAdults = await CyberLionzAdults.deploy(
		'https://cyberlionz.s3.amazonaws.com/Cubz/json/'
	)
	await cyberLionzAdults.deployed()
	console.log('CyberLionzAdults deployed at address:', cyberLionzAdults.address)

  // Deploy CyberLionzMerger
  const CyberLionzMerger = await ethers.getContractFactory("CyberLionzMerger");
  const cyberLionzMerger = await CyberLionzMerger.deploy(
    cyberLionzCubz.address,
    heatToken.address,
    cyberLionzAdults.address,
    ethers.utils.parseEther("500")
  )
  await cyberLionzMerger.deployed();
  console.log("CyberLionzMerger deployed at address:", cyberLionzMerger.address)

  // set merger as minter role
  await cyberLionzAdults.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE")), cyberLionzMerger.address);
  console.log("CyberLionzMerger set as minter role");

  const ClStaking = await ethers.getContractFactory("CyberLionzStaking");
  const clStaking = await ClStaking.deploy(
    heatToken.address
  )
  await clStaking.deployed();
  console.log("ClStaking deployed at address:", clStaking.address);

  //Set Collection
  await clStaking.setCollection(cyberLionzCubz.address, ethers.utils.parseEther("5"))
  await clStaking.setCollection(cyberLionzAdults.address, ethers.utils.parseEther("10"))

}
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
  