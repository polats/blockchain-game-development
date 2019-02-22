pragma solidity ^0.4.24;

import "./TradeableERC721Token.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Cryptoitem is TradeableERC721Token {
  constructor(address _proxyRegistryAddress) TradeableERC721Token("Cryptoitem Demo Collection", "CIDC", _proxyRegistryAddress) public {  }

  function baseTokenURI() public view returns (string) {
    return "https://cryptogame101.herokuapp.com/item/";
  }
}