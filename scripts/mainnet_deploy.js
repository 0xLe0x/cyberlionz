const { ethers } = require('hardhat');

require('dotenv').config({path:__dirname+'/.env'});

async function main() {

  // Deploy CyberLionzMerger
  const CyberLionzMerger = await ethers.getContractFactory("CyberLionzMerger");
  const cyberLionzMerger = await CyberLionzMerger.deploy(
    "0x1013051039BD988E8f150CC6C676aa4e32BF6120",
    "0x9948eAA3d985040C877e28739F5e61902Ddf6aFf",
    ethers.utils.parseEther("500")
  )
  await cyberLionzMerger.deployed();
  console.log("CyberLionzMerger deployed at address:", cyberLionzMerger.address)

  // Deploy CyberLionzAdults
  const CyberLionzAdults = await ethers.getContractFactory("CyberLionzAdults");
  const cyberLionzAdults = await CyberLionzAdults.deploy(
    "https://cyberlionz-test.s3.amazonaws.com/Lionz/json/",
    //TODO: WHITELIST,
    //TODO: REVENUE_RECIPIENT,
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
  