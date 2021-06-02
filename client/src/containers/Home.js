import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

function Home(){

    const[user, isLoading] = useAuthState(firebase.auth());

    if(isLoading){
      return(<div>Loading...</div>)
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
          <h1>Free World Exchange</h1>
          <p>It's a Free World</p>
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