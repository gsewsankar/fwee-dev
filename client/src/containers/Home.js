import React, { useEffect, useState } from 'react';
import './Home.css';
import ItemCard from '../components/ItemCard';
import Loading from '../components/Loading';
import logo from '../fwee_logo.svg';

import { Link } from "react-router-dom";

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

function Home(){

    const[user, isLoading] = useAuthState(firebase.auth());
    const[feed,setFeed] = useState([])
    const db = firebase.firestore();

    useEffect(()=>{
      async function fetchData(){
        let q1 = (await db.collection('users').doc(user.uid).get()).data().purchases;
        let q2 = (await db.collection('items').where('id','not-in',q1).limit(10).get()).docs;
        setFeed(q2);
      }

      user && fetchData();

    },[db,user]);

    if(isLoading){
      return(<Loading/>)
    }
    
    function renderFeed(){ 
      return(
        <div>
          <h1>Feed</h1>
          {feed.map(item=>{return <ItemCard key={item.id} itemID={item.id}/>})}
        </div>
      )
    }

    function renderLander(){ 
      return(
        <div>
          <div>
          <img src={logo} alt="My logo" width="640" height="360"/>
          <p>It's a Free World</p>
          <Link to="/leaders"><button>See Leaders</button></Link>
          <h3>You get 0.01 time credits every minute for the rest of your life.</h3>
              <p>How will you spend your time?</p>
          </div>

          <div className="section">
              <h3>Design Your Store</h3>
              <p>cool custom looking store picture</p>
          </div>

          <div className="section">
              <h3>Upload Your Content</h3>
                    Image
                    Video
                    Music
                    Art
                    Story/Fanfiction
                    3D Model
                    Game
                    Link
          </div>

          <div className="section">
              <h3>Set Your Prices</h3>
              <p>money is a means of exchange</p>
          </div>

          <div className="section">
              <h3>Unlock and Discover New Content</h3>
              <p>amazing 3d looking and artistic unlocking animation</p>
          </div>

          <div className="section">
              <h3>Get Recognition on the Leaderboards</h3>
              <p>people who gain the most support from the community will get on the leaderboards</p>
          </div>

          <div className="section">
              <h3>Stop Wasting Time</h3>
              <p>start using it, join now</p>
          </div>

          <div className="section">
              <h3>Footer</h3>
              <p>all rights reserved. about. privacy policy. tos.</p>
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