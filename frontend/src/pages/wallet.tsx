import { getWallet } from "./exportWallet";
import{
    Connection,
    Transaction,
    SystemProgram,
    PublicKey
  } from '@solana/web3.js';

export const connectWallet = async () =>{
    const wallet = getWallet();
    if(!wallet){
        window.open("https://phantom.app","_blank");
        return
    }
    const publicKey = await wallet.connect()
    return publicKey;
}

  export const sendMoney = async (from:PublicKey, to: PublicKey, amount:number) =>{
    const wallet = getWallet()
    const sender = connectWallet()
    const environ = "devnet"
    const network = `https://api.${environ}.solana.com`
  
    console.log(amount);

    const connection = new Connection(network)
    const transaction = new Transaction()
    .add(
      SystemProgram.transfer({
        fromPubkey: from,
        toPubkey:to,
        lamports: amount * 1000000000
      })
    );

    const { blockhash } = await connection.getRecentBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = from

    let signedTransaction = await wallet.signTransaction(transaction)

    try {
        const txid = await connection.sendRawTransaction(
          signedTransaction.serialize()
        )

        const signature = await wallet.sendTransaction(transaction, connection);
	
		try {
		  const temp = await connection.confirmTransaction(signature, "processed");
		  console.log(temp);
          console.log("VERIFIED")
          return txid;
		  
		} catch (error) {}

   
        }catch (error) {
        console.error(error)
      }

  }
  