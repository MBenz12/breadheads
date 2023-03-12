import React from 'react';

const MainWindow = ({ title, children }: { title: string, children: React.ReactNode }) => {
    return (
        <div className="flex h-fit flex-col place-items-center justify-center w-[95%] lg:w-full">
            <h1 className="py-9 text-center text-white font-[Moneta] text-[20px] lg:text-[50px]">{title}</h1>

            <div className="w-[98%] px-3 main-window 2xl:max-w-[1200px] 2xl:px-20">
                {children}
            </div>
        </div>
    );
};

export default MainWindow;