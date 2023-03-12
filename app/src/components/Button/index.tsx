import React from 'react';

const Button = ({
    children,
    white,
    onClick,
    disabled,
    actionDisabled,
    fontSize,
    className = "",
}: {
    children: React.ReactNode,
    white?: boolean,
    onClick?: () => void,
    disabled?: boolean,
    actionDisabled?: boolean,
    fontSize?: string,
    className?: string,
}) => {
    return (
        <div
            className={`${disabled ? "bg-[#1E1E1E]" : white ? "bg-white" : "purple-button-gradient"} ${actionDisabled ? "cursor-not-allowed" : "cursor-pointer"} ${!actionDisabled && "hover:scale-[0.98]"} duration-200 rounded-[8px] sm:px-6 px-4 py-2 select-none flex justify-center font-bold ` + className}
            onClick={actionDisabled ? undefined : onClick}
        >
            <p className={`${disabled ? "text-[#424242]" : white ? "text-black" : "text-white"} text-center text-[${fontSize || "14px"}] lg:text-[${fontSize || '16px'}] select-none flex place-items-center`}>{children}</p>
        </div>
    );
};

export default Button;