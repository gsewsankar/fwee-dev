import React, { useEffect, useState } from 'react';
import './Home.css';
import Loading from '../components/Loading';
import logo from '../assets/fwee_logo.svg';
import store from '../assets/store.svg';
import crown from '../assets/crown.svg';
import items from '../assets/items.png';
import jar from '../assets/coins.gif';

import { Link } from "react-router-dom";

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import LockedItem from '../components/LockedItem';

function Home(){
    const[user, isLoading] = useAuthState(firebase.auth());
    const[feed,setFeed] = useState([])
    const db = firebase.firestore();

    useEffect(()=>{
      async function fetchData(){
        let query = (await db.collection('items').orderBy('createdAt', 'desc').limit(10).get()).docs;
        setFeed(query);
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
          {feed.map(item=>{return<LockedItem key={item.id} itemID={item.id}/>})}
        </div>
      )
    }

    function renderLander(){ 
      return(
        <div className="lander">
          <img className="logo" src={logo} alt="My logo" width="1000" height="auto"/>
          <h3>A Gamified Social Media Marketplace with its own Digital Currency</h3>
          <p>It's a Free World (BETA)</p>
          <Link to="/join"><button>Join Now</button></Link>

          <div className="divider"></div>
          
          <div className="section">
            <div className="left">
              <h3>You get 0.01 time credits every minute for the rest of your life.</h3>
                  <p>How will you spend your time?</p>
            </div>
            <div className="section-right">
              <img className="l" src={jar} alt="jar" height="350px" width="auto"/>
            </div>
          </div>

          <div className="divider"></div>
          
          <div className="section">
              <h3>Design Your Store</h3>
              <img className="l" src={store} alt="store"/>
              {/* <p>cool custom looking store picture</p> */}
          </div>

          <div className="divider"></div>

          <div className="section">
              <h3>Upload Your Content</h3>
              <img className="items" src={items} alt="items"/>
                    {/* Image
                    Video
                    Music
                    Art
                    Story/Fanfiction
                    3D Model
                    Game
                    Link */}
          </div>

          <div className="divider"></div>

          <div className="section">
              <h3>Set Your Prices</h3>
              <p>the digital currency is a means of exchange, it is not "real"</p>
              <p>the value of the currency is determined by what people are willing to spend on items</p>
              <button>How it Works</button>
          </div>

          <div className="divider"></div>
       

          <div className="section">
              <h3>Unlock and Discover New Content</h3>
              <LockedItem key={"Fmgry5btsv6tt8r9G0Ak"} itemID={"Fmgry5btsv6tt8r9G0Ak"}/>
          </div>

          <div className="divider"></div>

          <div className="section">
              <h3>Get Recognition on the Leaderboards</h3>
              <img className="l" src={crown} alt="crown"/>
              {/* <p>people who gain the most support from the community will get on the leaderboards</p> */}
              <Link to="/leaders"><button>See Leaders</button></Link>
          </div>

          <div className="divider"></div>

          <div className="section">
              <h3>Stop Wasting Time</h3>
              <p>start using it,</p>
              <Link to="/join"><button>Join Now</button></Link>
          </div>

          <div className="divider"></div>
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