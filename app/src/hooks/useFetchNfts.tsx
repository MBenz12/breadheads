/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { NftData } from "types";
import { Metaplex } from "@metaplex-foundation/js";
import { NFT_CREATOR } from "config";
import { PublicKey } from "@solana/web3.js";

const useFetchNfts = (): { nfts: Array<NftData> } => {
    const wallet = useWallet();
    const { connection } = useConnection();

    const metaplex = useMemo(() => new Metaplex(connection), [connection]);

    const [nfts, setNfts] = useState<Array<NftData>>([]);

    const fetch = useCallback(async () => {
        if (!wallet.publicKey) {
            return;
        }
        try {
            const walletNfts = await metaplex.nfts().findAllByOwner({ owner: wallet.publicKey });
            const collection = walletNfts.filter(nft =>
                nft.creators.length && nft.creators[0].address.toString() === NFT_CREATOR
            );

            const nfts: Array<NftData> = collection.map(nft => ({
                // @ts-ignore
                mint: nft.mintAddress as PublicKey,
                name: nft.name,
                image: "",
                type: 0,
            }));

            await Promise.all(
                collection.map(async (nft, index) => {
                    try {
                        const { data } = await axios.get(nft.uri);
                        const { image, attributes } = data;
                        let traits = attributes.filter((trait: {trait_type: string, value: string}) => trait.trait_type === "Version")
                        if (traits.length) {
                            nfts[index].type = traits[0].value === "Emperors" ? 2 : (traits[0].value === "WB Emperors" ? 3 : 1);
                        }
                        nfts[index].image = image;
                    } catch (error) {
                        console.log(error);
                    }
                })
            );

            nfts.sort((a: NftData, b: NftData) => {
                if (a.name === b.name) return 0;
                return a.name > b.name ? 1 : -1;
            });

            setNfts(nfts);
        } catch (error) {
            console.log(error);
        }
    }, [metaplex, wallet.publicKey]);

    useEffect(() => {
        fetch();
    }, [wallet.publicKey, metaplex, fetch]);

    return { nfts };
};

export default useFetchNfts;