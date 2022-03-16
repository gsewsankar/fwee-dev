import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Popper } from '@mui/material';
import React, { useState } from 'react';
import TransactionForm from './TransactionForm';

export default function ChatAttachmentPopper(props) {
    const {
        transaction,
        onSetTransaction: setTransaction
    } = props;

    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    function handleClick(event) {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    }

    function handleSetTransaction(transaction) {
        setTransaction(transaction);
        setAnchorEl(null); // Close Popper
    }

    return (
    <>
        <Button onClick={handleClick} variant={transaction ? 'contained' : 'outlined'}>
            <FontAwesomeIcon icon={faPlusCircle}/>
        </Button>
        <Popper open={open} anchorEl={anchorEl} placement='top-start'>
            <TransactionForm 
                onSetTransaction={handleSetTransaction}
                prefill={transaction}
            />
        </Popper>
    </>
    )
}
