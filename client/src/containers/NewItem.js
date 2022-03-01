//updated to v9 on 12-8-2021

import React, { useState } from 'react';
import './NewItem.css';
import Loading from '../components/Loading';

import {db, auth, bucket} from '../firebaseInitialize';
import { doc, getDocs, collection, where, query, addDoc, updateDoc,arrayUnion, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, useParams } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faBook, faCamera, faCube, faGamepad, faHeadphonesAlt, faLink, faVideo } from '@fortawesome/free-solid-svg-icons';


function NewItem(){

  const { category } = useParams();  
  
  const[user, isLoading] = useAuthState(auth);
    const[value, setValue] = useState(0);
    const[path,setPath]=useState("");
    const[success, setSuccess] = useState(false);
    const initialFormData = {
        id: "",
        title: "",
        createdAt:null,
        price: 0.00,
        description: "",
        location:"",
        category:category,
        buyers: [],
        owner:"",
    };

    const [formData, updateFormData] = useState(initialFormData);

    if(isLoading){
        return(<Loading/>);
    }

    if(category === undefined){
      return(
      <div className='new-item-container'>
        <h1>Select a Category</h1>
        <div className='new-item-category-list'>
          <Link to='./image'><FontAwesomeIcon icon={faCamera}/> Image</Link>
          <Link to='./video'><FontAwesomeIcon icon={faVideo}/> Video</Link>
          <Link to='./audio'><FontAwesomeIcon icon={faHeadphonesAlt}/> Audio</Link>
          <Link to='./document'><FontAwesomeIcon icon={faBook}/> Document</Link>
          <Link to='./link'><FontAwesomeIcon icon={faLink}/> Link</Link>
          <Link to='./model'><FontAwesomeIcon icon={faCube}/> Model</Link>
          <Link to='./game'><FontAwesomeIcon icon={faGamepad}/> Game</Link>
        </div>
      </div>)
    }

    const handleChange = (e) => {
        updateFormData({
          ...formData,

          [e.target.name]: e.target.value.trim(),
        });
        console.log(formData);
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

        if(formData.title === ""){
          alert('Title cannot be blank');
          return;
        }
        else{
          formData.category = category;
          formData.price = Number(formData.price);

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

    if(category === 'image'){
      return(
        <div>
          <h2>New Image</h2>
          <form>
          <div className="form-section"><input type="file" accept="image/*" onChange={uploadFile}/></div>
              <div><progress value={value} max='100'></progress> {value.toFixed(0)}%</div>
              <div className="form-section"><label>Title</label><input name="title" onChange={handleChange} type="text" placeholder="Name your item"/></div>
              <div className="form-section"><label>Price</label><input name="price" onChange={handleChange} type="number" min={0.00} step={0.01} placeholder="0.00"/></div>
              <div className="form-section"><label>Description</label><input name="description" onChange={handleChange} type="text" placeholder="#Hashtags @Friends"/></div>
              {success && <div> Posted Successfully! <Link to={`/item/${path}`}><button>VIEW NEW ITEM</button></Link></div>}
              {!success && <div className="form-section"><button onClick={handleSubmit}>Post</button></div>}
          </form>
        </div>
      )
    }

    return(
      <div>
          <h2>New Item</h2>
          <form>
          <div className="form-section"><input type="file" onChange={uploadFile}/></div>
              <div><progress value={value} max='100'></progress> {value.toFixed(0)}%</div>
              <div className="form-section"><label>Title</label><input name="title" onChange={handleChange} type="text" placeholder="Name your item"/></div>
              <div className="form-section"><label>Price</label><input name="price" onChange={handleChange} type="number" min={0.00} step={0.01} placeholder="0.00"/></div>
              <div className="form-section"><label>Description</label><input name="description" onChange={handleChange} type="text" placeholder="#Hashtags @Friends"/></div>
              {success && <div> Posted Successfully! <Link to={`/item/${path}`}><button>VIEW NEW ITEM</button></Link></div>}
              {!success && <div className="form-section"><button onClick={handleSubmit}>Post</button></div>}
          </form>
      </div>
    )
  }

export default NewItem;