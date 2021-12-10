import React from 'react';
import './Notification.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart,faHeart } from '@fortawesome/free-solid-svg-icons';

function Notification(props){
    
    if(props.info.type==='buy'){
        return(
        <div className="notification-frame-green">
            <p><b>{props.info.buyer}</b> bought <b>{props.info.itemID}</b></p>
            <div className='icon-area'><FontAwesomeIcon icon={faShoppingCart}/> +{props.info.price}</div>
            <div className='time-area'> {props.info.time} </div>
        </div>
        )
    }

    if(props.info.type==='like'){
        return(
        <div className="notification-frame-pink">
            <p><b>{props.info.liker}</b> liked <b>{props.info.itemID}</b></p>
            <div className='icon-area'> <FontAwesomeIcon icon={faHeart}/></div>
            <div className='time-area'> {props.info.time} </div>
        </div>
        )
    }
  }

export default Notification;