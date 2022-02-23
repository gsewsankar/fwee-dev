import {useEffect,useReducer, useRef, useState} from 'react'
import Gun from 'gun/gun'
import 'gun/sea'
import 'gun/axe'
import ReactLoading from 'react-loading';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { StyledEngineProvider } from "@mui/material/styles";

const SHA256 = require('crypto-js/sha256');


 var gunPeer = Gun(

        ['https://fwee-gun-relay-node.herokuapp.com/gun']
    
    
 );



 export  const MessageHandler = (props) =>{
    const messages = {messageArray: []}
    const messages2 = {messageArray: []}
   
    function reducer(curr, receivedMessage)
    {
       switch (receivedMessage.type)
        {
            case 'replace':
               receivedMessage.replacer.sort((b, a) => a.time.valueOf() - b.time.valueOf())
   
               return{
   
                   messageArray: receivedMessage.replacer
               }     
             default:
               return {
                   messageArray: [receivedMessage, ...curr.messageArray]
                }
          }
   
    }
    const [messageState, setMessageState] = useReducer(reducer, messages)
    const [tempState, setTempState] = useReducer(reducer, messages2)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const calculateHash = (blk) =>{
        return SHA256(blk.previousHash + blk.data).toString();
    }

    const createHashChain = () =>{
        if(tempState.messageArray.length > 2){
        

            var temp = JSON.parse(JSON.stringify(tempState.messageArray))
            for(let i = temp.length-1; i > 0; i--){
               
                var prevBlock = temp[i];

                var currentBlock=null;
                if(i != 0)
                    currentBlock = temp[i-1];
                else
                    currentBlock = null
                
             
                
                if(i === temp.length-1)

                {
                    prevBlock.previousHash = null
                    prevBlock.hash = calculateHash(prevBlock)

                    
                    currentBlock.previousHash = prevBlock.hash
                    currentBlock.hash = calculateHash(currentBlock)
                    
                }
                else if(i==0)
                {
                            prevBlock.previousHash = temp[1].hash

                            prevBlock.hash = calculateHash(prevBlock)
                }
                else 
                {
                    currentBlock.previousHash = prevBlock.hash
                    currentBlock.hash = calculateHash(currentBlock)

                }
            }
            


                for(let i = temp.length-1; i > 0; i--){
                        var prevBlock = temp[i];
                        var currentBlock=null;
                        if(i != 0)
                            currentBlock = temp[i-1];

                        else
                            currentBlock = null
        
                        if(i==0)
                        {

                                if(prevBlock.previousHash !== temp[1].hash)
                                {   

                                            return false;
                                }
                        }
                        if(currentBlock.hash !== calculateHash(currentBlock)){
                                return false;
                        }
        
                        if(currentBlock.previousHash !== calculateHash(prevBlock)){


                                return false;
                        }
        
                    }
                    setMessageState({replacer: temp, type: 'replace'})

                    return true;
        
                
        }
    }
 const [firstTime, setFirstTime] = useState(false)

     useEffect(() =>{
        // update messages array with whatever is in the database using reducer
        // reducer is different from useState as it optimizes performance for deep updates
        // and is more predictable and easier for our use case
                let user = gunPeer.user()

                if(!user.is){
                    setFirstTime(true)
                    user.auth('fweeMessageChainSecond', process.env.REACT_APP_TRANSACTION_SYSTEM_API_KEY)

                    gunPeer.on('auth', async(event)  => {
                      user.get('transactions').map().once( (m, index) => {
                        setTempState({
                            to: m.to,
                            from: m.from,
                            amount: m.amount,
                            time: m.time,
                            key: index,
                            hash: null,
                            previousHash: null
    
                        }, {wait: 1})
                    })


                   })
                    
                
            }
            else{
                    setLoading(false)                
                user.get('transactions').map().once( (m, index) => {

                    setTempState({

                        to: m.to,
                        from: m.from,
                        amount: m.amount,
                        time: m.time,
                        key: index,
                        hash: null,
                        previousHash: null

                    })
                    

                })
            }
 
                
               
            
                
            return () => {
                    gunPeer.off(); 
                    
                }


    
        

    }, [])
    useEffect(() =>{
        var valid = createHashChain()

        const delayDebounceFn = setTimeout(() => {
            if(!valid)
            {
                setError(true)
            }
            else
            {
                if(firstTime)
                    props.handler()
            }
            

          }, 1000)
      
          return () => clearTimeout(delayDebounceFn)
      
     
        

    }, [tempState.messageArray])

  
    
    
    
    return(
        <div>
     {  loading?
         <ReactLoading type={'spin'} color={'black'} height={667} width={375} />
         : null
     }
     {
         error ?

     
        <h1>Error occurred in validating blockchain, contact administrator</h1>

        : (props.display && !loading) ?
        <StyledEngineProvider injectFirst>

        <TableContainer component={Paper}>
        <Table sx={{m: 2, minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Transaction</TableCell>
              <TableCell align="right">From</TableCell>
              <TableCell align="right">To</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Time</TableCell>
              <TableCell align="right">Hash</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {messageState.messageArray.map((message, i) => (
              <TableRow
                key={message.key}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {i}
                </TableCell>
                <TableCell align="right">{message.from}</TableCell>
                <TableCell align="right">{message.to}</TableCell>
                <TableCell align="right">{message.amount}</TableCell>
                <TableCell align="right">{message.time}</TableCell>
                <TableCell align="right">{message.hash}</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </StyledEngineProvider>

     
            : null
        }
    
    
    </div>)

 }

