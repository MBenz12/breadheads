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

    /// CHECK:
    #[account(
        init_if_needed,
        payer = authority,
        seeds = [
            b"vault".as_ref(),
            vault.key().as_ref(),
        ],
        bump,
        space = 0,
    )]
    pub token_vault: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateVault<'info> {
    #[account(mut, address = vault.load()?.authority)]
    pub authority: Signer<'info>,

    #[account(mut)]
    pub vault: AccountLoader<'info, Vault>,
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
    pub user: Box<Account<'info, User>>,

    pub vault: AccountLoader<'info, Vault>,

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
    pub user: Box<Account<'info, User>>,

    /// CHECK:
    #[account(
        mut,
        seeds = [
            b"vault".as_ref(),
            vault.key().as_ref(),
        ],
        bump = vault.load()?.bump,
    )]
    pub token_vault: AccountInfo<'info>,

    pub token_mint: Box<Account<'info, Mint>>,

    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = staker,
    )]
    pub staker_ata: Box<Account<'info, TokenAccount>>,

    /// CHECK:
    pub metadata: AccountInfo<'info>,

    /// CHECK:
    pub edition: AccountInfo<'info>,
    
    /// CHECK:
    pub metadata_program: AccountInfo<'info>,

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
    pub user: Box<Account<'info, User>>,

    /// CHECK:
    #[account(
        mut,
        seeds = [
            b"vault".as_ref(),
            vault.key().as_ref(),
        ],
        bump = vault.load()?.bump
    )]
    pub token_vault: AccountInfo<'info>,

    pub token_mint: Box<Account<'info, Mint>>,

    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = staker,
    )]
    pub staker_ata: Box<Account<'info, TokenAccount>>,

    /// CHECK:
    pub edition: AccountInfo<'info>,
    
    /// CHECK:
    pub metadata_program: AccountInfo<'info>,

    pub system_program: Program<'info, System>,

    pub token_program: Program<'info, Token>,

    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct ClosePda<'info> {
    #[account(mut, address = "3qWq2ehELrVJrTg2JKKERm67cN6vYjm1EyhCEzfQ6jMd".parse::<Pubkey>().unwrap())]
    pub signer: Signer<'info>,

    /// CHECK:
    #[account(mut)]
    pub pda: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}