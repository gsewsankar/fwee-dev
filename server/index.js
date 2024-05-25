import admin from 'firebase-admin';
import typeDefs from "./typeDefs.js";
import resolvers from "./resolvers.js";
import { ApolloServer, ApolloError, ValidationError, gql } from 'apollo-server';
import serviceAccount from "./service_account.json" with {type:"json"};

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