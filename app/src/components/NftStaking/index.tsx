/* eslint-disable react-hooks/exhaustive-deps */
import { AnchorProvider, Program } from "@project-serum/anchor";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import Button from "components/Button";
import Card from "components/Card";
import InnerWindow from "components/InnerWindow";
import useFetchNfts from "hooks/useFetchNfts";
import { IDL, Breadheads } from "idl/breadheads";
import { useCallback, useEffect, useState } from "react";
import idl from "idl/breadheads.json";
import useFetchVaults from "hooks/useFetchVaults";
import Counters from "./Counters";
import CreateUserTab from "./CreateUserTab";
import ConnectWallet from "components/ConnectWallet";
import { callCreateUser, callStake, callStakeAll, callUnstake, callUnstakeAll } from "staking-program-lib/methods";
import { toast } from "react-toastify";
import { NftData } from "types";
import { Keypair, PublicKey } from "@solana/web3.js";
import TotalEarnedXP from "./TotalEarnedXP";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";

const NftStaking = () => {
    const anchorWallet = useAnchorWallet();
    const wallet = useWallet();
    const { connection } = useConnection();
    const [program, setProgram] = useState<Program<Breadheads>>();

    useEffect(() => {
        const provider = new AnchorProvider(connection, anchorWallet || new NodeWallet(Keypair.generate()), AnchorProvider.defaultOptions());
        setProgram(new Program(IDL, idl.metadata.address, provider));
    }, [anchorWallet, connection]);

    const { nfts } = useFetchNfts();
    const [reload, setReload] = useState({});
    const { stakedNfts, unstakedNfts, vault, user } = useFetchVaults(program, nfts, reload);

    const handleCreateUser = useCallback(async () => {
        if (!program || !wallet.publicKey) return;
        toast.dismiss();
        toast(`Creating user account`);

        const txn = await callCreateUser(wallet, program);
        toast.dismiss();
        if (txn) {
            toast.success("Your user account created successfully");
            setReload({});
        } else {
            toast.error("There was a problem creating user account");
        }
    }, [program, wallet.publicKey]);

    const stake = useCallback(async (nft: NftData) => {
        if (!program || !wallet.publicKey) return;
        toast.dismiss();
        toast(`Staking your NFT`);
        const txn = await callStake(wallet, program, nft.mint);
        if (txn) {
            toast.success(`Successfully Staked`);
            setReload({});
        } else {
            toast.error("There was a problem staking");
        }
    }, [wallet.publicKey, program]);

    const stakeAll = useCallback(async (nfts: NftData[]) => {
        if (!program || !wallet.publicKey) return;

        toast.dismiss();
        toast(`Staking your NFTs`);
        const mints: PublicKey[] = [];
        nfts.forEach((nft) => {
            mints.push(nft.mint);
        });

        const txn = await callStakeAll(wallet, program, mints);

        if (txn) {
            toast.success(`Successfully Staked`);
            setReload({});
        } else {
            toast.error("There was a problem staking");
        }
    }, [program, wallet.publicKey]);

    const unstake = useCallback(async (nft: NftData) => {
        if (!program || !wallet.publicKey) return;

        toast.dismiss();
        toast(`Unstaking your NFT`);
        const txn = await callUnstake(wallet, program, nft.mint);

        if (txn) {
            toast.success(`Successfully Unstaked`);
            setReload({});
        } else {
            toast.error("There was a problem unstaking");
        }
    }, [wallet.publicKey, program]);

    const unstakeAll = useCallback(async (nfts: NftData[]) => {
        if (!program || !wallet.publicKey) return;

        toast.dismiss();
        toast(`Unstaking your NFTs`);
        const mints: PublicKey[] = [];

        nfts.forEach((nft) => {
            mints.push(nft.mint);
        });

        const txn = await callUnstakeAll(wallet, program, mints);
        if (txn) {
            toast.success(`Successfully Unstaked`);
            setReload({});
        } else {
            toast.error("There was a problem unstaking");
        }
    }, [program, wallet.publicKey]);

    const earnedXp = vault && user && <TotalEarnedXP vault={vault} user={user} />;

    return (
        <div className="my-16">
            <Counters stakedCount={user ? user.stakedItems.length : 0} totalStakedCount={vault ? vault.stakedCount : 0} earned={earnedXp} />
            {!wallet.publicKey && <ConnectWallet />}
            {wallet.publicKey && <>
                {!user && <CreateUserTab createUser={handleCreateUser} />}
                {user && <>
                    <div className="mb-5 flex flex-col justify-center gap-4 lg:flex-row">
                        <div className="grid grid-cols-2 gap-4">
                            <Button onClick={() => stakeAll(unstakedNfts)} actionDisabled={!unstakedNfts.length}>Stake ALL</Button>
                            <Button onClick={() => unstakeAll(stakedNfts)} disabled actionDisabled={!stakedNfts.length}>Unstake ALL</Button>
                        </div>
                    </div>
                    <InnerWindow>
                        <div className="grid grid-cols-1 place-items-center gap-x-[20px] gap-y-[20px] 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
                            {
                                [...unstakedNfts, ...stakedNfts].map((nft, index) => (
                                    <Card key={index} img={nft.image}>
                                        <div className="flex w-full flex-col place-items-center">
                                            <p className="mt-2 text-center text-white opacity-40 text-[12px]">Accrued JEWEL</p>
                                        </div>
                                        <div className="mx-2 my-4">
                                            {nft.nftItem?.lastStakedTime ?
                                                <Button onClick={() => unstake(nft)} disabled>Unstake</Button> :
                                                <Button onClick={() => stake(nft)}>Stake</Button>
                                            }
                                        </div>
                                    </Card>
                                ))
                            }
                        </div>
                    </InnerWindow>
                </>}
            </>}
        </div>
    );
};

export default NftStaking;