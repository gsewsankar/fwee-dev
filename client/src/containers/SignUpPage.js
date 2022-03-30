import React,{useState} from 'react';
import "./SignUpPage.css"
import SignIn from '../components/SignIn';

function SignUpPage(){
    const [checked, setChecked] = useState(false);

    window.scroll(0,0);

    return(
      <div className='sign-up-container'>
          <h1>Welcome to fwee!</h1>
          <h2>Rules</h2>
          <ol>
              <li>Only post items that you create and own.</li>
              <li>Do not exchange credits for other currencies.</li>
              <li>Enjoy Life!</li>
          </ol>
          <div>
          <label htmlFor="agree">
            <input
                id="agree"
                type="checkbox"
                checked={checked}
                onChange={e => setChecked(e.target.checked)}
            />I understand and agree to the rules.</label>
          </div>
          {checked ? <SignIn/> : <button>You must agree to the rules!</button>}
      </div>
    )
  }

export default SignUpPage;