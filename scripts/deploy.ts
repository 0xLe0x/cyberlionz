import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";

async function main() {

  //const {CYBERLIONZ_NFT_ADDRESS, STAKING_REWARDS} = process.env
  
  const HeatToken : ContractFactory = await ethers.getContractFactory("HeatToken");
  const heatToken : Contract = await HeatToken.deploy();
  await heatToken.deployed();

  console.log("HeatToken Contract's address: " + heatToken.address);
  
  const CLStaking = await ethers.getContractFactory('CyberlionStaking');
  const clStaking = await CLStaking.deploy(heatToken.address)
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