
import "dotenv/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan"
import "solidity-coverage";

const { 
  ALCHEMY_RINKEBY_API_KEY,
  ALCHEMY_MAINNET_API_KEY,
  CONTRACT_OWNER_PRIVATE_KEY,
  ETHERSCAN_API_KEY
} = process.env;
 

module.exports = {
  solidity: "0.8.13",
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  // Added this network configuration to solve Metamask issue, as this article suggests (https://hardhat.org/metamask-issue.html)
  networks: {
    hardhat: {
      chainId: 1337
    },
    
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_RINKEBY_API_KEY}`,
      accounts: [CONTRACT_OWNER_PRIVATE_KEY]
    },
    mainnet: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_MAINNET_API_KEY}`,
      accounts: [CONTRACT_OWNER_PRIVATE_KEY]
    }
  }
};