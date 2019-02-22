const HDWalletProvider = require("truffle-hdwallet-provider")
var contract_json = require("../build/contracts/Cryptoitem.json");
var contract_json_factory = require("../build/contracts/CryptoitemFactory.json");

const web3 = require('web3')
require('dotenv').config()

const NETWORK = process.argv[2];
const MINT_OPTION = process.argv[3];

const DEFAULT_OPTION_ID = 0;

const SEED_PHRASE = process.env.SEED_PHRASE
const INFURA_KEY = "3616d3ebf2d1490f93b3ac08eeb907d7" // replace with your own if you want stats via infura.io

if (!SEED_PHRASE) {
    console.error("Please set a seed phrase.")
    return
}

const NFT_ABI = [{
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      }
    ],
    "name": "mintTo",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
        {
            "name": "",
            "type": "uint256"
        }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
]

const FACTORY_ABI = [{
    "constant": false,
    "inputs": [
      {
        "name": "_optionId",
        "type": "uint256"
      },
      {
        "name": "_toAddress",
        "type": "address"
      }
    ],
    "name": "mint",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}]


var network_id;
var opensea_link = "opensea.io/get-listed";

switch (NETWORK)
{
    case "rinkeby":
        network_id = 4;
        opensea_link = "rinkeby." + opensea_link;
        break;
    case "mainnet":
        network_id = 1;
        break;
}


const NFT_CONTRACT_ADDRESS = contract_json.networks[network_id].address;
const FACTORY_CONTRACT_ADDRESS = contract_json_factory.networks[network_id].address;


    async function main() {
        const provider = new HDWalletProvider(SEED_PHRASE, `https://${NETWORK}.infura.io/${INFURA_KEY}`)
        const web3Instance = new web3(
            provider
        )
        
        const OWNER_ADDRESS = provider.addresses[0];

        console.log("=======================")
        console.log("Minting items...")
        console.log("Please be patient -- this may take a while.")
        console.log("Try pressing the arrow keys if the terminal seems to have paused.")
        console.log("=======================")

        switch (MINT_OPTION) {

            case "all":
                var config = require("../cryptoitem-metadata-server/local.db.json").config;
                var quantity = config.initial_quantity_to_pre_mint;
                var pre_mint_items = config.pre_mint_items;

                if (pre_mint_items)
                {

                    const nftContract = new web3Instance.eth.Contract(NFT_ABI, NFT_CONTRACT_ADDRESS, { gasPrice: gp, gasLimit: "6712388" })
                    const nftTotalSupply = await nftContract.methods.totalSupply().call();

                    console.log("=======================")
                    console.log(nftTotalSupply + " already minted.");
                    console.log(quantity + " total items to mint.");

                    var gp = await web3Instance.eth.getGasPrice();
                    const factoryContract = new web3Instance.eth.Contract(FACTORY_ABI, FACTORY_CONTRACT_ADDRESS, { gasPrice: gp, gasLimit: "6712388" })

                    for (var i = nftTotalSupply; i < quantity; i++) {
                        console.log("Minting " + (i + 1) + " of " + quantity + ".");
                        const result = await factoryContract.methods.mint(DEFAULT_OPTION_ID, OWNER_ADDRESS).send({ from: OWNER_ADDRESS });
                        console.log(" Transaction: " + result.transactionHash);
                    }


                    console.log("=======================")
                    console.log("=======================")
                    console.log("\nDone. \n\nCryptoitem Contract Address: \n" + NFT_CONTRACT_ADDRESS);
                    console.log("\nInput the address in a marketplace to view (ex: " + opensea_link + ")");

                }
            break;
        }

        provider.engine.stop();
    }


main()
