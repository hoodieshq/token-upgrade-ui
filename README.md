# token-upgrade-ui

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhoodieshq%2Ftoken-upgrade-ui&env=NEXT_PUBLIC_TOKEN_UPGRADE_PROGRAM_ID&envDescription=Upgrade%20Program%20Address&project-name=solana-token-upgrade-app&repository-name=solana-token-upgrade-app&demo-title=Token%20Upgrade%20UI&demo-description=App%20to%20Upgrade%20Token%20on%20Solana%20Blockchain)

This document covers the usage of Token Upgrade UI project.

## Contents

Project consists of:

- App package - Demo application powered by Next.js which demonstrates the usage of Token Upgrade UI
- UI package - Token Upgrade UI component powered by React
- Scripts - Utility scripts 

## Usage

### Requirements

To make things work, you need this:

- [Token Upgrade Program](https://github.com/solana-labs/solana-program-library/tree/master/token-upgrade) deployed
- As token owner,
    - you have to create escrow account for the program (see the [create-escrow](https://github.com/solana-labs/solana-program-library/blob/master/token-upgrade/cli/src/main.rs#L395)) 
    - you should mint enough of "New mint" token to the escrow

#### Preparation

Repository [contains script](./scripts/issue-tokens.mts) to mint the "Old token" to the holder's wallet and top-up enough of "New token" to the escrow.

```sh
SOLANA_TOKEN_UPGRADE_CLI=<%path_to_upgrade_cli%> pnpx tsx ./scripts/issue-tokens.mts $HOLDER_ADDRESS
# use address of your Phantom's wallet for ex.
```

> Note: Script utilizes `spl-token-upgrade` cli from the solana-program-library. 

Do not forget to declare proper id at the [source code](https://github.com/solana-labs/solana-program-library/blob/master/token-upgrade/program/src/lib.rs#L15).

##### Example

Here is the sample of script's output.

```sh
Creating mint
Mint created: HoKw8CavcPjnd4QpFkvMyetz9bpQ9AqUJRjFqbjjnjqY
Creating ATA to hold the mint
Token Account Dejd9iw68G5wjtdu87b2qg2YcJJnruHNJQdJ8fPYbPs4 created
Creating mint
Mint created: DV389z9WBcYVmYLSBQCxi22mRv2pVosorqSMAuAJbTxQ
Creating ATA to hold the mint
Token-2022 Account 9jVB4ovwNaTnCZqXKDHTKHRh2fAG9PU4VCm3kjbDyP87 created
Creating account for holder to store the token
Holder account created
Minting 1 of HoKw8CavcPjnd4QpFkvMyetz9bpQ9AqUJRjFqbjjnjqY to 86kiRdNWM7CNp4wqSpKR7UH5eDRYn7Rfb5JWf73ecqdu
Token minted: s4nQjX9F9qx4E6UPNc2yYq49KP333gc9gEcBK5MTEZENurBYAZdbwcJHKBVsAqhAJWn7BJ2v2zX8PNJWWuJVevX
|> Creating escrow account CRsajQtD7ZknkfypD9FhPfVh7uLkLTdmTAwtiManXQd3 owned by escrow authority DV5egMMZKAMVkS3EBuM8tPWYfy4ioTtMNWXi788Fh8kC
Signature: 5g16wj4owBXF5fZJYkKSuGB4Zb3Fb7iNC9HzJdr4gCGYi5HPUQYbZ7gTGyb3GTdjuxeLAjs5CAdVgCchKxLfGVHc


Escrow account created: CRsajQtD7ZknkfypD9FhPfVh7uLkLTdmTAwtiManXQd3
Minting 1 of DV389z9WBcYVmYLSBQCxi22mRv2pVosorqSMAuAJbTxQ to escrow
Token minted to escrow: 2fdHGHQ7PVxjA1WmRiGvdqjVkrd3kzsUv5pztVTcDCAzWikeJ1cQpgYYVJvXRKaCL4R8P211xSNngeEY1EKQ5Dfm
Success. HoKw8CavcPjnd4QpFkvMyetz9bpQ9AqUJRjFqbjjnjqY is eligible for upgrade.
Use this query string for demonstration: "?token=HoKw8CavcPjnd4QpFkvMyetz9bpQ9AqUJRjFqbjjnjqY&tokenExt=DV389z9WBcYVmYLSBQCxi22mRv2pVosorqSMAuAJbTxQ&escrow=CRsajQtD7ZknkfypD9FhPfVh7uLkLTdmTAwtiManXQd3"
```

You may use QueryString sample from the stdout to fill the necessary fields at the demo application.

### Setup

```typescript
import { TokenUpgrade } from "@solana/token-upgrade-ui"

const OuterComponent = () => (
  <TokenUpgrade
    escrow={/* escrow address */}
    onUpgradeStart={() =>
      console.log({ message: "Upgrading token..." })
    }
    onUpgradeEnd={({ signature }) =>
      console.log({
        message: "Token upgraded",
        link: `https://explorer.solana.com/tx/${signature}`,
      })
    }
    tokenAddress={/* token address to upgrade */}
    tokenExtAddress={/* token extension address */}
    tokenUpgradeProgramId={/* deployed upgrade program address */}
  />
)
``` 

### Commands

- `pnpm i` - Install
- `pnpm lint` - Check code-style
- `pnpm build` - Build the project
- `pnpm dev` - Start development in watch mode
- `pnpm playground` - Launch Storybook's environment
- `pnpm --filter "*" lint-fix` - Prettify source code
