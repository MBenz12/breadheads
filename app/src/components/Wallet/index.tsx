import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Wallet = ({ forceVisible }: { forceVisible?: boolean }) => {
    const wallet = useWallet();
    return (
        <WalletMultiButton>
            <div className={`cursor-pointer rounded-[8px] px-[24px] py-[9px] purple-header-button-gradient`}>
                <p className="text-white">
                    {wallet.publicKey ? wallet.publicKey.toString().slice(0, 5) + "..." + wallet.publicKey.toString().slice(-5) : "Connect wallet"}
                </p>
            </div>
        </WalletMultiButton>

    );
};

export default Wallet;