// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract MultiSigWallet {
    address[] public approvers;
    uint256 public quorum;

    struct Transaction {
        uint256 id;
        uint256 amount;
        address payable to;  
        uint256 noOfApprovals;
        bool isTxDone;
    }

    Transaction[] public transactions;  // list of Txs done by this Multi-Sig Wallet
    

    mapping(address => mapping(uint256 => bool)) public approvals;

    modifier onlyApprover() {
        //the msg.sender should be one of the approver available in the approvers array
        //change it to mapping later on, as array looping are costly from Gas perspective

        bool allowed = false;
        for(uint256 i=0;i<approvers.length;i++){
            if(approvers[i] == msg.sender){
                allowed=true;
            }
        }
        require(allowed == true, "Only approvers allowed");
        _;
    }

    //constructor function
    constructor(address[] memory _approvers,uint256 _quorum){
        approvers = _approvers;
        quorum = _quorum;
    }

    function getApprovers() external view returns(address[] memory) {
        return approvers;
    }

    function createTransfer(address payable to, uint256 amount) external onlyApprover() {
        transactions.push(Transaction(
            transactions.length, //length of the array
            amount,
            to,
            0,
            false
        ));
    }

    function getTransactions() external view returns(Transaction[] memory){
        return transactions;
    }

    function approveTx(uint256 id) external onlyApprover() {
        require(transactions[id].isTxDone == false, "Transaction is already being processed");
        require(approvals[msg.sender][id]==false, "Can not approve the same tx twice");

        approvals[msg.sender][id] = true; //mark your vote
        transactions[id].noOfApprovals++; // increase count of approvalss

        if(transactions[id].noOfApprovals >= quorum){
            address payable to = transactions[id].to;
            uint256 amount = transactions[id].amount;
            to.transfer(amount); //wait for the Tx
            //wait for the Tx to complete, then mark the Tx as done

            transactions[id].isTxDone=true;
        }
    }

    // receive ether in this smart contract address
    receive() external payable {}
    
}