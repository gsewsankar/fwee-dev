import React from 'react';
import './Home.css';
import ItemCard from '../components/ItemCard';
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
          <ItemCard itemID="P2HDKZnTiLXkZhyHDlPm"/>
        </div>
      )
    }

    function renderLander(){ 
      return(
        <div>
          <div>
          <img src={logo} alt="My logo" width="640" height="360"/>
          </div>
          <p>It's a Free World</p>
          <Link to="/leaders"><button>See Leaders</button></Link>
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