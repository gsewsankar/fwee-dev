//UPDATED to V9 on 12/2/2021

import React, { useState, useEffect } from 'react';
import './NavBar.css';
import logo from '../assets/fweetxt.png';

import {auth, db} from '../firebaseInitialize';

import { doc, getDoc } from "firebase/firestore";

import { useAuthState } from 'react-firebase-hooks/auth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faTimes, faEnvelope, faIdCard, faTrophy, faCog, faDiceD20, faExchangeAlt, faUpload } from '@fortawesome/free-solid-svg-icons';

import { Link } from "react-router-dom";

function NavBar(){
    const[user, loading] = useAuthState(auth);

    const[sidebar, setSidebar] = useState(false);
    const toggleSideBar = () => {setSidebar(!sidebar)}
    const[username, setUsername] = useState("username");
    const[supporting, setSupporting] = useState([]);
    const[recentlyBought, setRecentlyBought] = useState([]);

    useEffect(() => {
        async function fetchData(){
            //gets current user's username
            const ref1 = (await getDoc(doc(db, "users", user.uid))).data();
            setUsername(ref1&&ref1.username);
            
            //SIDEBAR get usernames of users that the current user supports
            let names = [];
            for(let i = 0; i < (ref1&&ref1.supporting.length); i++){
                const person = (await getDoc(doc(db, "users", ref1&&ref1.supporting[i]))).data().username;
                names.push(person);
            }
            setSupporting(names);
            
            //SIDEBAR gets the most recently bought items
            let items = [];
            for(let j = ref1&&ref1.purchases.length - 1; j >= 0; j--){
                const id = ref1&&ref1.purchases[j];
                const title = (await getDoc(doc(db, "items", ref1&&ref1.purchases[j]))).data().title;
                items.push({id,title});
            }
            setRecentlyBought(items);
        }
        
        user && fetchData();

      },[username,user])

    
    if(loading){
        return(<div className='nav-frame'/>);
    }

    return(
        <div className="nav-frame">
                {user && 
                <div className={sidebar ? "side-menu-on" : "side-menu-off"} >
                    <button onClick={toggleSideBar}><FontAwesomeIcon icon={faTimes}/></button>
                    <Link to="/dms" onClick={toggleSideBar}><FontAwesomeIcon icon={faEnvelope}/> Messages + <FontAwesomeIcon icon={faExchangeAlt}/> Transfers</Link>
                    <Link to="/dashboard" onClick={toggleSideBar}><FontAwesomeIcon icon={faIdCard}/> Dashboard</Link>
                    <Link to="/leaders" onClick={toggleSideBar}><FontAwesomeIcon icon={faTrophy}/> Leaderboards</Link>
                    <Link to="/settings" onClick={toggleSideBar}><FontAwesomeIcon icon={faCog}/> Account Settings</Link>
                    <Link to="/messageChain" onClick={toggleSideBar}><FontAwesomeIcon icon={faDiceD20}/> Fwee Main Chain</Link>
                    <p><b>Stores You Support</b></p>
                    {supporting.map(name=>{return<Link key={name} to={'/'+ name} onClick={toggleSideBar}>{name}</Link>})}
                    <p><b>Recently Bought Items</b></p>
                    {recentlyBought.map((item)=>{return<Link key={item.id} to={'/item/'+ item.id} onClick={toggleSideBar}>{item.title}</Link>})}
                </div>}
                
                <div className="left">
                    {user && <FontAwesomeIcon className="bars" icon={faBars} size="lg" onClick={toggleSideBar}/>}
                    <Link to="/"><img width="80" height="45" src={logo} alt={"logo"}></img></Link>
                </div>
                
                <div className='search'>
                    <input className="search" placeholder="Search"></input>
                    <button><FontAwesomeIcon icon={faSearch}/></button>
                </div>

                {user&&<Link to="/newItem"><button>New <FontAwesomeIcon icon={faUpload}/></button></Link>}

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