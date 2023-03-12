import { useState, useEffect } from "react";
import { User, VaultData } from "types";

export const TotalEarnedXP = ({ vault, user }: { vault: VaultData, user: User }) => {
    const [earned, setEarned] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            let earned = 0;
            
            setEarned(earned / 1e2);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [vault, user]);
    return <>{earned.toLocaleString('en-us', { maximumFractionDigits: 2 })}</>;
};

export default TotalEarnedXP;