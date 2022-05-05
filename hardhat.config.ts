import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-etherscan";
// import "./tasks/accounts";
// import "./tasks/verifyEtherScan";
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
  etherscan: {
    apiKey: "I6XTK3DVBUSTSN9QWG218R8D4AH84NBV7C"

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
      url: 'https://rinkeby.infura.io/v3/294756524c724e35ae8e7cb59f4eca94',
      accounts: ["34db740991317f1d3ce8985302197d6d552a2853197b8f155603ab9fe53eede0"]
      // url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_RINKEBY_API_KEY}`,
      // accounts: ['91a0167cac5860e16de9d5d3843e1b9f65bed565a4e84b522ff5966c4fedb45e']
    },
  }
};