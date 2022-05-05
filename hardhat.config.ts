import "@nomiclabs/hardhat-waffle";
import "./tasks/accounts";
import "./tasks/verifyEtherScan";
import "solidity-coverage";

const { 
  ALCHEMY_ROPSTEN_API_KEY,
  ALCHEMY_RINKEBY_API_KEY,
  ALCHEMY_MAINNET_API_KEY,
  CONTRACT_OWNER_PRIVATE_KEY,
  ETHERSCAN_API_KEY
} = process.env;
 

module.exports = {
  solidity: "0.8.13",
  paths: {
    sources: "./contracts",
    tests: "./tests",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  // Added this network configuration to solve Metamask issue, as this article suggests (https://hardhat.org/metamask-issue.html)
  networks: {
    hardhat: {
      chainId: 1337
    },

    rinkeby: {
      chainId: 4
    },
  }
};