import Web3 from 'web3';

//const web3 = new Web3(window.web3.currentProvider);

/*
let web3 = null;
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/v3/af057cffb09d4672b0f374921c3eb03c"));
  web3.eth.getBalance("0xF501B6b7BC08D832a6b37B743C27e81A7fD36248", function(err, result) {
  if (err) {
    console.log(err)
  } else {
    console.log(web3.utils.fromWei(result, "ether") + " ETH")
  }
})


*/

const web3 = new Web3(window.web3.currentProvider);
window.ethereum.enable();

export default web3;