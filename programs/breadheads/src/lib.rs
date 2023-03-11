mod state;
mod util;

use anchor_lang::prelude::*;

declare_id!("BpBkYpEAd8vr4FynZE8g8Rrmwcr8BKS1Q8XFe7aL2tBL");

#[program]
pub mod breadheads {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
