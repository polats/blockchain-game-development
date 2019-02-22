const CryptoitemContract = artifacts.require("./Cryptoitem.sol");
const CryptoitemFactoryContract = artifacts.require("./CryptoitemFactory.sol")
const CryptoitemLootboxContract = artifacts.require("./CryptoitemLootBox.sol")

module.exports = function(deployer, network) {
  // OpenSea proxy registry addresses for rinkeby and mainnet.
  let proxyRegistryAddress = ""
  if (network === 'rinkeby') {
    proxyRegistryAddress = "0xf57b2c51ded3a29e6891aba85459d600256cf317";
  } else {
    proxyRegistryAddress = "0xa5409ec958c83c3f309868babaca7c86dcb077c1";
  }

  
  deployer.deploy(CryptoitemContract, proxyRegistryAddress, {gas: 6712388}).then(() => {
     return deployer.deploy(CryptoitemFactoryContract, proxyRegistryAddress, CryptoitemContract.address, {gas: 6712388});
   }).then(async() => {
     var cryptoitem = await CryptoitemContract.deployed();
     return cryptoitem.transferOwnership(CryptoitemFactoryContract.address);
   })

};