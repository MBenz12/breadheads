import { useWallet } from "@solana/wallet-adapter-react";
import Header from "components/Header";
import MainWindow from "components/MainWindow";
import NftStaking from "components/NftStaking";
import Sidebar from "components/Sidebar";
import { useState } from "react";

export default function Home() {
    const [activeIndex, setActiveIndex] = useState(0);
    const wallet = useWallet();

    const tabs = [
        {
            tabTitle: "Emperor Staking",
            mainWindowTitle: "EMPERORS NFT STAKING"
        }
    ]

    const handleSwitch = (index: number) => {
        if (!wallet.publicKey) {
            setActiveIndex(0);
        } else {
            setActiveIndex(index);
        }
    }

    return (
        <div className="relative flex flex-col">
            <Header activeIndex={activeIndex} handleSwitch={handleSwitch} tabs={tabs} />

            <div className="flex flex-col place-items-center lg:flex-row lg:place-items-start">
                <Sidebar activeIndex={activeIndex} handleSwitch={handleSwitch} tabs={tabs} />
                <MainWindow title={tabs[activeIndex].mainWindowTitle}>
                    {
                        activeIndex === 0 && <NftStaking />
                    }
                </MainWindow>
            </div>
        </div>
    );
};