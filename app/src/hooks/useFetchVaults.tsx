/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { NftData, User, VaultData } from "types";
import { Breadheads } from "idl/breadheads";
import { Program } from "@project-serum/anchor";
import { getUserPda, getVaultPda } from "staking-program-lib/utils";

const useFetchVaults = (program: Program<Breadheads> | undefined, nfts: Array<NftData>, reload: {}): {
    stakedNfts: Array<NftData>,
    unstakedNfts: Array<NftData>,
    vault: VaultData | undefined,
    user: User | undefined,
} => {
    const wallet = useWallet();
    const [unstakedNfts, setUnstakedNfts] = useState<Array<NftData>>([]);
    const [stakedNfts, setStakedNfts] = useState<Array<NftData>>([]);
    const [vault, setVault] = useState<VaultData>();
    const [user, setUser] = useState<User>();

    const fetch = useCallback(async () => {
        if (!program) {
            return;
        }
        try {
            const vault = await getVaultPda();
            const vaultData = await program.account.vault.fetch(vault) as VaultData;
            setVault(vaultData);

            if (!wallet.publicKey) return;

            const [user] = await getUserPda(vault, wallet.publicKey)
            const userData = await program.account.user.fetch(user) as User;
            setUser(userData);

            if (nfts.length) {
                try {
                    const stakedNfts: Array<NftData> = [];
                    const unstakedNfts: Array<NftData> = [];
                    const stakedMints = userData.stakedItems.map(index => vaultData.nftItems[index].mint.toString());
                    for (const nft of nfts) {
                        let index = stakedMints.indexOf(nft.mint.toString());
                        if (index !== -1) {
                            stakedNfts.push({
                                ...nft,
                                nftItem: vaultData.nftItems[index]
                            });
                        }
                        
                        if (index === -1) {
                            unstakedNfts.push({ ...nft });
                        }
                    }

                    setUnstakedNfts(unstakedNfts);
                    setStakedNfts(stakedNfts);
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }, [wallet.publicKey, program, nfts]);

    useEffect(() => {
        fetch();
    }, [wallet.publicKey, program, nfts, reload, fetch]);

    return { stakedNfts, unstakedNfts, vault, user };
};

export default useFetchVaults;