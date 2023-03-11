use anchor_lang::prelude::*;

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

