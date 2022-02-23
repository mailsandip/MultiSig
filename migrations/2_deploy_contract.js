const { web3 } = require("@openzeppelin/test-helpers/src/setup");

const MultiSigWallet = artifacts.require('MultiSigWallet');

module.exports = async function(deployer, network, accounts) {
   await deployer.deploy(MultiSigWallet,[accounts[0],accounts[1],accounts[2]],2);
   const wallet = await MultiSigWallet.deployed();
//    const results = await web3.eth.sendTransaction({
//        from: accounts[0],
//        to: wallet.address,
//        value: 10000
//    });
}