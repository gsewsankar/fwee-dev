

// TODO: Need to rewrite this entire file to accurately reflect a real transaction system
// by integrating MessageSender and MessageHandler

import MessageSender from './MessageSender'
import MessageHandler from './MessageHandler'
import {useState, useReducer} from 'react'

const { SHA256 } = require('crypto-js');
const {DateTime, Interval} = require('luxon');

function TransactionSystem(){
    const accountObj = {
        accounts:
        [
                {
                    username: "@john",
                    password: SHA256("someHashedstring").toString(),
                    createdAt: new Date(Date.UTC(2021,5,31,12,23,21,11)),
                    history: [],
                    total_in:0.00,
                    total_out:0.00,
                    balance: 30.00
                },
                {
                    username: "@preet",
                    password: SHA256("somePassword").toString(),
                    createdAt: new Date(Date.UTC(2021,6,23,8,40,31,16)),
                    history: [],
                    total_in:0.00,
                    total_out:0.00,
                    balance: 10.40
                }
         ]
    }
    function reducer(curr, receivedAccount)
    {
        return {
                accounts: receivedAccount
        }
    }

// TODO: change currentUser and accounts into states
    const [currentUser, setCurrentUser] = useState("@john");

    const [accounts, setAccounts] = useReducer(reducer, accountObj)

   const updateBalance = (username) =>{
   
        const user = accounts.find(account => account.username == username);
        let created = user.createdAt;
        let now = DateTime.now();
        let i = Interval.fromDateTimes(created, now);
        let score = i.length('minutes');
        score = ((score*0.01)+Number(user.total_in)-Number(user.total_out)).toFixed(2);
        user.balance = Number(score);
    }

   const getBalance = (username) =>{
        const user = accounts.find(account => account.username == username);
        return user.balance;
    }

   const sendCredits = (from,to,amount) =>{
        const sender = accounts.find(account => account.username == from);
        const recipient = accounts.find(account => account.username == to);

        updateBalance(from);

        if(currentUser == sender.username && sender.balance > amount){
            sender.balance -= amount;
            sender.total_out += amount;
            sender.history.push({from,to,amount,time:Date.now()});
            recipient.balance += amount;
            recipient.total_in += amount;
            recipient.history.push({from,to,amount,time:Date.now()});
            console.log("Success! " + sender.username + " sent " + recipient.username + " " + amount + " credits.")
        }
        else{
            if(currentUser != sender.username){
                console.log("You are not authorized to send credits from that account.");
            }
            else{
                console.log("Error: Not Enough Balance");
            }
        }
    }
}

export default TransactionSystem;
/*updateBalance("@john");
console.log(getBalance("@john"));
sendCredits("@john","@preet",1000);
console.log(accounts);*/


