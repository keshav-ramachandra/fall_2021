### 1. Inner details of how a contract is deployed?

### 2. What is the significance of address(0)?

* A special Ethereum address, composed entirely of zeros, that is specified as the destination address of a contract creation transaction.
* Tokens can also be burnt by sending it to the zero address


### 3. How is a transaction signed? How is verified?

* The process of signing transactions involves a mathematical function that depends both on the message (the transaction details), and your private key. The result is a signature that can be verified using your public key and the message (the transaction details).

* https://towardsdatascience.com/a-shallow-dive-into-bitcoins-blockchain-part-2-transactions-d4ee83067bae


### 4. Types of wallet and funtions of a wallet.

* https://www.legalexaminer.com/technology/crypto/cryptocurrency-wallets-what-is-right-for-you/

### 5. How is an address of an account in Ethereum derived? How about in Bitcoin?

* Ethereum : https://hackernoon.com/how-to-generate-ethereum-addresses-technical-address-generation-explanation-25r3zqo

* Bitcoin Address derivation, https://medium.com/@tunatore/how-to-generate-bitcoin-addresses-technical-address-generation-explanation-and-online-course-a6b46a2fe866


### 6. Inner details of proof of stake consensus.

* https://bitfury.com/content/downloads/pos-vs-pow-1.0.2.pdf

### 7. When we deploy from Remix on Ropsten where is the smart contract deployed?

* When we select the Web3 provider, Remix uses Metamask to connect to one of the ethereum networks. MetaMask is a type of Ethereum wallet that bridges the gap between the user interfaces for Ethereum (e.g. Mist browsers, DApps) and the regular web (e.g. Chrome, Firefox, websites).


  _What does Metamask do_ ??

* Its function is to inject a JavaScript library called web3.js into the namespace of each page your browser loads. Web3.js is written by the Ethereum core team.   MetaMask is mainly used as a plugin in chrome.


### 8. Where is mempool of transactions stored?

* https://blog.bitstamp.net/post/confirmed-and-unconfirmed-blockchain-transactions
* https://99bitcoins.com/bitcoin/mempool/
* https://www.quicknode.com/guides/defi/how-to-access-ethereum-mempool
* https://www.blocknative.com/blog/mempool-intro
* https://blog.kaiko.com/an-in-depth-guide-into-how-the-mempool-works-c758b781c608

* The transaction pool is not stored on the blockchain: it is the set of transactions that are used to feed new blocks. Nodes store it in memory, and a poolstate.bin file when the node exits

### 9. How does the consensus process work in private chains such as multichain? in Hyperledger?


### 10.  How to extract details from a Tx you view on Ether scan?

* Creation a etherscan api Account and get API key

##### _To get details by transaction hash_

* https://api.etherscan.io/api?
module=proxy
&action=eth_getTransactionByHash
&txhash=0x1e2910a262b1008d0616a0beb24c1a491d78771baa54a33e66065e03b1f46bc1
&apikey=YOUR_API_KEY

##### _To check transaction receipt status_

* https://api.etherscan.io/api
   ?module=transaction
   &action=gettxreceiptstatus
   &txhash=0x513c1ba0bebf66436b5fed86ab668452b7805593c05073eb2d51d3a52f480a76
   &apikey=YourApiKeyToken
   
##### _Get event logs_
* https://api.etherscan.io/api?module=logs   
&action=getLogs   
&fromBlock=379224   
&toBlock=latest   
&address=0x33990122638b9132ca29c723bdf037f1a891a70c   
&topic0=0xf63780e752c6a54a94fc52715dbc5518a3b4c3c2833d301a204226548a2a8545
&apikey=8AZ15MJI4VKDS9GK6RFJP19NZRTIT1H5I9

### 11. Where / how can application find a public key given an address that sends a Tx?

### 12. ECC - Elliptic curve cryptography code and reference.

### 13. Ethereum: From Tx to receipt and logs, practical code flow.

* https://levelup.gitconnected.com/ethereum-transactions-receipts-logs-and-transaction-details-e3d799eaf913
* A transaction hash is generated when it is sent to the network. When the transaction is mined, a receipt is generated. The receipt contains information about the logs and bloom filter. The bloom filter can tell if a transaction belongs to a block so that effective queries can be made. In Ethereum, when a block is generated and verified, the contract address and the indexed fields of the records are added to a bloom filter. This filter is located in the block header. So if an application wants to find all the registry entries, the node only needs to scan the header. So you can recognize if the required data is there or not. These elements are not added to the block as such, in order to save storage space.

### 14. HD wallet details.

### 15. Blooms log visual and how it is managed in the block header

* https://medium.com/coinmonks/ethereum-under-the-hood-part-8-blocks-2-5fba93293213

* The bloom filter is a function that reduces a log entry into 256 byte hash.

* The Bloom filter in the transaction (R_b) contains only the logs from this transaction while the Bloom filter in the block header (H_b) contains the logs from all transactions in this block.

So yes, the information is stored twice, but with the benefit of being able to check quickly if a certain log is present in a block without having access to all transactions. This enables light clients (which only know block headers) to watch for events.

### 16. How can use or index into bloom's filter to look for specific events.


```solidity
Transfer(address indexed src, address indexed dst, uint val)

filter = {
    address: tokenAddress,
    topics: [
        id("Transfer(address,address,uint256)"),
        hexZeroPad(myAddress, 32)
    ]
};

// List all token transfers  *to*  myAddress:
filter = {
    address: tokenAddress,
    topics: [
        id("Transfer(address,address,uint256)"),
        null,
        hexZeroPad(myAddress, 32)
    ]
};

// List all token transfers  *to*  myAddress or myOtherAddress:
filter = {
    address: tokenAddress,
    topics: [
        id("Transfer(address,address,uint256)"),
        null,
        [
            hexZeroPad(myAddress, 32),
            hexZeroPad(myOtherAddress, 32),
        ]
    ]
};

```


### 17. Can you run this and check if you can get the public key from a real Tx?

### 18. Similarly, can you get me the code for obtaining the receipts of a function excution?

```solidity
const Web3 = require("web3");
const EventExample = require("./build/contracts/EventExample.json");

const init = async () => {
  const web3 = new Web3("ws://localhost:8545");

  const id = await web3.eth.net.getId();
  const deployedNetwork = EventExample.networks[id];
  const eventExample = new web3.eth.Contract(
    EventExample.abi,
    deployedNetwork.address
  );


  const accounts = await web3.eth.getAccounts();

  var getData = eventExample.methods.storeData(1,2).encodeABI();//just parameters you pass to myFunction
// And that is where all the magic happens
  await web3.eth.sendTransaction({
      to: deployedNetwork.address,//contracts address
      from:accounts[0],
      data: getData,
  }).on('transactionHash', function(hash){
    console.log("hash is", hash);
  })
  .on('receipt', function(receipt){
    console.log("receipt 1 is", receipt);
  })
  .on('confirmation', function(confirmationNumber, receipt){
    console.log("confirmation is",confirmationNumber);
    console.log("confirmation is", receipt);
  })
  .on('error', function(error, receipt) {
      console.log("receipt is", receipt);
  });
  ```

### 19. Similarly, can you get me the code for recovering event log from header bloom's log?

* I think we can get events by creating filters based on the indexed fields we used while defining the events. But the way events are retrieved from block header's bloom filter is an internal implementaton I guess.
```solidity
eventExample.events
   .DataStored({ filter: { data2: [5, 9] } })
   .on("data", (event) => {
       console.log(event);
    });
```
* https://betterprogramming.pub/learn-solidity-events-2801d6a99a92

### 20. https://web3js.readthedocs.io/en/v1.5.2/web3-eth-contract.html#events

### 21. How to get events? How are they logged in the header? See above URL>

* Events can be monitored using the Contracts Api whch is more convenient than working with the filters. They are Logged as data and topics. data will be those non indexed fields. And topics are indexed fields. In solidity, first topic will be the signature of the event and there can be a max of four indexed topic fields.
https://web3js.readthedocs.io/en/v1.2.4/web3-utils.html

### 22. Can we repeat the demo of this? https://medium.com/mycrypto/understanding-event-logs-on-the-ethereum-blockchain-f4ae7ba50378, watching things happen on blockchain? Can we explore this below further:? Events in the ethereum system must be easily searched for, so that applications can filter and display events, including historical ones, without undue overhead. At the same time, storage space is expensive, so we don't want to store a lot of duplicate data - such as the list of transactions, and the logs they generate. The logs bloom filter exists to resolve this.

```javascript
const Web3 = require("web3");
//const web3 = new Web3("");


let contractAbi = [
	{
		"inputs": [
			{
				"internalType": "contract LearnToken",
				"name": "_learnToken",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "_from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "Deposit",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "normalSubFee",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "premiumSubFee",
				"type": "uint256"
			}
		],
		"name": "registerAsOrganization",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	}
]

let contractAddress = '0xc271E0E53A7c88f1612DcA585af61F67Fe29eFCf';


const provider = 'wss://ropsten.infura.io/ws/v3/af057cffb09d4672b0f374921c3eb03c'
  let web3 = new Web3(new Web3.providers.WebsocketProvider(provider))
  let contract = new web3.eth.Contract(contractAbi, contractAddress);

  contract.events.Deposit()
.on('data', (event) => {
    console.log('data',event);
})
.on('error', console.error);

```

