
import { ethers } from "hardhat";

async function main() {
  const arrayLibraryAddress = '0x9acC25e86dBb789BC0e454D229dAAad095fCf651'; // TOOD: change if necessary
  const heatTokenAddress = '0xdbF1CE189f2De6e265BBBfCca2164F556Fe9f1Be'; // TOOD: change if necessary

  const CyberlionStaking = await ethers.getContractFactory("CyberlionStaking", {
    libraries: {
      Array: arrayLibraryAddress,
    },
  });
  const greeter = await CyberlionStaking.deploy(heatTokenAddress);

  await greeter.deployed();

  console.log("CyberlionStaking deployed to:", greeter.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
