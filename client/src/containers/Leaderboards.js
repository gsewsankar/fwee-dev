import React from 'react';
import './Leaderboards.css';
import Loading from '../components/Loading';

import firebase from 'firebase/app';
import 'firebase/firestore';

import { useCollectionData } from 'react-firebase-hooks/firestore';

function Leaderboards(){

  const db = firebase.firestore();
  const[data,dataLoading] = useCollectionData(db.collection('users').orderBy('balance','desc').limit(10));
  let count = 1;

  if(dataLoading){
    return(<Loading/>);
  }

    return(
      <div>
          <h1>Leaderboards</h1>
          <table>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Score</th>
            </tr>
            {data.map(person=>{return<tr><td>{count++}</td><td>{person.displayName}</td><td>{person.balance}</td> </tr>})}
          </table>
      </div>
    )
  }

export default Leaderboards;