require('dotenv').config()

const HDWalletProvider = require("truffle-hdwallet-provider");
const SEED_PHRASE = process.env.SEED_PHRASE
const INFURA_KEY = "3616d3ebf2d1490f93b3ac08eeb907d7" // replace with your own if you want stats via infura.io

if (!SEED_PHRASE) {
  console.error("Please set a seed phrase.")
  return
}

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      gas: 6712388,
      gasPrice: 7000000000,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(
          SEED_PHRASE,
          "https://rinkeby.infura.io/" + INFURA_KEY
        );
      },
      network_id: "*",
      gas: 6712388,
      gasPrice: 7000000000
    },
    live: {
      network_id: 1,
      provider: function() {
        return new HDWalletProvider(
          SEED_PHRASE,
          "https://mainnet.infura.io/" + INFURA_KEY
        );
      },
      gas: 6712388,
      gasPrice: 7000000000
    },
    mocha: {
      reporter: 'eth-gas-reporter',
      reporterOptions : {
        currency: 'USD',
        gasPrice: 2
      }
    }
  }
};
