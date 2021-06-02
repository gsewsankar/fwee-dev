import React, { useState } from 'react';
import './NavBar.css'
import firebase from 'firebase/app';
import 'firebase/auth';
import SignIn from './SignIn';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faTimes, faEnvelope, faIdCard, faTrophy, faCog } from '@fortawesome/free-solid-svg-icons';

import {
    Link
  } from "react-router-dom";

function NavBar(){

    const auth = firebase.auth();
    const[user] = useAuthState(auth);
    const[sidebar, setSidebar] = useState(false);

    const toggleSideBar = () => {setSidebar(!sidebar)}

    const[w] = useState(window.screen.width);

    if(w < 414){
        return(

            <div className="nav-frame">
                    
                    <div className={sidebar ? "side-menu-on" : "side-menu-off"} >
                        <button onClick={toggleSideBar}><FontAwesomeIcon icon={faTimes}/></button>
                        <Link to="/dms" onClick={toggleSideBar}><FontAwesomeIcon icon={faEnvelope}/> Direct Messages</Link>
                        <Link to="/dashboard" onClick={toggleSideBar}><FontAwesomeIcon icon={faIdCard}/> Dashboard</Link>
                        <Link to="/leaders" onClick={toggleSideBar}><FontAwesomeIcon icon={faTrophy}/> Leaderboards</Link>
                        <Link to="/settings" onClick={toggleSideBar}><FontAwesomeIcon icon={faCog}/> Account Settings</Link>
                        <p>Stores You Support</p>
                        <p>Recently Bought</p>
                    </div>
                    
                    <div className="menu">
                    <FontAwesomeIcon icon={faBars} size="lg" onClick={toggleSideBar}/>
                        <Link to="/"><p>Free World Exchange</p></Link>
                    </div>
    
                    {user ? 
                    (<Link to={`/store/${user.uid}`}>
                    <div className='right'>
                        <p>{user && auth.currentUser.displayName}</p>
                        {<img src={user && auth.currentUser.photoURL} alt={user && auth.currentUser.photoURL}></img>}
                    </div>
                    </Link>)  
                    : <SignIn/>}
                      
            </div>
    
        );
    }

    return(

        <div className="nav-frame">
                
                <div className={sidebar ? "side-menu-on" : "side-menu-off"} >
                    <button onClick={toggleSideBar}><FontAwesomeIcon icon={faTimes}/></button>
                    <Link to="/dms" onClick={toggleSideBar}><FontAwesomeIcon icon={faEnvelope}/> Direct Messages</Link>
                    <Link to="/dashboard" onClick={toggleSideBar}><FontAwesomeIcon icon={faIdCard}/> Dashboard</Link>
                    <Link to="/leaders" onClick={toggleSideBar}><FontAwesomeIcon icon={faTrophy}/> Leaderboards</Link>
                    <Link to="/settings" onClick={toggleSideBar}><FontAwesomeIcon icon={faCog}/> Account Settings</Link>
                    <p>Stores You Support</p>
                    <p>Recently Bought Items</p>
                </div>
                
                <div className="menu">
                <FontAwesomeIcon icon={faBars} size="lg" onClick={toggleSideBar}/>
                    <Link to="/"><p>Free World Exchange</p></Link>
                </div>
                
                
                <div className='search'>
                    <input placeholder="Search"></input>
                    <button><FontAwesomeIcon icon={faSearch}/></button>
                </div>

                {user ? 
                (<Link to={`/store/${user.uid}`}>
                <div className='right'>
                    <p>{user && auth.currentUser.displayName}</p>
                    {<img src={user && auth.currentUser.photoURL} alt={user && auth.currentUser.photoURL}></img>}
                </div>
                </Link>)  
                : <SignIn/>}
                  
        </div>

    );
}

export default NavBar;