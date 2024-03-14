# token-upgrade-ui

[![Deploy App with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhoodieshq%2Ftoken-upgrade-ui%2Ftree%2Fmain&project-name=solana-token-upgrade-app&repository-name=solana-token-upgrade-app&demo-title=Token%20Upgrade%20App&demo-description=App%20to%20Upgrade%20Token%20on%20Solana%20Blockchain)
[Deploy Storybook with Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhoodieshq%2Ftoken-upgrade-ui%2Ftree%2Fmain%2Fpackages%2Fui&project-name=solana-token-upgrade-ui&repository-name=solana-token-upgrade-ui&demo-title=Token%20Upgrade%20UI&demo-description=UI%20for%20Upgrade%20Token%20on%20Solana%20Blockchain)

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
