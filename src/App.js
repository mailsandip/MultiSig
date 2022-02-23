import React, {useState, useEffect} from 'react';
import {getWeb3, getWalletContract} from './utils.js';
import Header from './Header.js';
import NewTransfer from './NewTransfer.js';
import TransferList from './TransferList.js';

function App() {
  const [web3, setWeb3] = useState(undefined);
  const[accounts,setAccounts] = useState(undefined);
  const [walletContract,setWalletContract] = useState(undefined);
  const [approvers, setApprovers] = useState([]);
  const[quorum, setQuorum] = useState(undefined);
  const[transfers,setTransfers] = useState([]);

useEffect(() => {
  const init = async () => {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const walletContract = await getWalletContract(web3);
    const approvers = await walletContract.methods.getApprovers().call();
    const quorum = await walletContract.methods.quorum().call();
    const transfers = await walletContract.methods.getTransactions().call();
    setWeb3(web3);
    setAccounts(accounts);
    setWalletContract(walletContract);
    setApprovers(approvers);
    setQuorum(quorum);
    setTransfers(transfers);    
  };
  init();
},[]);

  const createTransfer = (transfer) => {
    walletContract.methods.createTransfer(transfer.to,transfer.amount).send({from:accounts[0]});
  }

  const approveTransfer = (transferId)=> {
    walletContract.methods.approveTx(transferId).send({from:accounts[0]});
  }


  if(typeof web3 ==='undefined' || typeof accounts === 'undefined' || typeof walletContract === 'undefined'
    || typeof quorum === 'undefined' || approvers.length === 0) {
    return(<div>Loading....</div>)
  } 
    return (
      <div>
        MultiSig Wallet
        <Header approvers={approvers} quorum={quorum} />
        <NewTransfer createTransfer={createTransfer} />
        <TransferList transfers={transfers} approveTransfer={approveTransfer}/>
      </div>
    );
  
}

export default App;
