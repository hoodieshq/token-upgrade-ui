use anchor_lang::prelude::*;

declare_id!("L2UVZtesbRAzi6Yw8qo8kUjh6V2m48ZN5vbk3yasYZA");

#[program]
pub mod token_upgrade_ui {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
