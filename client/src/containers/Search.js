import React, { useEffect, useState } from "react";
import LockedItem from '../components/LockedItem';
import './Search.css';

import { Link, useLocation } from "react-router-dom";
import { db } from "../firebaseInitialize";
import { collection, getDocs, query } from "firebase/firestore";

function Search(){
    const { search } = useLocation();
    let params = new URLSearchParams((search), [search]);
    let searchterm = params.get('q');
    const[selectedTab, setSelectedTab] = useState('items');
    const[itemResults, setItemResults] = useState([]);
    const[userResults, setUserResults] = useState([]);
    const[tagResults, setTagResults] = useState([]);

    useEffect(()=>{
        async function fetchData(){
            if(searchterm[0] === '@'){
                setSelectedTab('users');
            }

            if(searchterm[0] === '#'){
                setSelectedTab('tags');
            }
        }
        fetchData();
    },[searchterm]);

    useEffect(()=>{
        async function fetchResults(){
                let q1 = (await getDocs(query(collection(db,'items')))).docs;
                let dataarray = [];
                q1.forEach(doc => {dataarray.push(doc.data())});
                let resultsarr = [];
                dataarray.forEach(elem => {
                    if(elem.title.toLowerCase().includes(searchterm.toLowerCase()) || elem.description.includes(searchterm.toLowerCase())){
                        resultsarr.push(elem);
                    }
                });
                resultsarr = resultsarr.slice(0, 20);
                setItemResults(resultsarr);
            
                let q2 = (await getDocs(query(collection(db,'users')))).docs;
                let dataarray2 = [];
                q2.forEach(doc => {dataarray2.push(doc.data())});
                let resultsarr2 = [];
                dataarray2.forEach(elem => {
                    if(elem.username.toLowerCase().includes(searchterm.toLowerCase()) || elem.displayName.toLowerCase().includes(searchterm.toLowerCase())){
                        resultsarr2.push(elem);
                    }
                });
                resultsarr2 = resultsarr2.slice(0, 20);
                setUserResults(resultsarr2);
            
                let q3 = (await getDocs(query(collection(db,'items')))).docs;
                let dataarray3 = [];
                q3.forEach(doc => {dataarray3.push(doc.data())});
                let resultsarr3 = [];
                dataarray3.forEach(elem => {
                    if(elem.description.toLowerCase().includes(searchterm.toLowerCase())){
                        resultsarr3.push(elem);
                    }
                });
                resultsarr3 = resultsarr3.slice(0, 20);
                setTagResults(resultsarr3);
        }
        fetchResults();
    },[searchterm]);

    return(
        <div>
            <h1>Search "{searchterm}"</h1>
            <div className="search-tabs">
                <div className={(selectedTab === 'items') ? "tabname-selected" : "tabname"} onClick={()=>setSelectedTab('items')}>Items</div>
                <div className={(selectedTab === 'users') ? "tabname-selected" : "tabname"} onClick={()=>setSelectedTab('users')}>@Users</div>
                <div className={(selectedTab === 'tags') ? "tabname-selected" : "tabname"} onClick={()=>setSelectedTab('tags')}>#Tags</div>
            </div>
            
            <br/>

            {(selectedTab === 'items' && (itemResults.length === 0))&&<h3>No Results Found</h3>}
            {(selectedTab === 'items')&&<div className="cards">{itemResults.map(res=>{return(<LockedItem itemID={res.id}/>)})}</div>}
            
            {(selectedTab === 'users' && (userResults.length === 0))&&<h3>No Results Found</h3>}
            {(selectedTab === 'users')&&userResults.map(res=>{return(<Link className="search-user-result" to={'../' + res.username}><img src={res.photoURL} alt="pfp"/>{res.username}</Link>)})}

            {(selectedTab === 'tags' && (tagResults.length === 0))&&<h3>No Results Found</h3>}
            {(selectedTab === 'tags')&&<div className="cards">{tagResults.map(res=>{return(<LockedItem itemID={res.id}/>)})}</div>}

        </div>
    )
}

export default Search;