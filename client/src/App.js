import React from 'react';
import './App.css';
import Dashboard from './containers/Dashboard';
import Store from './containers/Store';
import Home from './containers/Home';
import NavBar from './components/NavBar';
import NotFound from './containers/NotFound';
import Leaderboards from './containers/Leaderboards';
import DirectMessages from './containers/DirectMessages';
import Settings from './containers/Settings';
import NewItem from './containers/NewItem';
import ItemPage from './containers/ItemPage';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';

function App() {
  const auth = firebase.auth();
  const [user] = useAuthState(auth);

  return (
    <Router>
    <div className="App">
      <NavBar ></NavBar>
      <div className="App-header">
        <Switch>
          <Route exact path="/"><Home/></Route>
          <Route exact path={"/dashboard"}>{user ? <Dashboard/> : <Redirect to="/"/>}</Route>
          <Route exact path={"/leaders"}><Leaderboards/></Route>
          <Route exact path={"/dms"}>{user ? <DirectMessages/> : <Redirect to="/"/>}</Route>
          <Route exact path={"/settings"}>{user ? <Settings/> : <Redirect to="/"/>}</Route>
          <Route exact path={"/newItem"}>{user ? <NewItem/> : <Redirect to="/"/>}</Route>
          <Route exact path={"/item/:itemid"}>{user ? <ItemPage/> : <Redirect to="/"/>}</Route>
          <Route exact path={"/:username"}><Store/></Route>
          <Route><NotFound/></Route>
        </Switch>
      </div>
    </div>
    </Router>
  );
}

export default App;




