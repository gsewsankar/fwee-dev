//updated to v9 on 12-8-2021

import React, { useState } from 'react';
import './NewItem.css';
import Loading from '../components/Loading';

import {db, auth, bucket} from '../firebaseInitialize';
import { doc, getDocs, collection, where, query, addDoc, updateDoc,arrayUnion, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { useAuthState } from 'react-firebase-hooks/auth';
import { Link } from "react-router-dom";

function NewItem(){

    const[user, isLoading] = useAuthState(auth);
    const[value, setValue] = useState(0);
    const[path,setPath]=useState("");
    const[success, setSuccess] = useState(false);
    const initialFormData = Object.freeze({
        id: "",
        title: "",
        createdAt:null,
        price: 0.00,
        description: "",
        location:"",
        category:"",
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
        const storageRef = ref(bucket, user.uid + '/' + file.name);
        const upload = uploadBytesResumable(storageRef, file);
        upload.on('state_changed',
        function progress(snapshot){
            let percent = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
            setValue(()=>percent)
        },
        function error(err){
        },
        async function complete(){
            updateFormData({
                ...formData,
      
                location: await getDownloadURL(storageRef),
                filename:file.name.trim(),
                owner:user.uid,
                createdAt:serverTimestamp(),
              });
        }
      );  
    }

    let storeDoc;
    let itemID;

    async function handleSubmit(e){
        e.preventDefault();

        if(formData.title === "" || formData.category === ""){
          alert('Title or Category cannot be blank');
          return;
        }
        else{
          itemID = (await addDoc(collection(db,'items'),formData)).id;
        
          updateDoc(doc(db,'items',itemID),{id:itemID});
  
          (await getDocs(query(collection(db,'stores'),where("owner","==",user.uid)))).docs.forEach((doc)=>{
            storeDoc = doc.id
          });
  
          updateDoc(doc(db,'stores',storeDoc),{
            items:arrayUnion(itemID)
          });
  
          setPath(itemID);
          setSuccess(true);
        }
    }

    return(
      <div>
          <h2>New Item</h2>
          <form>
          <div className="form-section"><input type="file" onChange={uploadFile}/></div>
              <div><progress value={value} max='100'></progress> {value}%</div>
              <div className="form-section"><label>Title</label><input name="title" onChange={handleChange} type="text" placeholder="Name your item"/></div>
              <div className="form-section"><label>Price</label><input name="price" onChange={handleChange} type="number" step={0.01} placeholder="0.00"/></div>
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
                {success && <div> Posted Successfully! <Link to={`/item/${path}`}><button>VIEW NEW ITEM</button></Link></div>}
          </form>
      </div>
    )
  }

export default NewItem;