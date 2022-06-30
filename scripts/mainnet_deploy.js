const { ethers } = require('hardhat');

require('dotenv').config({path:__dirname+'/.env'});

async function main() {

  // Deploy CyberLionzAdults
  const CyberLionzAdults = await ethers.getContractFactory("CyberLionzAdults");
  const cyberLionzAdults = await CyberLionzAdults.deploy(
    "https://cyberlionz.s3.amazonaws.com/Cubz/json/",
  )
  await cyberLionzAdults.deployed()
  console.log("CyberLionzAdults deployed at address:", cyberLionzAdults.address)


  // Deploy CyberLionzMerger
  const CyberLionzMerger = await ethers.getContractFactory("CyberLionzMerger");
  const cyberLionzMerger = await CyberLionzMerger.deploy(
    "0x1013051039BD988E8f150CC6C676aa4e32BF6120", //CyberLionzCubz
    "0x9948eAA3d985040C877e28739F5e61902Ddf6aFf", //HeatToken
    cyberLionzAdults.address,
    ethers.utils.parseEther("500")
  )
  await cyberLionzMerger.deployed();
  console.log("CyberLionzMerger deployed at address:", cyberLionzMerger.address)

  // set merger as minter role
  await cyberLionzAdults.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE")), cyberLionzMerger.address);
  console.log("CyberLionzMerger set as minter role");

}
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
  
