import React, { useState, useEffect } from 'react';
import './NavBar.css';
import SignIn from './SignIn';
import Loading from './Loading';
import logo from '../fwee_logo.svg';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faTimes, faEnvelope, faIdCard, faTrophy, faCog } from '@fortawesome/free-solid-svg-icons';

import { Link } from "react-router-dom";

function NavBar(){

    const[user, loading] = useAuthState(firebase.auth());
    const db = firebase.firestore();

    const[sidebar, setSidebar] = useState(false);
    const toggleSideBar = () => {setSidebar(!sidebar)}
    const[username, setUsername] = useState("username");
    const[supporting, setSupporting] = useState([]);

    useEffect(() => {
        async function fetchData(){
            const ref1 = (await db.collection("users").doc(user.uid).get()).data();
            setUsername(ref1.username);
            setSupporting(ref1.supporting);
        }
        user && fetchData();
      },[db,username,user])


    if(loading){
        return(<Loading/>);
    }

    return(
        <div className="nav-frame">
                {user && 
                <div className={sidebar ? "side-menu-on" : "side-menu-off"} >
                    <button onClick={toggleSideBar}><FontAwesomeIcon icon={faTimes}/></button>
                    <Link to="/dms" onClick={toggleSideBar}><FontAwesomeIcon icon={faEnvelope}/> Direct Messages</Link>
                    <Link to="/dashboard" onClick={toggleSideBar}><FontAwesomeIcon icon={faIdCard}/> Dashboard</Link>
                    <Link to="/leaders" onClick={toggleSideBar}><FontAwesomeIcon icon={faTrophy}/> Leaderboards</Link>
                    <Link to="/settings" onClick={toggleSideBar}><FontAwesomeIcon icon={faCog}/> Account Settings</Link>
                    <p>Stores You Support</p>
                    {supporting.map(userID=>{return<Link id={userID} onClick={toggleSideBar}>name</Link>})}
                    <p>Recently Bought Items</p>
                </div>}
                
                <div className="menu">
                    {user && <FontAwesomeIcon className="bars" icon={faBars} size="lg" onClick={toggleSideBar}/>}
                    <Link to="/"><img width="160" height="90" src={logo} alt={"logo"}></img></Link>
                </div>
                
                <div className='search'>
                    <input placeholder="Search"></input>
                    <button><FontAwesomeIcon icon={faSearch}/></button>
                </div>

                {user ? 
                (<Link to={`/${username}`}>
                <div className='right'>
                    <p>{user && user.displayName}</p>
                    {<img src={user && user.photoURL} alt={user && user.photoURL}></img>}
                </div>
                </Link>)  
                : <SignIn/>}    
        </div>
    );
}

export default NavBar;