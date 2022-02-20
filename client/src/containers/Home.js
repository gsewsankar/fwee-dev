//UPDATED to v9 on 12-8-2021

import React, { useEffect, useState } from 'react';
import './Home.css';
import Loading from '../components/Loading';
import logo from '../assets/fweelogotext.svg';

import { Link } from "react-router-dom";

import {db, auth} from '../firebaseInitialize';
import { getDocs, query, orderBy, limit, collection } from "firebase/firestore";

import { useAuthState } from 'react-firebase-hooks/auth';
import LockedItem from '../components/LockedItem';

import { JackInTheBox } from "react-awesome-reveal";

function Home(){
    const[user, isLoading] = useAuthState(auth);
    const[feed,setFeed] = useState([]);

    useEffect(()=>{
      async function fetchData(){
        let getFeed = (await getDocs(query(collection(db,'items'),orderBy('createdAt', 'desc'),limit(30)))).docs;
        setFeed(getFeed);
      }

      user && fetchData();

    },[user]);

    if(isLoading){
      return(<Loading/>)
    }
    
    function renderFeed(){ 
      return(
        <div>
          <div className='cards'>
          {feed.map(item=>{return<LockedItem key={item.id} itemID={item.id}/>})}
          </div>
        </div>
      )
    }

    function renderLander(){ 
      return(
        <div className="lander">
          <div className="top-section">
            <JackInTheBox><img className="logo" src={logo} alt="My logo" width="800" height="auto"/></JackInTheBox>
            <div className='learnjoin'>
            <Link to="/about"><button>Learn More</button></Link>
            <Link to="/join"><button>Join Now</button></Link>
            </div>
          </div>
        </div>
      )
    }

    return(
      <div>
      {user ? renderFeed() : renderLander()}
      </div>
    );

  }

export default Home;