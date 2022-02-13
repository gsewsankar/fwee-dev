import React from 'react';
import './About.css';
import store from '../assets/store.svg';
import crown from '../assets/crown.svg';
import items from '../assets/items.png';
import jar from '../assets/coins.gif';

import { Link } from "react-router-dom";
import LockedItem from '../components/LockedItem';

function About(){

    return(
      <div>
          <div className="section">
            <div className="left">
              <h3>You get 0.01 time credits every minute for the rest of your life.</h3>  
            </div>
            <p>How will you spend your time?</p>
            <div className="section-right">
              <img className="l" src={jar} alt="jar" height="350px" width="auto"/>
            </div>
          </div>

          <div className="divider"></div>
          
          <div className="section">
              <h3>Design Your Store</h3>
              <img className="l" src={store} alt="store"/>
              <p>cool custom looking store picture</p>
          </div>

          <div className="divider"></div>

          <div className="section">
              <h3>Upload Your Content</h3>
              <img className="items" src={items} alt="items"/>
                    Image
                    Video
                    Music
                    Art
                    Story/Fanfiction
                    3D Model
                    Game
                    Link
          </div>

          <div className="divider"></div>

          <div className="section">
              <h3>Set Your Prices</h3>
              <p>the digital currency is a means of exchange, it is not "real"</p>
              <p>the value of the currency is determined by what people are willing to spend on items</p>
              <button>How it Works</button>
          </div>

          <div className="divider"></div>
       

          <div className="section">
              <h3>Unlock and Discover New Content</h3>
              <LockedItem key={"JuPfujTTL98hMzBmLm2h"} itemID={"JuPfujTTL98hMzBmLm2h"}/>
          </div>

          <div className="divider"></div>

          <div className="section">
              <h3>Get Recognition on the Leaderboards</h3>
              <img className="l" src={crown} alt="crown"/>
              <p>people who gain the most support from the community will get on the leaderboards</p>
              <Link to="/leaders"><button>See Leaders</button></Link>
          </div>

          <div className="divider"></div>

          <div className="section">
              <h3>Stop Wasting Time</h3>
              <p>start using it,</p>
              <Link to="/join"><button>Join Now</button></Link>
          </div>

          <div className="divider"></div>
      </div>
    )
  }

export default About;