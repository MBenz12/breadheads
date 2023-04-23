import { Program } from "@project-serum/anchor";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { VAULT_NAME } from "config";
import { Breadheads } from "idl/breadheads";
import { getClosePdaInstruction, getCreateUserInstruction, getInitializeVaultInstruction, getStakeInstruction, getUnstakeInstruction, getUpdateVaultInstruction } from "./instructions";
import { getVaultPda, VAULT_POOL_SIZE } from "./utils";

export async function callCreateUser(
  wallet: WalletContextState,
  program: Program<Breadheads>,
) {
  if (!wallet.publicKey) return;
  try {
    const transaction = new Transaction();

    transaction.add(
      await getCreateUserInstruction(program, wallet.publicKey)
    );

    const txSignature = await wallet.sendTransaction(transaction, program.provider.connection, { skipPreflight: true });
    await program.provider.connection.confirmTransaction(txSignature, "confirmed");
    return txSignature;
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function callStake(
  wallet: WalletContextState,
  program: Program<Breadheads>,
  mint: PublicKey,
) {
  if (!wallet.publicKey) return;
  try {
    const transaction = new Transaction();
    transaction.add(
      await getStakeInstruction(program, wallet.publicKey, mint)
    );
    const txSignature = await wallet.sendTransaction(transaction, program.provider.connection, { skipPreflight: true });
    await program.provider.connection.confirmTransaction(txSignature, "confirmed");
    return txSignature;
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function callStakeAll(
  wallet: WalletContextState,
  program: Program<Breadheads>,
  mints: PublicKey[],
) {
  if (!wallet.signAllTransactions || !wallet.publicKey) return;
  try {
    const txns = [];
    let transaction = new Transaction();
    let cnt = 0;
    for (const mint of mints) {
      transaction.add(
        await getStakeInstruction(program, wallet.publicKey, mint)
      );
      cnt++;
      if (cnt % 5 === 0) {
        txns.push(transaction);
        transaction = new Transaction();
      }
    }
    if (cnt % 5 && transaction.instructions.length) txns.push(transaction);
    const recentBlockhash = await (await program.provider.connection.getLatestBlockhash('finalized')).blockhash;
    for (const transaction of txns) {
      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = recentBlockhash;
    }
    const signedTxns = await wallet.signAllTransactions(txns);
    const txSignatures = [];
    for (const signedTxn of signedTxns) {
      const txSignature = await program.provider.connection.sendRawTransaction(signedTxn.serialize());
      txSignatures.push(txSignature);
    }
    for (const txSignature of txSignatures) {
      await program.provider.connection.confirmTransaction(txSignature, "confirmed");
    }
    return txSignatures;
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function callUnstake(
  wallet: WalletContextState,
  program: Program<Breadheads>,
  mint: PublicKey,
) {
  if (!wallet.publicKey) return;
  try {
    const transaction = new Transaction();
    transaction.add(
      await getUnstakeInstruction(program, wallet.publicKey, mint)
    );
    const txSignature = await wallet.sendTransaction(transaction, program.provider.connection, { skipPreflight: true });
    await program.provider.connection.confirmTransaction(txSignature, "confirmed");
    return txSignature;
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function callReleaseUsers(
  wallet: WalletContextState,
  program: Program<Breadheads>,
  users: PublicKey[],
  mints_per_user: PublicKey[][],
) {
  if (!wallet.publicKey || !wallet.signAllTransactions) return;
  try {
    const txns = [];
    let transaction = new Transaction();
    let cnt = 0;

    let i = 0;
    console.log(mints_per_user);
    for (const mints of mints_per_user) {
      const user = users[i];
      console.log("user: ", user.toString());
      for (const mint of mints) {
        console.log(" mint: ", mint.toString())
        transaction.add(
          await getUnstakeInstruction(program, user, mint, wallet.publicKey)
        );
        cnt += 1;
        if (cnt % 5 === 0) {
          txns.push(transaction);
          transaction = new Transaction();
        }
      }
      i++;
    }
    if (cnt % 5 && transaction.instructions.length) txns.push(transaction);
    console.log(txns);
    const recentBlockhash = await (await program.provider.connection.getLatestBlockhash('finalized')).blockhash;
    for (const transaction of txns) {
      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = recentBlockhash;
    }
    const signedTxns = await wallet.signAllTransactions(txns);
    const txSignatures = [];
    for (const signedTxn of signedTxns) {
      const txSignature = await program.provider.connection.sendRawTransaction(signedTxn.serialize(), { skipPreflight: true });
      txSignatures.push(txSignature);
      console.log(txSignature);
    }
    for (const txSignature of txSignatures) {
      await program.provider.connection.confirmTransaction(txSignature, "confirmed");
    }
    return txSignatures;
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function callUnstakeAll(
  wallet: WalletContextState,
  program: Program<Breadheads>,
  mints: PublicKey[],
) {
  if (!wallet.publicKey || !wallet.signAllTransactions) return;
  try {
    const txns = [];
    let transaction = new Transaction();
    let cnt = 0;
    for (const mint of mints) {
      transaction.add(
        await getUnstakeInstruction(program, wallet.publicKey, mint)
      );
      cnt++;
      if (cnt % 6 === 0) {
        txns.push(transaction);
        transaction = new Transaction();
      }
    }
    if (cnt % 6 && transaction.instructions.length) txns.push(transaction);
    const recentBlockhash = await (await program.provider.connection.getLatestBlockhash('finalized')).blockhash;
    for (const transaction of txns) {
      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = recentBlockhash;
    }
    const signedTxns = await wallet.signAllTransactions(txns);
    const txSignatures = [];
    for (const signedTxn of signedTxns) {
      const txSignature = await program.provider.connection.sendRawTransaction(signedTxn.serialize(), { skipPreflight: true });
      txSignatures.push(txSignature);
    }
    for (const txSignature of txSignatures) {
      await program.provider.connection.confirmTransaction(txSignature, "confirmed");
    }
    return txSignatures;
  } catch (error) {
    console.log(error);
    return;
  }
}

// Authority functions
export async function callInitializeVault(
  wallet: WalletContextState,
  program: Program<Breadheads>,
  creatorAddress: PublicKey,
) {
  try {
    if (!wallet.publicKey) return;
    const transaction = new Transaction();
    const vault = await getVaultPda();
    transaction.add(
      SystemProgram.createAccountWithSeed({
        fromPubkey: wallet.publicKey,
        basePubkey: wallet.publicKey,
        seed: VAULT_NAME,
        newAccountPubkey: vault,
        lamports: await program.provider.connection.getMinimumBalanceForRentExemption(
          VAULT_POOL_SIZE
        ),
        space: VAULT_POOL_SIZE,
        programId: program.programId,
      })
    )
    transaction.add(
      await getInitializeVaultInstruction(
        program,
        wallet.publicKey,
        creatorAddress,
      )
    );
    const txSignature = await wallet.sendTransaction(transaction, program.provider.connection, { skipPreflight: true });
    await program.provider.connection.confirmTransaction(txSignature, "confirmed");
    return txSignature;
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function callUpdateVault(
  wallet: WalletContextState,
  program: Program<Breadheads>,
  creatorAddress: PublicKey,
  xpRate: number,
  badgeCounts: Array<number>,
  multipliers: Array<number>,
) {
  try {
    if (!wallet.publicKey) return;
    const transaction = new Transaction();
    transaction.add(
      await getUpdateVaultInstruction(
        program,
        wallet.publicKey,
        creatorAddress,
        xpRate,
        badgeCounts,
        multipliers,
      )
    );
    const txSignature = await wallet.sendTransaction(transaction, program.provider.connection, { skipPreflight: true });
    await program.provider.connection.confirmTransaction(txSignature, "confirmed");
    return txSignature;
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function callClosePda(
  wallet: WalletContextState,
  program: Program<Breadheads>,
  pda: PublicKey,
) {
  if (!wallet.publicKey) return;
  try {
    const transaction = new Transaction();
    transaction.add(
      await getClosePdaInstruction(program, wallet.publicKey, pda)
    );
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = await (await program.provider.connection.getLatestBlockhash('finalized')).blockhash;
    const txSignature = await wallet.sendTransaction(transaction, program.provider.connection);
    await program.provider.connection.confirmTransaction(txSignature, "confirmed");
    return txSignature;
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function callClosePdas(
  wallet: WalletContextState,
  program: Program<Breadheads>,
  pdas: Array<PublicKey>,
) {
  if (!wallet.publicKey || !wallet.signAllTransactions) return;
  try {
    const txns = [];
    let transaction = new Transaction();
    let cnt = 0;
    for (const pda of pdas) {
      transaction.add(
        await getClosePdaInstruction(program, wallet.publicKey, pda)
      );
      cnt++;
      if (cnt % 10 === 0) {
        txns.push(transaction);
        transaction = new Transaction();
      }
    }
    if (cnt % 10 && transaction.instructions.length) txns.push(transaction);
    const recentBlockhash = await (await program.provider.connection.getLatestBlockhash('finalized')).blockhash;
    for (const transaction of txns) {
      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = recentBlockhash;
    }
    const signedTxns = await wallet.signAllTransactions(txns);
    const txSignatures = [];
    for (const signedTxn of signedTxns) {
      const txSignature = await program.provider.connection.sendRawTransaction(signedTxn.serialize(), { skipPreflight: true });
      txSignatures.push(txSignature);
    }
    for (const txSignature of txSignatures) {
      await program.provider.connection.confirmTransaction(txSignature, "confirmed");
    }
    return txSignatures;
  } catch (error) {
    console.log(error);
    return;
  }
}