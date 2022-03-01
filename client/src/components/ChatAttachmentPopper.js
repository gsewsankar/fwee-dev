import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Popper } from '../MaterialUIImports';
import TransactionForm from './TransactionForm';

export default function ChatAttachment() {
    const [anchorEl, setAnchorEl] = useState(null);

    function handleClick(event) {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    }

    const open = Boolean(anchorEl);

    return (
        <button onClick={handleClick}>
            <FontAwesomeIcon icon={faPlusCircle}/>
            <Popper open={open} anchorEl={anchorEl} placement='top-start'>
                <TransactionForm/>
            </Popper>
        </button>
    )
}
