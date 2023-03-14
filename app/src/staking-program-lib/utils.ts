import { PROGRAM_ID as METADATA_PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';
import { PublicKey } from '@solana/web3.js';
import { VAULT_NAME, VERIFIED_WALLETS } from 'config';
import idl from 'idl/breadheads.json';

export const VAULT_POOL_SIZE = 144112;

export const getUserPda = async (
  vault: PublicKey,
  user: PublicKey,
  programId: PublicKey = new PublicKey(idl.metadata.address)
) => {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from("user"),
      vault.toBuffer(),
      user.toBuffer()
    ],
    programId
  );
};

export const getTokenVaultPda = async (
  vault: PublicKey,
  programId: PublicKey = new PublicKey(idl.metadata.address)
) => {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from("vault"),
      vault.toBuffer(),
    ],
    programId
  );
}

export const getEditionAccount = async (mint: PublicKey) => {
  const [edition] = await PublicKey.findProgramAddress(
    [
      Buffer.from("metadata"),
      METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from("edition"),
    ],
    METADATA_PROGRAM_ID
  );
  return edition;
}

export const getVaultPda = async (
  programId: PublicKey = new PublicKey(idl.metadata.address)
) => {
  const creator = new PublicKey("3qWq2ehELrVJrTg2JKKERm67cN6vYjm1EyhCEzfQ6jMd")
  return await PublicKey.createWithSeed(
    creator,
    VAULT_NAME,
    programId
  );
};


export const getMetadataAccount = async (
  mintKey: PublicKey
): Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from("metadata", "utf8"),
      METADATA_PROGRAM_ID.toBuffer(),
      mintKey.toBuffer(),
    ],
    METADATA_PROGRAM_ID
  );
};


// @ts-ignore
export const getRole = (key: string) => VERIFIED_WALLETS[key]