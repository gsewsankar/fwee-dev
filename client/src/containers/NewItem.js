import React, { useState } from 'react';
import './NewItem.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';

function NewItem(){

    const bucket = firebase.storage();
    const[user, isLoading] = useAuthState(firebase.auth());
    const[value, setValue] = useState(0);
    const initialFormData = Object.freeze({
        id: "",
        title: "",
        price: 0.00,
        description: "",
        location:"",
        category:"",
        likes: null,
        comments: null,
        buyers: null
      });

    const [formData, updateFormData] = useState(initialFormData);

    if(isLoading){
        return(<div>Loading...</div>);
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
      
                location: user.uid + '/' + file.name.trim()
              });
        }
      );  
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    }

    return(
      <div>
          <h1>New Item</h1>
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
          </form>
      </div>
    )
  }

export default NewItem;