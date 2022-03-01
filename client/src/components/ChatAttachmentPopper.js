import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Popper } from '@mui/material';
import React, { useState } from 'react';
import TransactionForm from './TransactionForm';

export default function ChatAttachment() {
    const [anchorEl, setAnchorEl] = useState(null);

    function handleClick(event) {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    }

    const open = Boolean(anchorEl);

    return (
    <>
        <button onClick={handleClick}>
            <FontAwesomeIcon icon={faPlusCircle}/>
        </button>
        <Popper open={open} anchorEl={anchorEl} placement='top-start'>
            <TransactionForm/>
        </Popper>
    </>
    )
}
