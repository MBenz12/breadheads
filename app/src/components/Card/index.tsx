import React from 'react';
import LazyLoad from 'react-lazy-load';

const Card = ({
    children,
    img,
    classNames
}: {
    children: React.ReactNode,
    img?: string,
    classNames?: string,
}) => {
    return (
        <div className={`m-1 lg:shadow-[0_4px_6px_1px_#2912B9] card max-w-[300px] ${classNames && classNames} ${img && "shadow-[0_4px_6px_1px_#2912B9]"}`}>
            {img &&
                <LazyLoad>
                    <img className="w-full rounded-tr-[20px] rounded-tl-[20px]" src={img} alt="card_img" />
                </LazyLoad>
            }
            {children}
        </div>
    );
};

export default Card;