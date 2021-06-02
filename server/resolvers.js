import * as admin from 'firebase-admin';

export const resolvers = {
    Query: {
      async getUsers(){
        try{
          const usersRef = await admin.firestore().collection('users').get();

          return usersRef.docs.map(doc => doc.data());
        }
        catch(err){
          throw new Error(err);
        }
      }
    },
  };
