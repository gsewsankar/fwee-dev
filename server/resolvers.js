import * as admin from 'firebase-admin';

export const resolvers = {
    Query: {
      async getUsers(){
          const usersRef = await admin.firestore().collection('users').get();
          return usersRef.docs.map(doc=>doc.data());
      },
      async getUser(_, {uid}){
          const userRef = await admin.firestore().collection('users').doc(uid).get();
          return userRef.data();
      },
      async getStore(_, {owner}){
          const storeRef = await admin.firestore().collection('stores').where("owner","==",owner).get();
          return storeRef.docs[0].data();
      },
    }
  };
