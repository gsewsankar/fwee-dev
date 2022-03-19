import React from 'react';
import './ItemCard.css';
import Loading from '../components/Loading';
import ArtCard from './all_cards/ArtCard';
import AudioCard from './all_cards/AudioCard';
import ImageCard from './all_cards/ImageCard';
import LinkCard from './all_cards/LinkCard';
import ThoughtCard from './all_cards/ThoughtCard';
import VideoCard from './all_cards/VideoCard';

import {db} from '../firebaseInitialize';
import { doc } from "firebase/firestore";

import { useDocumentData } from 'react-firebase-hooks/firestore';

function ItemCard(props){
    const[itemData, itemLoading] = useDocumentData(doc(db,'items',props.itemID));

    if(itemLoading){
      return(<div className='card'><Loading/></div>);
    }

    if(itemData&&itemData.category === 'art'){
      return(<ArtCard itemID={props.itemID}/>);
    }

    if(itemData&&itemData.category === 'audio'){
      return(<AudioCard itemID={props.itemID}/>);
    }
    
    if(itemData&&itemData.category === 'image'){
      return(<ImageCard itemID={props.itemID}/>);
    }

    if(itemData&&itemData.category === 'link'){
      return(<LinkCard itemID={props.itemID}/>);
    }

    if(itemData&&itemData.category === 'thought'){
      return(<ThoughtCard itemID={props.itemID}/>);
    }

    if(itemData&&itemData.category === 'video'){
      return(<VideoCard itemID={props.itemID}/>);
    }



    // if(itemData&&itemData.category === 'document'){
    //   category = faBook;
    //   cat_name = 'document';
    // }

    // if(itemData&&itemData.category === 'game'){
    //   category = faGamepad;
    //   cat_name = 'game';
    // }

    // if(itemData&&itemData.category === 'model'){
    //   category = faCube;
    //   cat_name = 'model';
    // }

    // if(itemData&&itemData.category === 'poll'){
    //   category = faPoll;
    //   cat_name = 'poll';
    // }

    return(<div className="card">card deleted</div>);
  }

export default ItemCard;