// exportWallet.ts
declare global{
    interface Window{
        solana:any;
    }
}

export const getWallet = () => window.solana