use std::cell::RefMut;

use anchor_lang::prelude::*;

use crate::util::now;

pub const TOTAL_COLLECTION: usize = 3000;
pub const DECIMALS: u32 = 100;

#[account(zero_copy)]
pub struct Vault {
    pub authority: Pubkey,
    pub nft_items: [NftItem; TOTAL_COLLECTION],
    pub nft_creator: Pubkey,
    pub item_count: u32,
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
    pub fn init(&mut self, authority: Pubkey, nft_creator: Pubkey, bump: u8) {
        self.authority = authority;
        self.nft_creator = nft_creator;
        self.bump = bump;
        self.xp_rate = 5 * DECIMALS;
        self.badge_counts = [13, 26, 36];
        self.multipliers = [125u32, 150u32, 250u32];
    }

    pub fn update(&mut self, nft_creator: Pubkey, xp_rate: u32, badge_counts: [u8; 3], multipliers: [u32; 3]) {
        self.nft_creator = nft_creator;
        self.xp_rate = xp_rate;
        self.badge_counts = badge_counts;
        self.multipliers = multipliers;
    }

    pub fn stake(&mut self, mint: Pubkey, name: u32) -> usize {
        let now: u64 = now();
        let item_count = self.item_count as usize;
        for i in 0..item_count {
            if self.nft_items[i].mint == mint {
                self.nft_items[i].last_staked_time = now;
                self.staked_count = self.staked_count.checked_add(1).unwrap();
                return i;
            }
        }
        self.item_count = self.item_count.checked_add(1).unwrap();
        self.staked_count = self.staked_count.checked_add(1).unwrap();
        self.nft_items[item_count] = NftItem {
            mint,
            last_staked_time: now,
            staked_level: 0,
            name,
        };
        item_count
    }

    pub fn unstake(&mut self, mint: Pubkey) -> usize {
        let now: u64 = now();
        let item_count = self.item_count as usize;
        for i in 0..item_count {
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
        item_count
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
    pub staked_items: Vec<u32>,
    pub last_updated_time: u64,
    pub earned_xp: u32,
    pub one_one_count: u8,
    pub bump: u8,
}

impl User {
    pub const LEN: usize = std::mem::size_of::<User>() + 200 * 4;

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
            let staked_count = self.staked_items.len() + (self.one_one_count as usize) * 2;
            let mut multiplier = DECIMALS;
            for i in 0..vault.badge_counts.len() {
                if vault.badge_counts[i] as usize <= staked_count {
                    multiplier = vault.multipliers[i];
                }
            }
            let staked_time = now.checked_sub(self.last_updated_time).unwrap();
            let earned_xp: u32 = ((staked_time as f64)
                * (staked_count as f64)
                * (multiplier as f64)
                * (vault.xp_rate as f64)
                / (DECIMALS as f64)
                / 86400f64) as u32;
            self.earned_xp = self.earned_xp.checked_add(earned_xp).unwrap();
        }
        self.last_updated_time = now;
    }

    pub fn stake(&mut self, vault: &RefMut<Vault>, index: usize, is_one_one: bool) {
        self.update(vault);

        if self.staked_items.iter().any(|&x| x == index as u32) == false {
            self.staked_items.push(index as u32);
            if is_one_one {
                self.one_one_count = self.one_one_count.checked_add(1).unwrap();
            }
        }
    }

    pub fn unstake(&mut self, vault: &RefMut<Vault>, index: usize, is_one_one: bool) {
        self.update(vault);

        let index = self.staked_items.iter().position(|&x| x == index as u32);
        if let Some(index) = index {
            self.staked_items.remove(index);
            if is_one_one {
                self.one_one_count = self.one_one_count.checked_sub(1).unwrap();
            }
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
