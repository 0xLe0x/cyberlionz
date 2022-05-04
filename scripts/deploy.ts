import { ethers } from "hardhat";

async function main() {
  const heatTokenAddress = '0xf18fd1dB5f39d5B96403Eea02885daF741F1e39c'; // TOOD: change if necessary
  const CyberlionStaking = await ethers.getContractFactory("CyberlionStaking"); 
  const greeter = await CyberlionStaking.deploy(heatTokenAddress);

  await greeter.deployed();

  console.log("CyberlionStaking deployed to:", greeter.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});