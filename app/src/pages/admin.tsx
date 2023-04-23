/* eslint-disable react-hooks/exhaustive-deps */
import { AnchorProvider, Program } from "@project-serum/anchor";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Connection, PublicKey } from "@solana/web3.js";
import { NFT_CREATOR, SOLANA_RPC_URL } from "config";
import { IDL, Breadheads } from "idl/breadheads";
import idl from "idl/breadheads.json";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    callClosePda,
    callClosePdas,
    callInitializeVault,
    callReleaseUsers,
    callUpdateVault,
} from "staking-program-lib/methods";
import { getRole, getUserPda, getVaultPda } from "staking-program-lib/utils";
import { User, VaultData } from "types";
const programAddress = idl.metadata.address;
const connection = new Connection(SOLANA_RPC_URL, "confirmed");
const levels = ["Dreamer", "Believer", "Acheiver"];
const badges = [
    "Bakers Dozen",
    "Confectioner",
    "Bread Winner",
];

export default function Admin() {
    const [program, setProgram] = useState<Program<Breadheads> | undefined>();
    const [vault, setVault] = useState<VaultData>();
    const [totalStaked, setTotalStaked] = useState(0);
    const [role, setRole] = useState(0);
    const anchorWallet = useAnchorWallet();
    const wallet = useWallet();
    const [creatorAddress, setCreatorAddress] = useState(NFT_CREATOR);
    const [xpRate, setXpRate] = useState(5);
    const [badgeCounts, setBadgeCounts] = useState([13, 26, 36]);
    const [multipliers, setMultipliers] = useState([1.25, 1.5, 2.5]);

    useEffect(() => {
        if (!anchorWallet) return;
        const provider = new AnchorProvider(connection, anchorWallet, {
            preflightCommitment: "processed",
        });
        setProgram(new Program(IDL, programAddress, provider));
        setRole(getRole(anchorWallet.publicKey.toString()));
    }, [anchorWallet]);

    async function setVaultState(program: Program<Breadheads> | undefined) {
        if (!wallet.publicKey) return;

        if (program) {
            const vault = await getVaultPda();
            const vaultData = await program.account.vault.fetchNullable(vault) as VaultData;
            if (vaultData) {
                setVault(vaultData);
                setCreatorAddress(vaultData.nftCreator.toString());
                setXpRate(vaultData.xpRate / 100);
                setBadgeCounts(vaultData.badgeCounts);
                setMultipliers(vaultData.multipliers.map(multiplier => multiplier / 100 / 256));
                setTotalStaked(vaultData.stakedCount);
            } else {
                setCreatorAddress(NFT_CREATOR);
                setTotalStaked(0);
                setVault(undefined);
            }
        }
    }

    // Get state once on initial load
    useEffect(() => {
        const getState = async () => {
            if (!vault) {
                await setVaultState(program);
            }
        };
        getState();
    }, [program]);

    async function initializeVault() {
        if (!program || !wallet.publicKey) return;
        const txn = await callInitializeVault(
            wallet,
            program,
            new PublicKey(creatorAddress),
        );
        if (txn) {
            console.log(txn);
            setVaultState(program);
            toast.success("Success");
        } else {
            toast.error("Failed");
        }
    }

    async function updateVault() {
        if (!program || !wallet.publicKey) return;
        const txn = await callUpdateVault(
            wallet,
            program,
            new PublicKey(creatorAddress),
            xpRate * 100,
            badgeCounts,
            multipliers.map(multiplier => multiplier * 100),
        );
        if (txn) {
            console.log(txn);
            setVaultState(program);
            toast.success("Success");
        } else {
            toast.error("Failed");
        }
    }

    async function closeUser() {
        if (!program || !wallet.publicKey) return;
        const vault = await getVaultPda();
        const [user] = await getUserPda(vault, wallet.publicKey);
        const txn = await callClosePda(
            wallet,
            program,
            user,
        );
        if (txn) {
            console.log(txn);
            setVaultState(program);
            toast.success("Success");
        } else {
            toast.error("Failed");
        }
    }

    async function closeAllUsers() {
        if (!program || !wallet.publicKey) return;
        const users = await program.account.user.all();
        const txn = await callClosePdas(
            wallet,
            program,
            users.map(user => user.publicKey),
        );
        if (txn) {
            console.log(txn);
            setVaultState(program);
            toast.success("Success");
        } else {
            toast.error("Failed");
        }
    }

    async function closeVault() {
        if (!program || !wallet.publicKey) return;
        const vault = await getVaultPda();
        const txn = await callClosePda(
            wallet,
            program,
            vault,
        );
        if (txn) {
            console.log(txn);
            setVaultState(program);
            toast.success("Success");
        } else {
            toast.error("Failed");
        }
    }

    async function releaseAllUsers() {
        if (!program || !wallet.publicKey) return;
        try {
            const users = await program.account.user.all();
            const vault = await getVaultPda();
            const vaultData = await program.account.vault.fetch(vault) as VaultData;

            let txSignatures = await callReleaseUsers(
                wallet,
                program,
                users.map((user) => user.account.key),
                users.map((user) => (user.account as User).stakedItems.map((index) => vaultData.nftItems[index].mint)),
            );

            if (txSignatures) {
                setVaultState(program);
                toast.success("Success");
            } else {
                toast.error("Failed");
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed");
        }
    }
    if (wallet.connected && role) {
        return (
            <div className="min-h-screen text-white">
                <div className="container mx-auto h-auto">
                    <div className="flex flex-col items-center w-full h-full font-narrow bg-[#00000080] p-2 rounded-md text-primary">
                        <h1 className="text-4xl my-5">Admin</h1>
                        <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                            <h1 className="text-2xl">NFT Vault</h1>
                            <h1 className="text-2xl mt-5">Total Staked: {totalStaked}</h1>
                            {role > 1 && <>
                                <label htmlFor="creatorAddress">Creator Address</label>
                                <input
                                    className="shadow appearance-none border rounded py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                                    type="text"
                                    id="creatorAddress"
                                    value={creatorAddress}
                                    onChange={(e) => setCreatorAddress(e.target.value)}
                                />
                                <label htmlFor="xpRate">XP Rate</label>
                                <input
                                    className="shadow appearance-none border rounded py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                                    type="text"
                                    id="xpRate"
                                    value={creatorAddress}
                                    onChange={(e) => setXpRate(parseFloat(e.target.value) || 0)}
                                />
                                {badges.map((badge, index) => (
                                    <div key={badge} className='flex gap-2 items-center'>
                                        <label htmlFor={badge}>{badge}</label>
                                        <input
                                            className="shadow appearance-none border rounded py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                                            type="text"
                                            id={badge}
                                            value={badgeCounts[index]}
                                            onChange={(e) => {
                                                const newBadgeCounts = [...badgeCounts];
                                                newBadgeCounts[index]  = parseInt(e.target.value);
                                                setBadgeCounts(newBadgeCounts);
                                            }}
                                        />
                                    </div>
                                ))}
                                {levels.map((level, index) => (
                                    <div key={level} className='flex gap-2 items-center'>
                                        <label htmlFor={level}>{level}</label>
                                        <input
                                            className="shadow appearance-none border rounded py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                                            type="text"
                                            id={level}
                                            value={multipliers[index]}
                                            onChange={(e) => {
                                                const newMultipliers = [...multipliers];
                                                newMultipliers[index]  = parseFloat(e.target.value);
                                                setMultipliers(newMultipliers);
                                            }}
                                        />
                                    </div>
                                ))}
                            </>}
                            {!vault ?
                                <button className="stake-button mt-2" onClick={initializeVault}>
                                    Create Vault
                                </button> :
                                <>
                                    <button className="stake-button mt-2" onClick={updateVault}>
                                        Update Vault
                                    </button>
                                    <button className="stake-button mt-2" onClick={closeVault}>
                                        Close Vault
                                    </button>
                                </>
                            }

                        </div>
                        <button className="stake-button mt-2" onClick={closeUser}>
                            Close My User
                        </button>
                        <button className="stake-button mt-2" onClick={closeAllUsers}>
                            Close All Users
                        </button>
                        {vault && (
                            <>
                                <div className="mt-5 w-1/2 h-1/2 flex flex-col items-center justify-center">
                                    <button className="stake-button mt-2 text-red" onClick={releaseAllUsers}>
                                        Release All Users
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="bg-background">
                <div className="container mx-auto h-screen">
                    <div className="flex flex-col items-center justify-center w-full h-[calc(100vh_-_112px)] gap-5">
                        <h1 className="text-3xl text-white">Connect a verified wallet to access the admin panel</h1>
                        <WalletMultiButton className="base-button" />
                    </div>
                </div>
            </div>
        );
    }
};