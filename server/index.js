import * as admin from 'firebase-admin';
import {typeDefs} from "./typeDefs";
import {resolvers} from "./resolvers";
import { ApolloServer, ApolloError, ValidationError, gql } from 'apollo-server';
import serviceAccount from "./service_account.json";

const startServer = async() => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  const server = new ApolloServer({ typeDefs, resolvers });

  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
}

startServer();
  