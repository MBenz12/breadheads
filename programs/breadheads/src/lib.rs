mod ins;
mod state;
mod util;
use anchor_lang::prelude::*;

use crate::ins::*;

declare_id!("BpBkYpEAd8vr4FynZE8g8Rrmwcr8BKS1Q8XFe7aL2tBL");

#[program]
pub mod breadheads {
    use super::*;

    pub fn initialize_vault(ctx: Context<InitializeVault>, bump: u8) -> Result<()> {
        let vault = &mut ctx.accounts.vault.load_init()?;
        vault.authority = ctx.accounts.authority.key();
        vault.bump = bump;

        Ok(())
    }

    pub fn create_user(ctx: Context<CreateUser>) -> Result<()> {
        let user  = &mut ctx.accounts.user;
        user.init(ctx.accounts.authority.key(), *ctx.bumps.get("user").unwrap());

        Ok(())
    }
}