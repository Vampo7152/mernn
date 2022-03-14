import { Connection, Transaction,SystemProgram } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import {sendMoney} from './wallet'
import {PublicKey} from '@solana/web3.js';
import axios from 'axios';


interface userData{
    amount:number;

}


const SolCheckout = (props:userData) =>{


    const [amount, setAmount] = useState(0);
    const [amountAfterTXN,setamountAfterTXN] = useState(0)
    
    const [walletAddress,setWalletAddress] = useState("");
    const [currentWalletBalance,setcurrentWalletBalance] = useState('');


    const [solPrice,setSolPrice] = useState(0);
	const [solTotal,setSolTotal] = useState(0);

	const fetchSolPrice = async() => {
		try {
		  const { data } = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
		  setSolPrice(data.solana.usd);
		} catch (error) {
		  console.error('Unable to fetch SOL price.');
		}
	  }
	
	const computeSolPrice = () => {
	
			const amountTemp = Number(amount / solPrice).toFixed(2);
            const realamt = parseFloat(amountTemp)
            console.log(realamt);
			setSolTotal(realamt);


	  }


	useEffect(()=>{
		fetchSolPrice();	
	},[])

	useEffect(()=>{
		computeSolPrice();
	},[solPrice])

    useEffect(()=>{
        console.log("SOL TOTAL : s" , solTotal)
    },[solTotal])




    useEffect(()=>{
        console.log(amount);
    },[amount])



    const IfWalletConnected = async () =>{
        try{
            const {solana} = window;
            if(solana){
                if(solana.isPhantom){
                    console.log("Phantom Wallet Found!")
                    const response = await solana.connect({ onlyIfTrusted: true });
                    console.log(
                      'Connected with Public Key:',
                      response.publicKey.toString()
                    );
                    setWalletAddress(response.publicKey.toString());
                   
               
                }else{
                    alert("Solana Object Not Found")
                }
            }
        }catch(error){
         console.error(error);
        }
    }
    
    const connectWallet = async () =>{
        const { solana } = window;

        if (solana) {
            const response = await solana.connect();
            console.log('Connected with Public Key:', response.publicKey.toString());
            setWalletAddress(response.publicKey.toString());
         
        }
    };


    //API



    const paySolana = async() =>{
        const sender = new PublicKey(walletAddress);
        const orignalBal:number = +currentWalletBalance;
        console.log("IN PAY SOLANA: ", amount );
        // Beneficiary wallet address below
        const bizOwnerAddress = "HTpmUfTzTjzT3vRtbaXJ6vAhhjfDJxjA4QKrKSqa23WQ";
        const receiver = new PublicKey(bizOwnerAddress);
        const signature = await sendMoney(sender,receiver,solTotal);
        console.log(signature);
    }

    //UseEffects

    useEffect(()=>{
    IfWalletConnected();   
    setAmount(props.amount);

    },[])
    
    
    
    return(
        <div>        
        {!walletAddress && IfWalletConnected ? 
        
        <Button
        onClick={connectWallet}
        color="primary"
        >Connect Phantom Wallet To Pay With Solana</Button>
        
        :
        <div>
        <Button color="primary"
        
        
        onClick={paySolana}
        
        
        >Pay {solTotal} With Solana</Button>
        <br/>
         </div>
        }
    
        </div>

    )

}

export default SolCheckout;