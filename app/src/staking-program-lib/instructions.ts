/*
 * Staking Program Instruction Get helper functions.
 */

import { PROGRAM_ID as METADATA_PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';
import { Program } from "@project-serum/anchor";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { Breadheads } from 'idl/breadheads';
import {
  getEditionAccount, getMetadataAccount, getVaultPda, getUserPda, getTokenVaultPda,
} from "./utils";


export const getInitializeVaultInstruction = async (
  program: Program<Breadheads>,
  authorityKey: PublicKey,
  creatorAddress: PublicKey,
) => {
  const vault = await getVaultPda();
  const [tokenVault, bump] = await getTokenVaultPda(vault);
  return await program.methods
    .initializeVault(
      creatorAddress,
      bump,
    )
    .accounts({
      authority: authorityKey,
      vault,
      tokenVault,
    })
    .instruction();
};

export const getUpdateVaultInstruction = async (
  program: Program<Breadheads>,
  authorityKey: PublicKey,
  creatorAddress: PublicKey,
  xpRate: number,
  badgeCounts: Array<number>,
  multipliers: Array<number>,
) => {
  const vault = await getVaultPda();
  return await program.methods
    .updateVault(
      creatorAddress,
      xpRate,
      badgeCounts,
      multipliers,
    )
    .accounts({
      authority: authorityKey,
      vault,
    })
    .instruction();
};

export const getCreateUserInstruction = async (
  program: Program<Breadheads>,
  authority: PublicKey
) => {
  const vault = await getVaultPda();
  const [user] = await getUserPda(vault, authority);
  return await program.methods
    .createUser()
    .accounts({
      authority,
      user,
      vault,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
};

export const getStakeInstruction = async (
  program: Program<Breadheads>,
  staker: PublicKey,
  tokenMint: PublicKey,
) => {
  const vault = await getVaultPda();
  const [tokenVault] = await getTokenVaultPda(vault);
  const [user] = await getUserPda(vault, staker);
  const [metadata] = await getMetadataAccount(tokenMint);
  const edition = await getEditionAccount(tokenMint);
  const stakerAta = await getAssociatedTokenAddress(tokenMint, staker);
  const instruction = await program.methods
    .stake()
    .accounts({
      staker,
      user,
      vault,
      tokenVault,
      tokenMint,
      stakerAta,
      edition,
      metadata,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      metadataProgram: METADATA_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .instruction();

  return instruction;
};

export const getUnstakeInstruction = async (
  program: Program<Breadheads>,
  staker: PublicKey,
  tokenMint: PublicKey,
  authority?: PublicKey,
) => {
  const vault = await getVaultPda();
  const [tokenVault] = await getTokenVaultPda(vault);
  const [user] = await getUserPda(vault, staker);
  const edition = await getEditionAccount(tokenMint);
  const stakerAta = await getAssociatedTokenAddress(tokenMint, staker);
  return await program.methods
    .unstake()
    .accounts({
      signer: authority || staker,
      staker,
      user,
      vault,
      tokenVault,
      tokenMint,
      stakerAta,
      edition,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY,
      metadataProgram: METADATA_PROGRAM_ID,
    })
    .instruction();
};

export const getClosePdaInstruction = async (
  program: Program<Breadheads>,
  authority: PublicKey,
  pda: PublicKey,
) => {
  return await program.methods
    .closePda()
    .accounts({
      signer: authority,
      pda,
      systemProgram: SystemProgram.programId
    })
    .instruction();
}
