use std::cell::RefMut;

use anchor_lang::prelude::*;

use crate::util::now;

pub const TOTAL_COLLECTION: usize = 5000;
pub const DECIMALS: u32 = 100;

#[account(zero_copy)]
pub struct Vault {
    pub authority: Pubkey,
    pub nft_items: [NftItem; TOTAL_COLLECTION],
    pub nft_creator: Pubkey,
    pub item_count: usize,
    pub staked_count: u32,
    pub xp_rate: u32,
    pub badge_counts: [u8; 3],
    pub multipliers: [u32; 3],
    pub bump: u8,
}

impl Default for Vault {
    fn default() -> Vault {
        Vault {
            authority: Pubkey::default(),
            nft_items: [NftItem::default(); TOTAL_COLLECTION],
            nft_creator: Pubkey::default(),
            item_count: 0,
            staked_count: 0,
            xp_rate: 5 * DECIMALS,
            badge_counts: [13, 26, 36],
            multipliers: [125, 150, 250],
            bump: 0,
        }
    }
}

impl Vault {
    pub fn stake(&mut self, mint: Pubkey, name: u32) -> usize {
        let now: u64 = now();
        for i in 0..self.item_count {
            if self.nft_items[i].mint == mint {
                self.nft_items[i].last_staked_time = now;
                self.staked_count = self.staked_count.checked_add(1).unwrap();
                return i;
            }
        }
        let i = self.item_count;
        self.item_count = self.item_count.checked_add(1).unwrap();
        self.staked_count = self.staked_count.checked_add(1).unwrap();
        self.nft_items[i] = NftItem {
            mint,
            last_staked_time: now,
            staked_level: 0,
            name,
        };
        i
    }

    pub fn unstake(&mut self, mint: Pubkey) -> usize {
        let now: u64 = now();
        for i in 0..self.item_count {
            let mut item = self.nft_items[i];
            if item.mint == mint {
                let staked_time = now.checked_sub(item.last_staked_time).unwrap();
                item.staked_level = item.staked_level.checked_add(staked_time as u32).unwrap();
                item.last_staked_time = 0;
                self.nft_items[i] = item;
                self.staked_count = self.staked_count.checked_sub(1).unwrap();
                return i;
            }
        }
        self.item_count
    }
}

#[zero_copy]
#[derive(PartialEq)]
pub struct NftItem {
    pub mint: Pubkey,
    pub last_staked_time: u64,
    pub staked_level: u32,
    pub name: u32,
}

impl Default for NftItem {
    fn default() -> NftItem {
        NftItem {
            mint: Pubkey::default(),
            last_staked_time: 0,
            staked_level: 0,
            name: 0,
        }
    }
}

#[account]
pub struct User {
    pub key: Pubkey,
    pub staked_items: Vec<usize>,
    pub last_updated_time: u64,
    pub earned_xp: u32,
    pub bump: u8,
}

impl User {
    pub const LEN: usize = std::mem::size_of::<User>();

    pub fn init(&mut self, key: Pubkey, bump: u8) {
        self.key = key;
        self.bump = bump;
        self.last_updated_time = 0;
        self.staked_items = vec![];
        self.earned_xp = 0;
    }

    pub fn update(&mut self, vault: &RefMut<Vault>) {
        let now: u64 = now();
        if self.last_updated_time > 0 {
            let staked_count = self.staked_items.len();
            let index = vault
                .badge_counts
                .iter()
                .position(|&x| x as usize >= staked_count);
            let multiplier = if let Some(index) = index {
                vault.multipliers[index]
            } else {
                DECIMALS
            };
            let staked_time = now.checked_sub(self.last_updated_time).unwrap();
            let earned_xp: u32 =
                ((staked_time as f64) * (staked_count as f64) * (multiplier as f64)
                    / (DECIMALS as f64)
                    * (vault.xp_rate as f64)
                    / (DECIMALS as f64)
                    / 86400f64) as u32;
            self.earned_xp = self.earned_xp.checked_add(earned_xp).unwrap();
        }
        self.last_updated_time = now;
    }

    pub fn stake(&mut self, vault: &RefMut<Vault>, index: usize) {
        self.update(vault);

        if self.staked_items.iter().any(|x| x == &index) == false {
            self.staked_items.push(index);
        }
    }

    pub fn unstake(&mut self, vault: &RefMut<Vault>, index: usize) {
        self.update(vault);

        if self.staked_items.iter().any(|x| x == &index) {
            self.staked_items.remove(index);
        }
    }
}

#[error_code]
pub enum CustomError {
    #[msg("Wrong NFT Creator")]
    WrongNFTCreator,
    #[msg("Unauthorized access")]
    Unauthorized,
}
