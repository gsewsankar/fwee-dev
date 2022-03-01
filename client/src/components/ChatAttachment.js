import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Card, Popper } from '../MaterialUIImports';

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
                <Card>The content on a Card</Card>
            </Popper>
        </button>
    )
}
