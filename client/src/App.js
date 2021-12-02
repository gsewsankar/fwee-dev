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
import CurrentBalance from './components/CurrentBalance';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import { useAuthState } from 'react-firebase-hooks/auth';
import SignUpPage from './containers/SignUpPage';

//v8
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';

//v9
import { auth } from './firebaseInitialize';

function App() {
  const [user] = useAuthState(auth);

  return (
    <Router basename={process.env.PUBLIC_URL}>
    <div className="App">
      <NavBar ></NavBar>
      <div className="App-header">
        <Switch>
          <Route exact path="/"><Home/></Route>
          <Route exact path="/join">{user ? <Redirect to="/"/> : <SignUpPage/>}</Route>
          <Route exact path={"/dashboard"}>{user ? <Dashboard/> : <Redirect to="/"/>}</Route>
          <Route exact path={"/leaders"}><Leaderboards/></Route>
          <Route exact path={"/dms"}>{user ? <DirectMessages/> : <Redirect to="/"/>}</Route>
          <Route exact path={"/settings"}>{user ? <Settings/> : <Redirect to="/"/>}</Route>
          <Route exact path={"/newItem"}>{user ? <NewItem/> : <Redirect to="/"/>}</Route>
          <Route exact path={"/item/:itemid"}>{user ? <ItemPage/> : <Redirect to="/"/>}</Route>
          <Route exact path={"/:username"}><Store/></Route>
          <Route><NotFound/></Route>
        </Switch>
        {user && <CurrentBalance/>}
      </div>
      {!user&&<div className="footer">
        <p>all rights reserved. about. privacy policy. tos.</p>
      </div>}
    </div>
    </Router>
  );
}

export default App;




