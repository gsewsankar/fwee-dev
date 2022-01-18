import * as admin from 'firebase-admin';
import {typeDefs} from "./typeDefs";
import {resolvers} from "./resolvers";
import { ApolloServer, ApolloError, ValidationError, gql } from 'apollo-server';
//import serviceAccount from "./service_account.json";
const express = require('express')
const GunServer = require('gun')
const expressApp= express()
expressApp.use(GunServer.serve) 

/*const startServer = async() => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  const server = new ApolloServer({ typeDefs, resolvers });

  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
}

startServer();*/

//TODO: replace this port later with a hosted server
const server = expressApp.listen(1900, () => {
console.log("Gun server connection established")
})



GunServer({web: server});