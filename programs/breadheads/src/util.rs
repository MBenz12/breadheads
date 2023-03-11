use anchor_lang::prelude::*;

pub fn now() -> u64 {
    Clock::get().unwrap().unix_timestamp.try_into().unwrap()
}
