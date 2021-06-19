import React, { useState } from 'react';
import './NewItem.css';
import Loading from '../components/Loading';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link } from "react-router-dom";

function NewItem(){

    const bucket = firebase.storage();
    const db = firebase.firestore();
    const[user, isLoading] = useAuthState(firebase.auth());
    const[value, setValue] = useState(0);
    const[success, setSuccess] = useState(false);
    const initialFormData = Object.freeze({
        id: "",
        title: "",
        createdAt:null,
        price: 0.00,
        description: "",
        location:"",
        category:"",
        likes: [],
        comments: [],
        buyers: [],
        owner:"",
      });

    const [formData, updateFormData] = useState(initialFormData);

    if(isLoading){
        return(<Loading/>);
    }

    const handleChange = (e) => {
        updateFormData({
          ...formData,

          [e.target.name]: e.target.value.trim()
        });
      };

    const uploadFile = (e) => {
        const file = e.target.files[0];
        const storageRef = bucket.ref(user.uid + '/' + file.name);
        const upload = storageRef.put(file);
        upload.on('state_changed',
        function progress(snapshot){
            let percent = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
            setValue(()=>percent)
        },
        function error(err){
        },
        function complete(){
            updateFormData({
                ...formData,
      
                location: user.uid + '/' + file.name.trim(),
                filename:file.name.trim(),
                owner:user.uid,
                createdAt:firebase.firestore.FieldValue.serverTimestamp(),
              });
        }
      );  
    }

    let storeDoc;
    let itemID;

    async function handleSubmit(e){
        e.preventDefault();

        itemID = (await db.collection('items').add(formData)).id;
        
        db.collection('items').doc(itemID).update({id:itemID});

        (await db.collection('stores').where("owner","==",user.uid).get()).docs.forEach((doc)=>{
          storeDoc = doc.id
        });

        db.collection('stores').doc(storeDoc).update({
          items:firebase.firestore.FieldValue.arrayUnion(itemID)
        });

        setSuccess(true);
    }

    return(
      <div>
          <h2>New Item</h2>
          <form>
          <div className="form-section"><input type="file" onChange={uploadFile}/></div>
              <div><progress value={value} max='100'></progress> {value}%</div>
              <div className="form-section"><label>Title</label><input name="title" onChange={handleChange} type="text" placeholder="Name your item"/></div>
              <div className="form-section"><label>Price</label><input name="price" onChange={handleChange} type="text" placeholder="0.00"/></div>
              <div className="form-section"><label>Description</label><input name="description" onChange={handleChange} type="text" placeholder="#Hashtags @Friends"/></div>
                <div className="form-section">
                <label>Category</label>
                <select onChange={handleChange} name="category" id="category">
                <option value=''>Select a Category</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="music">Music</option>
                <option value="art">Art</option>
                <option value="story">Story/Fanfiction</option>
                <option value="model">3D Model</option>
                <option value="game">Game</option>
                <option value="link">Link</option>
                </select>
                </div>
                <div className="form-section"><button onClick={handleSubmit}>Post</button></div>
                {success && <div> Posted Successfully! <Link to={`/store/${user.uid}`}><button>VIEW NEW ITEM</button></Link></div>}
          </form>
      </div>
    )
  }

export default NewItem;