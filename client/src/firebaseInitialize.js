import { initializeApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from '@firebase/storage';
import fbconfig from "./config";

const firebaseApp = initializeApp(fbconfig);

const auth = getAuth(firebaseApp); // For Authentication
const db = getFirestore(firebaseApp); // For Using Database
const bucket = getStorage(firebaseApp); // For Storage Bucket

export {auth, db, bucket};