import './App.css';
import Dashboard from './containers/Dashboard';
import Store from './containers/Store';
import Home from './containers/Home';
import NavBar from './components/NavBar';
import NotFound from './containers/NotFound';
import Leaderboards from './containers/Leaderboards';
import DirectMessages from './containers/DirectMessages';
import Search from './containers/Search';
import Settings from './containers/Settings';
import NewItem from './containers/NewItem';
import ItemPage from './containers/ItemPage';
import CurrentBalance from './components/CurrentBalance';
import SignUpPage from './containers/SignUpPage';
import About from './containers/About';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { auth } from './firebaseInitialize';
import { useAuthState } from 'react-firebase-hooks/auth';
import Footer from './components/Footer';

function App() {
  const [user] = useAuthState(auth);

  return (
    <Router basename={process.env.PUBLIC_URL}>
    <div className="App">
      <NavBar ></NavBar>
      <div className="App-header">
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/about" element={<About/>}></Route>
          <Route path="/join" element={user ? <Navigate to="/"/> : <SignUpPage/>}></Route>
          <Route path={"/dashboard"} element={user ? <Dashboard/> : <Navigate to="/"/>}></Route>
          {/* <Route path={"/chain"} element={<MessageChain/>}></Route> */}
          <Route path={"/leaders"} element={<Leaderboards/>}></Route>
          <Route path={"/search"} element={<Search/>}></Route>
          <Route path={"/dms"} element={user ? <DirectMessages/> : <Navigate to="/"/>}></Route>
          <Route path={"/settings"} element={user ? <Settings/> : <Navigate to="/"/>}></Route>
          <Route path={"/newItem"} element={user ? <NewItem/> : <Navigate to="/"/>}></Route>
          <Route path={"/newItem/:category"} element={user ? <NewItem/> : <Navigate to="/"/>}></Route>
          <Route path={"/item/:itemid"} element={<ItemPage/>}></Route>
          <Route path={"/:username"} element={<Store/>}></Route>
          <Route element={<NotFound/>}></Route>
        </Routes>
        {user && <CurrentBalance/>}
      </div>
      {!user&&<Footer/>}
    </div>
    </Router>
  );
}

export default App;




