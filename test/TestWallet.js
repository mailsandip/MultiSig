const MultiSigWallet = artifacts.require("MultiSigWallet");
const {BN, constants, expectEvent, expectRevert} = require('@openzeppelin/test-helpers');


const { web3 } = require('@openzeppelin/test-helpers/src/setup');

contract('MultiSigWallet', (accounts) => {
    let wallet;

    beforeEach(async ()=> {    // function trigerred for each funtion
        wallet = await MultiSigWallet.new([accounts[0],accounts[1],accounts[2]],2);  //need to pass params to constructor
        await web3.eth.sendTransaction({
            from:accounts[0],
            to: wallet.address,
            value:10000            
        })
        .on("sending",function(payload){
           console.log('sending::'+payload);
        })
        .on('sent',function(payload){
            //console.log('sent::'+payload);
        })
        .on('transactionHash',function(transactionHash){
            //console.log(transactionHash);
        })
        .on('receipt',function(receipt){
            //console.log('receipt' + receipt);
        })
        .on('confirmation',function(confirmationNumber,receipt,latestBlockHash){
            //console.log(confirmationNumber);
        })
        .on('error',function(error){
            //console.log(error);
        })
    });

    //write the tests

    it('it should have correct approvers and quorum', async () => {
        const approvers = await wallet.getApprovers();
        const quorum = await wallet.quorum();
        //console.log(quorum);
        //assert.equal(approvers.length, 2, "it has correct numbers of approvers");
        assert(approvers[0] === accounts[0]);
        assert(approvers[1] === accounts[1]);
        assert(approvers[2] === accounts[2]);
        assert(quorum.toNumber() === 2);
    });

    //write tests to check send Transfer function of contract
    it('should create transfers', async () => {
        await wallet.createTransfer(accounts[4],'100',{from:accounts[0]});

        const txs = await wallet.getTransactions();

        assert(txs.length === 1);
        assert(txs[0].id === '0');
        assert(txs[0].amount === '100');
        assert(txs[0].to === accounts[4]);
        assert(txs[0].noOfApprovals === '0');
        assert(txs[0].isTxDone === false);

    });

    // negative test

    it('it should throw error if non-approvers try to transfer', async () => {
       await expectRevert(
            wallet.createTransfer(accounts[5],100,{from:accounts[6]}),
            'Only approvers allowed'
        );
    });

    //test the approve function
    it(' it should increment approvals', async function(){
        await wallet.createTransfer(accounts[4],100,{from:accounts[0]});
        await wallet.approveTx(0,{from:accounts[0]});

        const transactions = await wallet.getTransactions();
        const balance = await web3.eth.getBalance(wallet.address);

        assert(balance === '10000');
        assert(transactions[0].noOfApprovals === '1');
        assert(transactions[0].isTxDone === false);
    });

    it.only('it should transfer after quorum', async () => {
        let bala1 = await web3.eth.getBalance(accounts[6]);
        const balanceBefore = web3.utils.toBN(bala1);
        console.log(balanceBefore.toString());
        await wallet.createTransfer(accounts[6],100,{from:accounts[0]});
        await wallet.approveTx(0,{from:accounts[0]});
        await wallet.approveTx(0,{from:accounts[1]});
        const balanceAfter = web3.utils.toBN(await web3.eth.getBalance(accounts[6]));
        assert(balanceAfter.sub(balanceBefore).toNumber() === 100);
    });

    //unhappy path
    it('it should not allow non-approvers', async () => {
       await wallet.createTransfer(accounts[6],100,{from:accounts[0]});
        await expectRevert(
            wallet.approveTx(0,{from:accounts[7]}),
            'Only approvers allowed'
        );
    });

    //
    it('it should NOT approve transfer if already sent', async () => {
        await wallet.createTransfer(accounts[6],100,{from:accounts[0]});
        await wallet.approveTx(0,{from:accounts[0]});
        await wallet.approveTx(0,{from:accounts[1]});
        await expectRevert(
            wallet.approveTx(0,{from:accounts[2]}),
            'Transaction is already being processed'
        );
        
    });

    it('it should not allow approval twice', async () => {
        await wallet.createTransfer(accounts[6],100,{from:accounts[0]});
        await wallet.approveTx(0,{from:accounts[0]});

        await expectRevert(
            wallet.approveTx(0,{from:accounts[0]}),
            'Can not approve the same tx twice'
        );
    });
}); 