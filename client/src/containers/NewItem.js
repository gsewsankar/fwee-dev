import React, { useEffect, useState } from 'react';
import './NewItem.css';
import Loading from '../components/Loading';

import {db, auth, bucket} from '../firebaseInitialize';
import { doc, getDocs, collection, where, query, addDoc, updateDoc,arrayUnion, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, useParams } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faBook, faCamera, faCube, faGamepad, faHeadphonesAlt, faLightbulb, faLink, faPalette, faPoll, faVideo } from '@fortawesome/free-solid-svg-icons';


function NewItem(){

  const { category } = useParams();  
  
  const[user, isLoading] = useAuthState(auth);
    const[value, setValue] = useState(0);
    const[secondaryValue, setSecondaryValue] = useState(0);
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

    useEffect(()=>{
      if(category === undefined){
        setValue(0);
        setSecondaryValue(0);
      }
    },[category]);

    if(isLoading){
        return(<Loading/>);
    }

    if(category === undefined){
      return(
      <div className='new-item-container'>
        <h1>Select a Category</h1>
        <div className='new-item-category-list'>
          <Link to='./art' className='art'><FontAwesomeIcon icon={faPalette}/> Art</Link>
          <Link to='./audio' className='audio'><FontAwesomeIcon icon={faHeadphonesAlt}/> Audio</Link>
          <Link to='./image' className='image'><FontAwesomeIcon icon={faCamera}/> Image</Link>
          <Link to='./link' className='link'><FontAwesomeIcon icon={faLink}/> Link</Link>
          <Link to='./thought' className='thought'><FontAwesomeIcon icon={faLightbulb}/> Thought</Link>
          <Link to='./video' className='video'><FontAwesomeIcon icon={faVideo}/> Video</Link>
          <br></br>
        <h3>Coming Soon...</h3>
          <Link to='./document' className='document'><FontAwesomeIcon icon={faBook}/> Document</Link>
          <Link to='./game' className='game'><FontAwesomeIcon icon={faGamepad}/> Game</Link>
          <Link to='./model' className='model'><FontAwesomeIcon icon={faCube}/> 3D Model</Link>
          <Link to='./poll' className='poll'><FontAwesomeIcon icon={faPoll}/> Poll</Link>
        </div>
      </div>)
    }

    const handleChange = (e) => {
        updateFormData({
          ...formData,

          [e.target.name]: e.target.value.trim(),
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

    const uploadThumbnail = (e) => {
      const file = e.target.files[0];
      const storageRef = ref(bucket, user.uid + '/' + file.name);
      const upload = uploadBytesResumable(storageRef, file);
      upload.on('state_changed',
      function progress(snapshot){
          let percent = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
          setSecondaryValue(()=>percent)
      },
      function error(err){
      },
      async function complete(){
          updateFormData({
              ...formData,

              thumbnail: await getDownloadURL(storageRef)
            });
      }
    );  
  }

  const uploadAlbumArt = (e) => {
      const file = e.target.files[0];
      const storageRef = ref(bucket, user.uid + '/' + file.name);
      const upload = uploadBytesResumable(storageRef, file);
      upload.on('state_changed',
      function progress(snapshot){
          let percent = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
          setSecondaryValue(()=>percent)
      },
      function error(err){
      },
      async function complete(){
          updateFormData({
              ...formData,

              albumArt: await getDownloadURL(storageRef)
            });
      }
    );  
  }

    async function handleSubmit(e){
        e.preventDefault();
        let storeDoc;
        let itemID;
        formData.category = category;
        formData.price = Number(formData.price);

        if(value === 100 && formData.title !== ""){

          itemID = (await addDoc(collection(db,'items'),formData)).id;
          await updateDoc(doc(db,'items',itemID),{id:itemID});
  
          (await getDocs(query(collection(db,'stores'),where("owner","==",user.uid)))).docs.forEach((doc)=>{
            storeDoc = doc.id;
          });
          await updateDoc(doc(db,'stores',storeDoc),{
            items:arrayUnion(itemID)
          });
  
          setPath(itemID);
          setSuccess(true);
        }
        else{
          alert('invalid form data');
          console.log(formData);
        }
    }

    async function handleSubmitLink(e){
      e.preventDefault();
      let storeDoc;
      let itemID;
      formData.category = category;
      formData.price = Number(formData.price);
      formData.createdAt = serverTimestamp();
      formData.location = formData.url;
      formData.owner = user.uid;

      if(formData.title !== "" && formData.url !== ""){

        itemID = (await addDoc(collection(db,'items'),formData)).id;
        await updateDoc(doc(db,'items',itemID),{id:itemID});

        (await getDocs(query(collection(db,'stores'),where("owner","==",user.uid)))).docs.forEach((doc)=>{
          storeDoc = doc.id;
        });
        await updateDoc(doc(db,'stores',storeDoc),{
          items:arrayUnion(itemID)
        });

        setPath(itemID);
        setSuccess(true);
      }
      else{
        alert('invalid form data');
        console.log(formData);
      }
    }

    async function handleSubmitThought(e){
      e.preventDefault();
      let storeDoc;
      let itemID;
      formData.category = category;
      formData.price = Number(formData.price);
      formData.createdAt = serverTimestamp();
      formData.owner = user.uid;

      if(formData.title !== "" && formData.thought !== ""){

        itemID = (await addDoc(collection(db,'items'),formData)).id;
        await updateDoc(doc(db,'items',itemID),{id:itemID});

        (await getDocs(query(collection(db,'stores'),where("owner","==",user.uid)))).docs.forEach((doc)=>{
          storeDoc = doc.id;
        });
        await updateDoc(doc(db,'stores',storeDoc),{
          items:arrayUnion(itemID)
        });

        setPath(itemID);
        setSuccess(true);
      }
      else{
        alert('invalid form data');
        console.log(formData);
      }
    }

    if(category === 'art'){
      return(
        <div className='new-item-container'>
          <h2>New Art <FontAwesomeIcon className='art' icon={faPalette}/></h2>
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

    if(category === 'audio'){
      return(
        <div className='new-item-container'>
          <h2>New Audio <FontAwesomeIcon className='audio' icon={faHeadphonesAlt}/></h2>
          <form>
          <div className="form-section"><label>Your Audio File</label><input type="file" accept="audio/*" onChange={uploadFile}/></div>
              <div><progress value={value} max='100'></progress> {value.toFixed(0)}%</div>
              <div className="form-section"><label>Album Art</label><input type="file" accept="image/*" onChange={uploadAlbumArt}/>
              {(secondaryValue >= 100) && <img src={formData.albumArt} alt='aa'/>}
              </div>
              <div><progress value={secondaryValue} max='100'></progress> {secondaryValue.toFixed(0)}%</div>
              <div className="form-section"><label>Title</label><input name="title" onChange={handleChange} type="text" placeholder="Name your item"/></div>
              <div className="form-section"><label>Price</label><input name="price" onChange={handleChange} type="number" min={0.00} step={0.01} placeholder="0.00"/></div>
              <div className="form-section"><label>Description</label><input name="description" onChange={handleChange} type="text" placeholder="#Hashtags @Friends"/></div>
              {success && <div> Posted Successfully! <Link to={`/item/${path}`}><button>VIEW NEW ITEM</button></Link></div>}
              {!success && <div className="form-section"><button onClick={handleSubmit}>Post</button></div>}
          </form>
        </div>
      )
    }

    if(category === 'image'){
      return(
        <div className='new-item-container'>
          <h2>New Image <FontAwesomeIcon icon={faCamera}/></h2>
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

    if(category === 'link'){
      return(
        <div className='new-item-container'>
          <h2>New Link <FontAwesomeIcon className='link' icon={faLink}/></h2>
          <form>
              <div className='form-section'><label>URL</label><input name='url' onChange={handleChange} type="url" placeholder="https://example.com" pattern="https://.*" size="30" required></input></div>
              <div className="form-section"><label>Title</label><input name="title" onChange={handleChange} type="text" placeholder="Name your item"/></div>
              <div className="form-section"><label>Price</label><input name="price" onChange={handleChange} type="number" min={0.00} step={0.01} placeholder="0.00"/></div>
              <div className="form-section"><label>Description</label><input name="description" onChange={handleChange} type="text" placeholder="#Hashtags @Friends"/></div>
              {success && <div> Posted Successfully! <Link to={`/item/${path}`}><button>VIEW NEW ITEM</button></Link></div>}
              {!success && <div className="form-section"><button onClick={handleSubmitLink}>Post</button></div>}
          </form>
        </div>
      )
    }

    if(category === 'thought'){
      return(
        <div className='new-item-container'>
          <h2>New Thought <FontAwesomeIcon className='thought' icon={faLightbulb}/></h2>
          <form>
              <div className='form-section'><label>Thought</label><textarea className='thought-input' name='thought' placeholder='1000 characters' onChange={handleChange} maxLength={1000}></textarea></div>
              <div className="form-section"><label>Title</label><input name="title" onChange={handleChange} type="text" placeholder="Name your item"/></div>
              <div className="form-section"><label>Price</label><input name="price" onChange={handleChange} type="number" min={0.00} step={0.01} placeholder="0.00"/></div>
              <div className="form-section"><label>Description</label><input name="description" onChange={handleChange} type="text" placeholder="#Hashtags @Friends"/></div>
              {success && <div> Posted Successfully! <Link to={`/item/${path}`}><button>VIEW NEW ITEM</button></Link></div>}
              {!success && <div className="form-section"><button onClick={handleSubmitThought}>Post</button></div>}
          </form>
        </div>
      )
    }

    if(category === 'video'){
      return(
        <div className='new-item-container'>
          <h2>New Video <FontAwesomeIcon className='video' icon={faVideo}/></h2>
          <form>
          <div className="form-section"><label>Select Video File</label><input type="file" accept="video/*" onChange={uploadFile}/></div>
          <div><progress value={value} max='100'></progress> {value.toFixed(0)}%</div>
          <div className="form-section"><label>Custom Thumbnail</label><input type="file" accept="image/*" onChange={uploadThumbnail}/>
          {(secondaryValue >= 100) && <img src={formData.thumbnail} alt='thmbnl'/>}
          </div>
          <div><progress value={secondaryValue} max='100'></progress> {secondaryValue.toFixed(0)}%</div>
          <div className="form-section"><label>Title</label><input name="title" onChange={handleChange} type="text" placeholder="Name your item"/></div>
          <div className="form-section"><label>Price</label><input name="price" onChange={handleChange} type="number" min={0.00} step={0.01} placeholder="0.00"/></div>
          <div className="form-section"><label>Description</label><input name="description" onChange={handleChange} type="text" placeholder="#Hashtags @Friends"/></div>
          {success && <div> Posted Successfully! <Link to={`/item/${path}`}><button>VIEW NEW ITEM</button></Link></div>}
          {!success && <div className="form-section"><button onClick={handleSubmit}>Post</button></div>}
          </form>
        </div>
      )
    }

    if(category === 'document'){
      return(
        <div className='new-item-container'>
          <h1>Coming Soon</h1>
          <h2>New Document <FontAwesomeIcon className='document' icon={faBook}/></h2>
          {/* <form>
          <div className="form-section"><input type="file" accept="application/*" onChange={uploadFile}/></div>
              <div><progress value={value} max='100'></progress> {value.toFixed(0)}%</div>
              <div className="form-section"><label>Title</label><input name="title" onChange={handleChange} type="text" placeholder="Name your item"/></div>
              <div className="form-section"><label>Price</label><input name="price" onChange={handleChange} type="number" min={0.00} step={0.01} placeholder="0.00"/></div>
              <div className="form-section"><label>Description</label><input name="description" onChange={handleChange} type="text" placeholder="#Hashtags @Friends"/></div>
              {success && <div> Posted Successfully! <Link to={`/item/${path}`}><button>VIEW NEW ITEM</button></Link></div>}
              {!success && <div className="form-section"><button onClick={handleSubmit}>Post</button></div>}
          </form> */}
        </div>
      )
    }

    if(category === 'game'){
      return(
        <div className='new-item-container'>
          <h1>Coming Soon</h1>
          <h2>New Game <FontAwesomeIcon className='game' icon={faGamepad}/></h2>
        </div>
      )
    }

    if(category === 'model'){
      return(
        <div className='new-item-container'>
          <h1>Coming Soon</h1>
          <h2>New 3D Model <FontAwesomeIcon className='model' icon={faCube}/></h2>
        </div>
      )
    }

    if(category === 'poll'){
      return(
        <div className='new-item-container'>
          <h1>Coming Soon</h1>
          <h2>New Poll <FontAwesomeIcon className='poll' icon={faPoll}/></h2>
        </div>
      )
    }

    return(
      <div className='new-item-container'>
          <h2>New Item</h2>
          <form>
          <div className="form-section"><input type="file" onChange={uploadFile}/></div>
              <div><progress value={value} max='100'></progress> {value.toFixed(0)}%</div>
              <div className="form-section"><label>Title</label><input name="title" onChange={handleChange} type="text" placeholder="Name your item"/></div>
              <div className="form-section"><label>Price</label><input name="price" onChange={handleChange} type="number" min={0.00} step={0.01} placeholder="0.00"/></div>
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
              {success && <div> Posted Successfully! <Link to={`/item/${path}`}><button>VIEW NEW ITEM</button></Link></div>}
              {!success && <div className="form-section"><button onClick={handleSubmit}>Post</button></div>}
          </form>
      </div>
    )
  }

export default NewItem;