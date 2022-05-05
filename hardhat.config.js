/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require('dotenv').config();
 require("@nomiclabs/hardhat-waffle");
 require("@nomiclabs/hardhat-etherscan");

 const { 
  ALCHEMY_ROPSTEN_API_KEY,
  ALCHEMY_RINKEBY_API_KEY,
  ALCHEMY_MAINNET_API_KEY,
  CONTRACT_OWNER_PRIVATE_KEY,
  ETHERSCAN_API_KEY
} = process.env;
 
module.exports = {
  solidity: "0.8.13",
  defaultNetwork: "localhost",
  etherscan: {
    apiKey: ETHERSCAN_API_KEY

  },
  networks: {
    localhost: {
        url: "http://127.0.0.1:8545",
        accounts: ["0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e"]
    },
    // ropsten: {
    //   // url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_ROPSTEN_API_KEY}`,
    //   // accounts: [CONTRACT_OWNER_PRIVATE_KEY]
    // },
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/294756524c724e35ae8e7cb59f4eca94',
      //accounts: ["516dac8c11fefc880d316e9b7c3bd244019cea0cc8646374f760c09431417060"]
      accounts: [CONTRACT_OWNER_PRIVATE_KEY]
      // url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_RINKEBY_API_KEY}`,
      // accounts: ['91a0167cac5860e16de9d5d3843e1b9f65bed565a4e84b522ff5966c4fedb45e']
    },
    // mainnet: {
    //   // url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_MAINNET_API_KEY}`,
    //   // accounts: [CONTRACT_OWNER_PRIVATE_KEY]
    // }
  },
  mocha: {
    timeout: 20000
  }
};
