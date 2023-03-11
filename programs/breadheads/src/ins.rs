use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, TokenAccount, Token};

use crate::state::*;

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct InitializeVault<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(zero)]
    pub vault: AccountLoader<'info, Vault>,

    #[account(
        seeds = [
            b"vault".as_ref(),
            vault.key().as_ref(),
        ],
        bump,
    )]
    pub token_vault: SystemAccount<'info>,
}

#[derive(Accounts)]
pub struct CreateUser<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        seeds = [
            b"user".as_ref(),
            vault.key().as_ref(),
            authority.key().as_ref(),
        ],
        bump,
        space = User::LEN + 8,
    )]
    pub user: Account<'info, User>,

    pub vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(mut)]
    pub staker: Signer<'info>,

    #[account(mut)]
    pub vault: AccountLoader<'info, Vault>,
    
    #[account(
        mut,
        seeds = [
            b"user".as_ref(),
            vault.key().as_ref(),
            user.key.as_ref(),
        ],
        bump = user.bump
    )]
    pub user: Account<'info, User>,

    #[account(
        seeds = [
            b"vault".as_ref(),
            vault.key().as_ref(),
        ],
        bump = vault.load()?.bump,
    )]
    pub token_vault: SystemAccount<'info>,

    pub token_mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = staker,
    )]
    pub staker_ata: Box<Account<'info, TokenAccount>>,

    pub metadata: SystemAccount<'info>,

    pub edition: SystemAccount<'info>,
    
    pub metadata_program: SystemAccount<'info>,

    pub system_program: Program<'info, System>,

    pub token_program: Program<'info, Token>,
    
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub staker: SystemAccount<'info>,

    #[account(mut)]
    pub vault: AccountLoader<'info, Vault>,
    
    #[account(
        mut,
        seeds = [
            b"user".as_ref(),
            vault.key().as_ref(),
            user.key.as_ref(),
        ],
        bump = user.bump
    )]
    pub user: Account<'info, User>,

    #[account(
        seeds = [
            b"vault".as_ref(),
            vault.key().as_ref(),
        ],
        bump = vault.load()?.bump
    )]
    pub token_vault: SystemAccount<'info>,

    pub token_mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = staker,
    )]
    pub staker_ata: Box<Account<'info, TokenAccount>>,

    pub edition: SystemAccount<'info>,

    pub metadata_program: SystemAccount<'info>,

    pub system_program: Program<'info, System>,

    pub token_program: Program<'info, Token>,

    pub rent: Sysvar<'info, Rent>,
}