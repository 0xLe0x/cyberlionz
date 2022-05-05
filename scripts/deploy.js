require('dotenv').config();
const updateEnv = require('./updateEnv.js');

async function main() {
  // const arrayLibraryAddress = '0x9acC25e86dBb789BC0e454D229dAAad095fCf651'; // TOOD: change if necessary
  const arrayLibraryAddress = '0xdE4ED7D5AE9d45bE00b064418b3D0d11B893B8C7'; //local TOOD: change if necessary
  const contractFactory = await ethers.getContractFactory("CyberlionStaking"
  , {
    libraries: {
      Array: arrayLibraryAddress,
    }
  }
  );

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const { HIDDEN_METADATA_CID, VOUCHER_SIGNER_PUBLIC_KEY } = process.env;
  
  const delayedRevealUri = `${HIDDEN_METADATA_CID}`
  const paymentsReceiver = "0x9be54fd05a73006fdd405e292b72e9db94513776049c6f2431a27810f6b63521"
  const heatTokenAddress = '0xf18fd1dB5f39d5B96403Eea02885daF741F1e39c'
  const cLheaAddress = '0x57da186dbeA9Fee737faFAfF8828D002B4b0ad8c'
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
  