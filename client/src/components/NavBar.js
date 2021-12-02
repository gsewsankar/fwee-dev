import React, { useState, useEffect } from 'react';
import './NavBar.css';
import Loading from './Loading';
import logo from '../assets/fweetxt.png';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

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
    const[recentlyBought, setRecentlyBought] = useState([]);

    useEffect(() => {
        async function fetchData(){
            const ref1 = (await db.collection("users").doc(user.uid).get()).data();
            setUsername(ref1.username);
            let names = [];
            for(let i = 0; i < ref1.supporting.length; i++){
                const person = (await db.collection('users').doc(ref1.supporting[i]).get()).data().username;
                names.push(person);
            }
            setSupporting(names);
            let items = [];
            for(let j = ref1.purchases.length - 1; j > 0; j--){
                const id = ref1.purchases[j];
                const title = (await db.collection('items').doc(ref1.purchases[j]).get()).data().title;
                items.push({id,title});
            }
            setRecentlyBought(items);
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
                    {supporting.map(name=>{return<Link key={name} to={'/'+ name} onClick={toggleSideBar}>{name}</Link>})}
                    <p><u>Recently Bought Items</u></p>
                    {recentlyBought.map((item)=>{return<Link key={item.id} to={'/item/'+ item.id} onClick={toggleSideBar}>{item.title}</Link>})}
                </div>}
                
                <div className="menu">
                    {user && <FontAwesomeIcon className="bars" icon={faBars} size="lg" onClick={toggleSideBar}/>}
                    <Link to="/"><img width="80" height="45" src={logo} alt={"logo"}></img></Link>
                </div>
                
                <div className='search'>
                    <input className="search" placeholder="Search"></input>
                    <button><FontAwesomeIcon icon={faSearch}/></button>
                </div>

                {user ? 
                (<Link to={`/${username}`}>
                <div className='right'>
                    <p>{user && user.displayName}</p>
                    {<img src={user && user.photoURL} alt={user && user.photoURL}></img>}
                </div>
                </Link>)  
                : <Link to="/join"><button>Login / SignUp</button></Link>}    
        </div>
    );
}

export default NavBar;