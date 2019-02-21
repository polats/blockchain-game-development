const SimpleToken = artifacts.require("./SimpleToken.sol");

module.exports = (deployer) => {
  deployer.deploy(SimpleToken, "Our Token", "OTK", 18, 50000);
};
