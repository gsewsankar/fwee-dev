import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import fbconfig from './config';


//v8
import firebase from 'firebase/compat/app';

//v9
import './firebaseInitialize';

// import {
//   ApolloClient,
//   InMemoryCache,
//   ApolloProvider,
// } from "@apollo/client";

// const client = new ApolloClient({
//   uri: 'http://localhost:4000/',
//   cache: new InMemoryCache()
// });

firebase.initializeApp(fbconfig);

ReactDOM.render(
    <App />,document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
