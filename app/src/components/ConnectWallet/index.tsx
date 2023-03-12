import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Button from "components/Button"
import InnerWindow from "components/InnerWindow"

const ConnectWallet = () => {
    return (
        <div className="mt-10">
            <InnerWindow>
                <div className="flex flex-col place-items-center justify-between p-10 text-white h-[400px]">
                    <div className="flex flex-col place-items-center gap-5">
                        <h1 className="whitespace-nowrap text-center">Connect to Start Staking</h1>
                        <WalletMultiButton>
                            <Button>Connect</Button>
                        </WalletMultiButton>
                    </div>
                    <div>
                        <h1 className="text-[#424242]">Don't have an emperor?</h1>
                        <a className="flex items-center justify-center" href="https://magiceden.io/marketplace/elite_emperors" target={"_blank"} rel="noreferrer">
                            <img className="w-[25px] h-[20px]" src="/images/magiceden.svg" alt="magiceden-icon" />
                            <p>Buy Now</p>
                        </a>
                    </div>
                </div>
            </InnerWindow>
        </div>
    )
};

export default ConnectWallet;