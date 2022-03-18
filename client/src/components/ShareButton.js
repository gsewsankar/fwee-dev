import React from 'react';
import "./ShareButton.css";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import {
    EmailShareButton,
    FacebookShareButton,
    RedditShareButton,
    TwitterShareButton,
    EmailIcon,
    FacebookIcon,
    RedditIcon,
    TwitterIcon,
} from "react-share";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 10,
  p: 4,
};

const btnStyle = {
  borderRadius: 30
}

export default function ShareButton(props) {
  const [open, setOpen] = React.useState(false);
  const [copy, setCopy] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button className='share-btn' onClick={handleOpen}><FontAwesomeIcon icon={faShareAlt}/></Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Share
          </Typography>
          <FacebookShareButton  url={props.url} >
            <FacebookIcon style={btnStyle}/>
           </FacebookShareButton>
           <EmailShareButton url={props.url}>
               <EmailIcon style={btnStyle}/>
           </EmailShareButton>
           <RedditShareButton url={props.url}>
               <RedditIcon style={btnStyle}/>
           </RedditShareButton>
           <TwitterShareButton url={props.url}>
               <TwitterIcon style={btnStyle}/>
           </TwitterShareButton>
           <CopyToClipboard text={props.url}><button onClick={()=>setCopy(true)}>{copy ? <b>Copied!</b> : "Copy"}<br></br><br></br>{props.url}</button></CopyToClipboard>
        </Box>
      </Modal>
    </div>
  );
}