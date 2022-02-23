import MultiSigWallet from './contracts/MultiSigWallet.json';
import detectEthereumProvider from '@metamask/detect-provider';


const Web3 = require('web3');

const getWeb3 = function() {
    //return new Web3('http://127.0.0.1:9545');
 
        return new Promise(async (resolve, reject) => {
            const provider = await detectEthereumProvider();
            if(provider){
                //const web3 = new Web3(window.ethereum);
                await provider.request({ method: 'eth_requestAccounts' });
                try{
                    const web3 = new Web3(window.ethereum);
                    resolve(web3);                    
                }catch(error){
                    reject(error);
                }
            }else if(window.web3){
                resolve(window.web3);
            }else{
                reject('Please install Metamask');
            }
  
    });
};

const getWalletContract = async (web3)  => {
    var currentNetworkId = await web3.eth.net.getId();
    var deployedNetwork = MultiSigWallet.networks[currentNetworkId];
    return new web3.eth.Contract(
        MultiSigWallet.abi,
        deployedNetwork && deployedNetwork.address
    );
};

export{ getWeb3 , getWalletContract };