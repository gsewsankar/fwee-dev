//UPDATED to v9 on 12-8-2021

import React, { useEffect, useState } from 'react';
import './Home.css';
import Loading from '../components/Loading';
import logo from '../assets/fweelogotext.svg';

import { Link } from "react-router-dom";

import {db, auth} from '../firebaseInitialize';
import { getDocs, query, orderBy, limit, collection, startAfter } from "firebase/firestore";

import { useAuthState } from 'react-firebase-hooks/auth';
import LockedItem from '../components/LockedItem';

import { JackInTheBox } from "react-awesome-reveal";

function Home(){
    const[user, isLoading] = useAuthState(auth);

    const[feed,setFeed] = useState([]);
    const[latestDoc, setLatestDoc] = useState(null);
    const [nextPosts_loading, setNextPostsLoading] = useState(false);

    useEffect(()=>{
      async function fetchData(){
        let firstBatch = (await getDocs(query(collection(db,'items'),orderBy('createdAt', 'desc'),limit(30))));
        setFeed(firstBatch.docs);
        setLatestDoc(firstBatch.docs[firstBatch.docs.length - 1]);
      }

      user && fetchData();
    },[user]);

    async function loadMore(){
      setNextPostsLoading(true);  
      let nextBatch = (await getDocs(query(collection(db,'items'),orderBy('createdAt', 'desc'),startAfter(latestDoc),limit(30))));
      if(!nextBatch.empty){
        let temp = feed;
        nextBatch.docs.forEach(doc => {
          temp.push(doc);
        });
        setFeed(temp);
        setLatestDoc(nextBatch.docs[nextBatch.docs.length - 1]);
        setNextPostsLoading(false);
      }
      else{
        console.log("error loading next batch");
        setNextPostsLoading(false);
      }
    }

    if(isLoading){
      return(<Loading/>)
    }
    
    function renderFeed(){ 
      return(
        <div>
          <div className='cards'>
          {feed.map(item=>{return<LockedItem key={item.id} itemID={item.id}/>})}
          </div>
          {nextPosts_loading ? <Loading/> : <button onClick={()=>loadMore()}>Load More</button>}
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