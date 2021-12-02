import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from 'firebase/compat/app';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

let config = {
  apiKey: "AIzaSyAV52VYVKVpqnbASyHgFvJnKPHd-8jfihs",
  authDomain: "fwee.io",
  projectId: "time-73ed0",
  storageBucket: "time-73ed0.appspot.com",
  messagingSenderId: "197843951748",
  appId: "1:197843951748:web:89f156841de90efb95e2d1",
  measurementId: "G-LSKW49MNF1"
};

const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache()
});

firebase.initializeApp(config);

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
