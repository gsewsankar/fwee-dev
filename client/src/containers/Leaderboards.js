//updated to v9 on 12-08-2021

import React from 'react';
import './Leaderboards.css';
import Loading from '../components/Loading';

import { Link } from "react-router-dom";

import {db} from '../firebaseInitialize';
import { query, collection, orderBy, limit } from "firebase/firestore";

import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';

function Leaderboards(){

  const[data,dataLoading] = useCollectionDataOnce(query(collection(db,'users'),orderBy('balance','desc'),limit(10)));
  let count = 1;

  if(dataLoading){
    return(<Loading/>);
  }

    return(
      <div className='leaderboard'>
          <h1>Leaderboards</h1>
          <table>
            <tbody>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Score</th>
            </tr>
            {data.map(person=>{return<tr key={count}><td>{count++}</td><td><Link to={"/"+person.username}>{person.displayName}</Link></td><td>{Number(person.balance).toFixed(2)}</td></tr>})}
            </tbody>
          </table>
      </div>
    )
  }

export default Leaderboards;