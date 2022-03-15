import { initializeApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from '@firebase/storage';
import Gun from "gun/gun";
import fbconfig from "./config";

const firebaseApp = initializeApp(fbconfig);

const auth = getAuth(firebaseApp); // For Authentication
const db = getFirestore(firebaseApp); // For Using Database
const bucket = getStorage(firebaseApp); // For Storage Bucket
const gun = Gun(); // For Using Decentralized Database

export {auth, db, bucket, gun};