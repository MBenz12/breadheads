import { Tab } from "types";

const Sidebar = ({
    tabs,
    activeIndex,
    handleSwitch,
    forceVisible
}: {
    tabs: Array<Tab>,
    activeIndex: number,
    handleSwitch: (index: number) => void,
    forceVisible?: boolean,
}) => {
    return (
        <div className={`xl:flex ${forceVisible ? "flex" : "hidden"} h-full w-full flex-col justify-start lg:w-[300px] lg:h-screen`}>
            <div className="relative mb-10 lg:mb-0 lg:top-[132px]">
                {
                    tabs.map((tab, index) => (
                        <div key={index} className={`rounded-tr-[10px] rounded-br-[10px] ${activeIndex === index && "purple-button-gradient"}`} onClick={() => {handleSwitch(index)}}>
                            <p className={`cursor-pointer whitespace-nowrap px-12 py-4 text-white ${activeIndex !== index && "opacity-40"}`}>{tab.tabTitle}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default Sidebar;