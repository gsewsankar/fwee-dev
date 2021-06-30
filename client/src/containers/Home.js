import React from 'react';
import './Home.css';
//import ItemCard from '../components/ItemCard';
import Loading from '../components/Loading';
import logo from '../fwee_logo.svg';

import { Link } from "react-router-dom";

import firebase from 'firebase/app';
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

function Home(){

    const[user, isLoading] = useAuthState(firebase.auth());

    if(isLoading){
      return(<Loading/>)
    }
    
    function renderFeed(){ 
      return(
        <div>
          <h1>Feed</h1>
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
              <h3>Stop Losing Time Credits</h3>
              <p>start using, join now</p>
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