import { useState, useEffect } from "react";
import { User, VaultData } from "types";

export const TotalEarnedXP = ({ vault, user }: { vault: VaultData, user: User }) => {
    const [earned, setEarned] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (user.lastUpdatedTime.toNumber() === 0) return;
            
            let earned = user.earnedXp;
            let stakedTime = Math.floor(new Date().getTime() / 1000) - user.lastUpdatedTime.toNumber();
            let stakedCount = user.stakedItems.length;
            let multiplier = 100;
            for (let i = 0; i < vault.badgeCounts.length; i++) {
                if (vault.badgeCounts[i] <= stakedCount && i) {
                    multiplier = vault.multipliers[i] / 256;
                }
            }
            earned = earned + stakedCount * multiplier / 100 * stakedTime / 86400 * vault.xpRate;
            setEarned(earned / 1e2);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [vault, user]);
    return <>{earned.toLocaleString('en-us', { maximumFractionDigits: 2 })}</>;
};

export default TotalEarnedXP;