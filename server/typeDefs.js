const { gql } = require('apollo-server');

export const typeDefs = gql`
  type User {
    uid: String!
    displayName: String!
    photoURL: String!
    balance: Float!
    username: String!
    createdAt: String!
  }
  type Store {
    name: String!
    owner: String!
    items: [Item]!
    visitors: [User]!
    supporters: [User]!
  }
  type Item {
    id: ID!
    title: String!
    price: Float!
    description: String
    image: String!
    likes: [Like]!
    comments: [Comment]!
    buyers: [User]!
  }
  type Comment{
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }
  type Like{
    id: ID!
    createdAt: String!
    username: String!
  }
  type Query{
    getUsers: [User]
  }
  type Mutation{
    createItem: Item!
    deleteItem(itemId: ID!): String!
  }
`;