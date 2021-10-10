* 8


### 10.  How to extract details from a Tx you view on Ether scan?

* Creation a etherscan api Account and get API key

##### To get details by transaction hash

* https://api.etherscan.io/api?
module=proxy
&action=eth_getTransactionByHash
&txhash=0x1e2910a262b1008d0616a0beb24c1a491d78771baa54a33e66065e03b1f46bc1
&apikey=YOUR_API_KEY

##### To check transaction receipt status

* https://api.etherscan.io/api
   ?module=transaction
   &action=gettxreceiptstatus
   &txhash=0x513c1ba0bebf66436b5fed86ab668452b7805593c05073eb2d51d3a52f480a76
   &apikey=YourApiKeyToken
   
##### Get event logs
* https://api.etherscan.io/api?module=logs   
&action=getLogs   
&fromBlock=379224   
&toBlock=latest   
&address=0x33990122638b9132ca29c723bdf037f1a891a70c   
&topic0=0xf63780e752c6a54a94fc52715dbc5518a3b4c3c2833d301a204226548a2a8545
&apikey=8AZ15MJI4VKDS9GK6RFJP19NZRTIT1H5I9
