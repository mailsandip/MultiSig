import React from "react";

function TransferList({transfers,approveTransfer}) {
    return(
        <div>
            <table>
                <h2>Transfers</h2>
                <theader>
                    <tr>
                        <th>Id</th>
                        <th>Amount</th>
                        <th>To</th>
                        <th>Approvals</th>
                        <th>Sent</th>
                    </tr>

                </theader>
                <tbody>
                    {transfers.map(transfer => (
                        <tr key={transfer.id}>
                            <td>{transfer.id}</td>
                            <td>{transfer.amount}</td>
                            <td>{transfer.to}</td>
                            <td>
                                {transfer.noOfApprovals}
                                <button onClick={() => approveTransfer(transfer.id)}>Approve</button>
                            </td>
                            <td>{transfer.isTxDone ? 'Yes' : 'No'}</td>
                        </tr>            
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TransferList;