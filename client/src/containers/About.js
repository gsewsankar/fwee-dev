import React from 'react';
import './About.css';
import store from '../assets/store.png';
import crown from '../assets/crown.svg';
import items from '../assets/items.mp4';
import jar from '../assets/jar.mp4';

import { Link } from "react-router-dom";
import LockedItem from '../components/LockedItem';
import Accordion from '../components/Accordion';
import { Fade, Zoom } from "react-awesome-reveal";

function About(){

  const accordionData = [
    {
      title: 'Why not use real money?',
      content: `Real Money is an oxymoron.`
    },
    {
      title: 'Is this decentralized?',
      content: `The currency is decentralized, the marketplace is centralized. Fwee acts as a
      mediator of individual data.`
    },
    {
      title: 'Who made this?',
      content: `In Garrick We Trust`
    }
  ];

    return(
      <div className='about-container'>
        
        <div className='section' id="top">
          <h1 className='gradient-text'>What is Fwee?</h1>
          <div className='content-row'>
          <Zoom><p className='content'>Fwee stands for the <b className='gradient-text'>Free World Exchange Experience</b>. It is a gamified social media 
            marketplace with its own digital currency backed by <b className='gradient-text'>time</b>.
            <br/><br/>Whenever you join, you'll get <b className='gradient-text'>0.01 credits</b> every minute for the rest of your life.
            <br/><br/>The idea is to allow you to collect your time and spend it however you want in the marketplace. How will you <b className='gradient-text'>spend your time</b>?</p></Zoom>
            <Fade><video src={jar} alt="jar" height="350px" width="auto" autoPlay loop/></Fade>
          </div>
        </div>
        

        <Fade>
        <div className='section' id="store-design">
          <h1 className='gradient-text'>Design Your Store</h1>
          <div className='content-row'>
          <Fade><img src={store} alt="store" height={500} width="auto"/></Fade>
          <Zoom><p className='content'>There's two ways to make credits in <b className='gradient-text'>fwee</b>; sit back and <b className='gradient-text'>relax</b>, or <b className='gradient-text'>contribute</b> to the market by selling items.
            <br/>
            <br/>
            We allow you to <b className='gradient-text'>design</b> and <b className='gradient-text'>customize</b> your own store where you can  
            virtually sell whatever you want.
          </p></Zoom>
          </div>
        </div>
        </Fade>

        <div className='section' id="upload-content">
          <h1 className='gradient-text'>Upload Your Content</h1>
          <div className='content-row'>
          <Zoom><p className='content'>There are currently 6 categories of items that fwee supports but we are <b className='gradient-text'>ever expanding</b>.
            <br/>
            <br/>
            As a platform fwee intends to <b className='gradient-text'>empower</b> and <b className='gradient-text'>inspire</b> creators with <b className='gradient-text'>limitless possiblilites </b>
            to spark their <b className='gradient-text'>creative productivity</b>.
          </p></Zoom>
          <video src={items} alt="items-video" height="auto" width="375px" autoPlay loop/>
          </div>
        </div>

        <div className='section' id="set-prices">
          <h1 className='gradient-text'>Set Your Prices</h1>
          <div className='content-row'>
          <Zoom><p className='content'>
            In fwee, your items belong to you. You set prices based on how much you <b className='gradient-text'>think</b> an item is <b className='gradient-text'>worth</b>.
            <br/>
            <br/>
            Credits are a <b className='gradient-text'>means of exchange</b> used to unlock and view items in the marketplace.
            <br/>
            <br/>
            The <b className='gradient-text'>value</b> of the <b className='gradient-text'>currency</b> is determined by what people are willing to spend on items.
            <br/>
            <br/>
            People <b className='gradient-text'>inherently</b> value items differently.
          </p></Zoom>
          <Fade><button>How it Works</button></Fade>
          </div>
        </div>

        <div className='section' id="discover-content">
          <h1 className='gradient-text'>Unlock and Discover New Content</h1>
          <div className='content-row'>
          <Zoom><p className='content'>
            A defining feature of fwee is that all content is <b className='gradient-text'>locked</b> until a user decides to spend credits to unlock it.
            <br/>
            <br/>
            When you unlock an item, <b className='gradient-text'>100%</b> of the credits you spend go <b className='gradient-text'>directly</b> to the creator of the item.
          </p></Zoom>
          <Fade><LockedItem key={"JuPfujTTL98hMzBmLm2h"} itemID={"JuPfujTTL98hMzBmLm2h"}/></Fade>
          </div>
        </div>

        <div className='section' id="leaderboards">
          <h1 className='gradient-text'>Get Recognition on the Leaderboards</h1>
          <div className='content-row'>
          <Zoom><p className='content'>
              People who gain the most <b className='gradient-text'>support</b> from the fwee community will get on the <b className='gradient-text'>leaderboards</b>.
              <br/>
              <br/>
              All players will unlock <b className='gradient-text'>achievements</b> when they hit certain credit <b className='gradient-text'>milestones</b>.
            </p></Zoom>
            <Fade><img src={crown} alt="crown" width={200} height="auto"/></Fade>
            <Zoom><Link to="/leaders"><button>View Current Leaders</button></Link></Zoom>
          </div>
        </div>

        <Fade>
        <div className='section' id="why">
          <h1 className='gradient-text'>What's the Point?</h1>
          <div className='content-row'>
          <p className='content'>
            Time is the most valuable thing in life, therefore you should <b className='gradient-text'>pay attention</b> to how you are spending it.
            <br/>
            <br/>
            Life is what <b className='gradient-text'>you</b> make it.
            {/* Do something great with your life, because the future is something all people should have a hand in shaping. */}
          </p>
          </div>
        </div>
        </Fade>

        <Fade>
        <div className='section' id="faqs">
          <h1 className='gradient-text'>Frequently Asked Questions</h1>
          <div className="accordion">
            {accordionData.map(({ title, content }) => (
              <Accordion title={title} content={content} />
            ))}
          </div>
        </div>
        </Fade>

        <Zoom>
        <div className='section' id="final-section">
          <h1 className='gradient-text'>Stop Wasting Time</h1>
          <div className='content-row'>
          <Link to="/join"><button>Join Now</button></Link>
          </div>
        </div>
        </Zoom>

      </div>
    );
  }

export default About;