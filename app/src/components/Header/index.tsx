import { useState } from 'react';
import { Tab } from 'types';
import Sidebar from "../Sidebar";
import Wallet from "../Wallet";

const Header = ({
    tabs,
    activeIndex,
    handleSwitch
}: {
    tabs: Array<Tab>,
    activeIndex: number,
    handleSwitch: (index: number) => void,
}) => {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <header className="flex w-full justify-between bg-black px-6 py-6 max-h-[87px] bottom-grey-border lg:px-24">
            <img src="/images/logo.svg" alt="" className="sm:w-[192px] w-[114px]" />
            <div className="hidden xl:block">
                <Wallet />
            </div>
            <div className="xl:hidden cursor-pointer" onClick={() => setMenuOpen(true)}>
                <img src="/images/mobile-menu.svg" alt="" />
            </div>
            {
                menuOpen
                &&
                <div className="fixed inset-0 z-10 h-screen w-screen bg-black">
                    <div className="fixed top-0 right-0 justify-end">
                        <div className="p-10 menu-close-button" onClick={() => setMenuOpen(false)}></div>
                    </div>
                    <div className="flex flex-col justify-center h-full">
                        <div className="z-20 flex justify-center">
                            <Sidebar forceVisible tabs={tabs} handleSwitch={handleSwitch} activeIndex={activeIndex}></Sidebar>
                        </div>
                        <div className="flex justify-center">
                            <Wallet forceVisible />
                        </div>
                    </div>
                </div>
            }
        </header>
    );
};

export default Header;