import { BN } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

export type NftData = {
    mint: PublicKey;
    name: string;
    image: string;
    type: number;
    nftItem?: NftItem;
};

export type VaultData = {
    authority: PublicKey;
    nftItems: Array<NftItem>;
    nftCreator: PublicKey;
    itemCount: number;
    stakedCount: number;
    xpRate: number;
    badgeCounts: Array<number>;
    multipliers: Array<number>;
    bump: number;
};

export type NftItem = {
    mint: PublicKey;
    lastStakedTime: BN;
    stakedLevel: number;
    name: number;
};

export type User = {
    key: PublicKey;
    stakedItems: Array<number>;
    lastUpdatedTime: BN;
    earnedXp: number;
    bump: number;
}

export type Tab = {
    tabTitle: string;
    mainWindowTitle: string;
}