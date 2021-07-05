import React from 'react';
import './Leaderboards.css';
import Loading from '../components/Loading';

import firebase from 'firebase/app';
import 'firebase/firestore';

import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';

function Leaderboards(){
  console.log("loaded leaderboard")

  const db = firebase.firestore();
  const[data,dataLoading] = useCollectionDataOnce(db.collection('users').orderBy('balance','desc').limit(10));
  let count = 1;

  if(dataLoading){
    return(<Loading/>);
  }

    return(
      <div>
          <h1>Leaderboards</h1>
          <table>
            <tbody>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Score</th>
            </tr>
            {data.map(person=>{return<tr key={count}><td>{count++}</td><td>{person.displayName}</td><td>{person.balance}</td></tr>})}
            </tbody>
          </table>
      </div>
    )
  }

export default Leaderboards;