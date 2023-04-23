mod ins;
mod state;
mod util;

use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke_signed;
use mpl_token_metadata::instruction::{freeze_delegated_account, thaw_delegated_account};
use spl_token_metadata::state::Metadata;

use crate::ins::*;
use crate::state::CustomError;

declare_id!("E8D44KvNHsDZDxpUkaYo8yZgraQNBgCdXcD7jwJRTF3K");

#[program]
pub mod breadheads {
    use super::*;

    pub fn initialize_vault(
        ctx: Context<InitializeVault>,
        nft_creator: Pubkey,
        bump: u8,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault.load_init()?;
        vault.init(
            ctx.accounts.authority.key(), 
            nft_creator,
            bump,
        );

        Ok(())
    }

    pub fn update_vault(
        ctx: Context<UpdateVault>,
        nft_creator: Pubkey,
        xp_rate: u32,
        badge_counts: [u8; 3],
        multipliers: [u32; 3],
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault.load_mut()?;
        vault.update(nft_creator, xp_rate, badge_counts, multipliers);

        Ok(())
    }

    pub fn create_user(ctx: Context<CreateUser>) -> Result<()> {
        let user = &mut ctx.accounts.user;
        user.init(
            ctx.accounts.authority.key(),
            *ctx.bumps.get("user").unwrap(),
        );

        Ok(())
    }

    pub fn stake(ctx: Context<Stake>) -> Result<()> {
        let vault = &mut ctx.accounts.vault.load_mut()?;
        let user = &mut ctx.accounts.user;

        let metadata = Metadata::from_account_info(&ctx.accounts.metadata).unwrap();
        let creators = metadata.data.creators.unwrap();

        require_eq!(
            creators
                .iter()
                .any(|x| x.verified && x.address == vault.nft_creator),
            true,
            CustomError::WrongNFTCreator
        );

        let list: Vec<&str> = metadata.data.name.split('#').collect();
        let name = list[1].replace("\0", "").parse().unwrap();

        let is_one_one = util::is_one_one(ctx.accounts.token_mint.key());
        let index = vault.stake(ctx.accounts.token_mint.key(), name);
        user.stake(vault, index, is_one_one);

        let cpi_context = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            anchor_spl::token::Approve {
                to: ctx.accounts.staker_ata.to_account_info().clone(),
                delegate: ctx.accounts.token_vault.to_account_info(),
                authority: ctx.accounts.staker.to_account_info(),
            },
        );

        anchor_spl::token::approve(cpi_context, 1)?;

        let vault_key = ctx.accounts.vault.key();
        let bump = vault.bump;
        let seeds = &[b"vault".as_ref(), vault_key.as_ref(), &[bump]];

        invoke_signed(
            &freeze_delegated_account(
                ctx.accounts.metadata_program.key(),
                ctx.accounts.token_vault.key(),
                ctx.accounts.staker_ata.key(),
                ctx.accounts.edition.key(),
                ctx.accounts.token_mint.key(),
            ),
            &[
                ctx.accounts.token_vault.to_account_info(),
                ctx.accounts.staker_ata.to_account_info(),
                ctx.accounts.edition.to_account_info(),
                ctx.accounts.token_mint.to_account_info(),
            ],
            &[seeds],
        )?;

        Ok(())
    }

    pub fn unstake(ctx: Context<Unstake>) -> Result<()> {
        let vault = &mut ctx.accounts.vault.load_mut()?;
        let user = &mut ctx.accounts.user;

        require_eq!(
            ctx.accounts.signer.key() == ctx.accounts.staker.key()
                || ctx.accounts.signer.key() == vault.authority,
            true,
            CustomError::Unauthorized
        );

        let is_one_one = util::is_one_one(ctx.accounts.token_mint.key());
        let index = vault.unstake(ctx.accounts.token_mint.key());
        user.unstake(vault, index, is_one_one);

        let vault_key = ctx.accounts.vault.key();
        let bump = vault.bump;
        let seeds = &[b"vault".as_ref(), vault_key.as_ref(), &[bump]];

        invoke_signed(
            &thaw_delegated_account(
                ctx.accounts.metadata_program.key(),
                ctx.accounts.token_vault.key(),
                ctx.accounts.staker_ata.key(),
                ctx.accounts.edition.key(),
                ctx.accounts.token_mint.key(),
            ),
            &[
                ctx.accounts.token_vault.to_account_info(),
                ctx.accounts.staker_ata.to_account_info(),
                ctx.accounts.edition.to_account_info(),
                ctx.accounts.token_mint.to_account_info(),
            ],
            &[seeds],
        )?;

        if ctx.accounts.staker.key() == ctx.accounts.signer.key() {
            let cpi_context = CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                anchor_spl::token::Revoke {
                    source: ctx.accounts.staker_ata.to_account_info(),
                    authority: ctx.accounts.staker.to_account_info(),
                },
            );

            anchor_spl::token::revoke(cpi_context)?;
        }

        Ok(())
    }

    pub fn close_pda(ctx: Context<ClosePda>) -> Result<()> {
        let dest_account_info = ctx.accounts.signer.to_account_info();
        let source_account_info = ctx.accounts.pda.to_account_info();
        let dest_starting_lamports = dest_account_info.lamports();
        **dest_account_info.lamports.borrow_mut() = dest_starting_lamports
            .checked_add(source_account_info.lamports())
            .unwrap();
        **source_account_info.lamports.borrow_mut() = 0;

        Ok(())
    }
}
