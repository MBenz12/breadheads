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

const ONE_ONES = [
  "2XmuyrTScqJqQ2zQQC2p1sGFCP1UYuuEnPqvNLqFrrZp",
  "2YfHz6AJBxmKfnTrubqiHZGjFHwLEcb1oBiBoxaH9aUm",
  "2eVh3spbUKGDF5f2Y3rP1fcoBWsygQzqUnPCv6w87Pyk",
  "3AZMq4J1cdDov34DuPwjByzKdNvorJYWBa3xhZpPmgiH",
  "3rrqxwzU7xfhL8jr6HGpm38wJY6nxuyk6ohT8PAXYHnH",
  "5GyCAdHVcLE8nC2uD3KLofeysA7hXXK4wbw4G1PWZMAs",
  "5Pry6F1TWX7rY87RssbjXNxtbo5BMvoz88eAqfAabuby",
  "62NtWcVYhPG1Suin8zF6EbEdoTx8W54HsciWTBAFArp9",
  "69YK8pyPYz1ivomZn1TXW9c3AqENsuJPVg52tJcRKmuA",
  "9E6GsY9rQAUAVG6sgYLB1DELQQa7AyhtWybn1pSKFFWu",
  "9S5gZBf9PqQUZiRCM8AAhYyxzhBivMoXp7WU57zZ7r61",
  "AK7xCXpiTgmxk8wTZZptGUL8J3RqvCujhebXZ3mg2pbw",
  "BD7Nkqmmat2J7289wYQkb9cWmDyyYEki5mz5SPFhFyCc",
  "BjxpcFJA2TMosxBM9CC17hxoatuoUe46s9r36LC8FsR1",
  "C9vh7v6p4zb7kyN4KcYehtr587Hoj2pSktY8Tsm1uDHU",
  "CPGSUygSvxnFiJHgCbXjBRuAw8vT5zptYUkfhhnEsR9s",
  "DFbFjrkHPLwtRvBHSxAky82UrPEBLSdWzH6nPuNe7h6z",
  "DJ4T4ZxkNqLU86taL568EayfwF2ybMm3JLPNhdhAc38Z",
  "FGq1oNxWyPfsnnGkyExxfdR1WXcpnQECTWPVuHbBudtQ",
  "GdyzhkP9h1QbMvgcZVsYYqVVWJeMZ8XviRREs856h6A",
  "HTZxz6DVyQuLKfNH3XasH2zDYVuWG3uRT3pVwK9TbZ1d",
  "HaNXfUrpjBwko6vn8Zr8zunHxpr4cYveMcMK3VWLeGhc",
  "HhsCdxppregUakAREv3EsJt3mG5mvZYXjRXwnrfP3NZ1"
];
export const getOneOneIndex = (mint: PublicKey) => {
  let index = ONE_ONES.indexOf(mint.toString());
  return index === -1 ? ONE_ONES.length : index;
}