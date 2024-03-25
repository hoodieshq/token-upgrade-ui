# token-upgrade-ui

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
pnpx tsx ./scripts/issue-tokens.mts $HOLDER_ADDRESS 
# use address of your Phantom's wallet for ex.
```

> Note: Script utilizes `spl-token-upgrade` cli from the solana-program-library. 

Do not forget to declare proper id at the [source code](https://github.com/solana-labs/solana-program-library/blob/master/token-upgrade/program/src/lib.rs#L15).

### Setup

```typescript
import { TokenUpgrade } from "@solana/token-upgrade-ui"

const OuterComponent = () => (
  <TokenUpgrade
    onUpgradeStart={() =>
      console.log({ message: "Upgrading token..." })
    }
    onUpgradeEnd={({ signature }) =>
      console.log({
        message: "Token upgraded",
        link: `https://explorer.solana.com/tx/${signature}`,
      })
    }
    tokenAddress={tokenAddressToUpgrade}
  />
)
``` 

### Commands

- `pnpm i` - Install
- `pnpm build` - Build the project
- `pnpm --filter "*" lint-fix` - Prettify source code
- `pnpm playground` - Launch Storybook's environment
