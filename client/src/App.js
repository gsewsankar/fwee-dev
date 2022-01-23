import {useEffect,useReducer} from 'react'
import './App.css';
import Dashboard from './containers/Dashboard';
import MessageChain  from './containers/MessageChain'
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
import SignUpPage from './containers/SignUpPage';
import ReactDOM from 'react-dom';
import {MessageHandler} from './components/MessageHandler'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { auth } from './firebaseInitialize';
import { useAuthState } from 'react-firebase-hooks/auth';

function App() {
  const [user] = useAuthState(auth);

  return (

    <Router basename={process.env.PUBLIC_URL}>
    <div className="App">
    <MessageHandler display={false}/>

      <NavBar ></NavBar>
      <div className="App-header">

        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/join" element={user ? <Navigate to="/"/> : <SignUpPage/>}></Route>
          <Route path={"/dashboard"} element={user ? <Dashboard/> : <Navigate to="/"/>}></Route>
          <Route path={"/messageChain"} element={user ? <MessageChain/> : <Navigate to="/"/>}></Route>
          <Route path={"/leaders"} element={<Leaderboards/>}></Route>
          <Route path={"/dms"} element={user ? <DirectMessages/> : <Navigate to="/"/>}></Route>
          <Route path={"/settings"} element={user ? <Settings/> : <Navigate to="/"/>}></Route>
          <Route path={"/newItem"} element={user ? <NewItem/> : <Navigate to="/"/>}></Route>
          <Route path={"/item/:itemid"} element={user ? <ItemPage/> : <Navigate to="/"/>}></Route>
          <Route path={"/:username"} element={<Store/>}></Route>
          <Route element={<NotFound/>}></Route>
        </Routes>
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




