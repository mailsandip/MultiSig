import React, {useState} from "react";

function NewTransfer({createTransfer}) {
    const [transfer, setTransfer] = useState(undefined);

    const updateTrasfer = (e,field) =>{
        const value = e.target.value;
        setTransfer({...transfer,[field]:value});
    };

    const submit = (e) => {
        e.preventDefault();
        createTransfer(transfer);
    }


    return(
        <div>
            <h2>Create Transfer </h2>
            <form onSubmit={e =>{submit(e)}}>
                <label htmlFor="to">To</label>
                <input id="to" type="text" onChange={(e)=>updateTrasfer(e,'to')}
                />
                <label htmlFor="amount">Amount</label>
                <input id="amount" type="text" onChange={(e)=>updateTrasfer(e,'amount')}
                />
                <button>Submit</button>
            </form>
        </div>
    );

}

export default NewTransfer;