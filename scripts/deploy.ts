import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";

async function main() {

  //const {CYBERLIONZ_NFT_ADDRESS, STAKING_REWARDS} = process.env
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());


  const HeatToken : ContractFactory = await ethers.getContractFactory("HeatToken");
  // const heatToken : Contract = await HeatToken.deploy();
  // await heatToken.deployed();

  // console.log("HeatToken Contract's address: " + heatToken.address);
  
  const CLStaking = await ethers.getContractFactory('CyberlionStaking');
  const clStaking = await CLStaking.deploy("0xf0f9fc3d3180cf581e5c8d27b4a6e3cede24962d")
  await clStaking.deployed();


  
  console.log("Staking Contract's address: " + clStaking.address);
  console.log("Transaction hash: " + clStaking.deployTransaction.hash);

  
  // const deployedContract = await CLStaking.attach(clStaking.address)
  

  //await CLStaking.setCollection(CYBERLIONZ_NFT_ADDRESS, STAKING_REWARDS)

  

}

main()
  .then(() => process.exit(0))
  .catch(error => {
      console.error(error);
      process.exit(1);
    }
  );