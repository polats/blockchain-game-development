pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Factory.sol";
import "./Cryptoitem.sol";
import "./CryptoitemLootBox.sol";
import "./Strings.sol";

contract CryptoitemFactory is Factory, Ownable {
  using Strings for string;

  address public proxyRegistryAddress;
  address public nftAddress;
  address public lootBoxNftAddress;
  string public baseURI = "https://server_url/factory/";

  /**
   * Enforce the existence of only max_cryptoitem_supply Cryptoitems.
   */
  uint256 CRYPTOITEM_SUPPLY = max_cryptoitem_supply;

  /**
   * Three different options for minting Cryptoitems (single, multiple, and lootbox).
   */
  uint256 NUM_OPTIONS = 3;
  uint256 SINGLE_CRYPTOITEM_OPTION = 0;
  uint256 MULTIPLE_CRYPTOITEM_OPTION = 1;
  uint256 LOOTBOX_OPTION = 2;
  uint256 QUANTITY_IN_MULTIPLE_CRYPTOITEM_OPTION = multi_cryptoitem_quantity1;

  constructor(address _proxyRegistryAddress, address _nftAddress) public {
    proxyRegistryAddress = _proxyRegistryAddress;
    nftAddress = _nftAddress;
    lootBoxNftAddress = new CryptoitemLootBox(_proxyRegistryAddress, this);
  }

  function name() external view returns (string) {
    return "collection_name Factory";
  }

  function symbol() external view returns (string) {
    return "collection_symbolF";
  }

  function supportsFactoryInterface() public view returns (bool) {
    return true;
  }

  function numOptions() public view returns (uint256) {
    return NUM_OPTIONS;
  }
  
  function mint(uint256 _optionId, address _toAddress) public {
    // Must be sent from the owner proxy or owner.
    ProxyRegistry proxyRegistry = ProxyRegistry(proxyRegistryAddress);
    assert(proxyRegistry.proxies(owner) == msg.sender || owner == msg.sender || msg.sender == lootBoxNftAddress);
    
    if (enforce_max_supply) {
    require(canMint(_optionId));
    }
    
    Cryptoitem cic = Cryptoitem(nftAddress);
    if (_optionId == SINGLE_CRYPTOITEM_OPTION) {
      cic.mintTo(_toAddress);
    } else if (_optionId == MULTIPLE_CRYPTOITEM_OPTION) {
      for (uint256 i = 0; i < QUANTITY_IN_MULTIPLE_CRYPTOITEM_OPTION; i++) {
        cic.mintTo(_toAddress);
      }
    } else if (_optionId == LOOTBOX_OPTION) {
      CryptoitemLootBox cilb = CryptoitemLootBox(lootBoxNftAddress);
      cilb.mintTo(_toAddress);
    } 
  }

  function canMint(uint256 _optionId) public view returns (bool) {
    if (_optionId >= NUM_OPTIONS) {
      return false;
    }

    Cryptoitem cic = Cryptoitem(nftAddress);
    uint256 cryptoitemSupply = cic.totalSupply();

    uint256 numItemsAllocated = 0;
    if (_optionId == SINGLE_CRYPTOITEM_OPTION) {
      numItemsAllocated = 1;
    } else if (_optionId == MULTIPLE_CRYPTOITEM_OPTION) {
      numItemsAllocated = QUANTITY_IN_MULTIPLE_CRYPTOITEM_OPTION;
    } else if (_optionId == LOOTBOX_OPTION) {
      CryptoitemLootBox cilb = CryptoitemLootBox(lootBoxNftAddress);
      numItemsAllocated = cilb.itemsPerLootbox();
    }
    return cryptoitemSupply < (CRYPTOITEM_SUPPLY - numItemsAllocated);
  }
  
  function tokenURI(uint256 _optionId) public view returns (string) {
    return Strings.strConcat(
        baseURI,
        Strings.uint2str(_optionId)
    );
  }

  /**
   * Hack to get things to work automatically on OpenSea.
   * Use transferFrom so the frontend doesn't have to worry about different method names.
   */
  function transferFrom(address _from, address _to, uint256 _tokenId) public {
    mint(_tokenId, _to);
  }

  /**
   * Hack to get things to work automatically on OpenSea.
   * Use isApprovedForAll so the frontend doesn't have to worry about different method names.
   */
  function isApprovedForAll(
    address _owner,
    address _operator
  )
    public
    view
    returns (bool)
  {
    if (owner == _owner && _owner == _operator) {
      return true;
    }

    ProxyRegistry proxyRegistry = ProxyRegistry(proxyRegistryAddress);
    if (owner == _owner && proxyRegistry.proxies(_owner) == _operator) {
      return true;
    }

    return false;
  }

  /**
   * Hack to get things to work automatically on OpenSea.
   * Use isApprovedForAll so the frontend doesn't have to worry about different method names.
   */
  function ownerOf(uint256 _tokenId) public view returns (address _owner) {
    return owner;
  }
}