import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import Popper from '@mui/material/Popper';

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
                This is the first Popper!
            </Popper>
        </button>
    )
}
