import React from 'react';

const InnerWindow = ({ className = "", children }: { className?: string, children: React.ReactNode }) => {
    return (
        <div className={`inner-window rounded-[10px] w-full bg-[#0E0E13] py-5 px-5 lg:px-10 max-h-full ` + className}>
            {children}
        </div>
    );
};

export default InnerWindow;