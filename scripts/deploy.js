require('dotenv').config();

const updateEnv = require('./updateEnv.js');

async function main() {
  const contractFactory = await ethers.getContractFactory("CyberlionStaking");
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const { HIDDEN_METADATA_CID, VOUCHER_SIGNER_PUBLIC_KEY } = process.env;
  
  const delayedRevealUri = `${HIDDEN_METADATA_CID}`
  const heatTokenAddress ='0x2967548E1B5043125b0aD681A674Bdebc8710ff1'
  const contract = await contractFactory.deploy(heatTokenAddress)

  const envUpdate = {
    'STAKING_CONTRACT_ADDRESS': contract.address
  }

  updateEnv(envUpdate)

      
  console.log("Contract deployed to address:", contract.address)
}
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
  