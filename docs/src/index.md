# Introduction 

[Token Upgrade UI](https://github.com/hoodieshq/token-upgrade-ui) provides a client interface to upgrade tokens to the new format of a token ([Token Extension](https://solana.com/solutions/token-extensions)).

## Contents

### 🚀 `packages/app`

Demo application powered by [Next.js](https://nextjs.org).

It demonstrates how to integrate the [`TokenUpgrade`](https://github.com/hoodieshq/token-upgrade-ui/blob/main/packages/app/src/widgets/index-page.tsx#L52-L67) component and its functionality into a project with [React](https://react.dev) under the hood.

Use the button down here to launch it on [Vercel](https://vercel.com).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhoodieshq%2Ftoken-upgrade-ui&env=NEXT_PUBLIC_TOKEN_UPGRADE_PROGRAM_ID&envDescription=Upgrade%20Program%20Address%20Variables&env=NEXT_PUBLIC_ESCROW_AUTHY_ADDRESS&env=NEXT_PUBLIC_ORIGIN_TOKEN_ADDRESS&env=NEXT_PUBLIC_TARGET_TOKEN_ADDRESS&root-directory=packages%2Fapp&project-name=solana-token-upgrade-app&repository-name=solana-token-upgrade-app&demo-title=Token%20Upgrade%20UI&demo-description=App%20to%20Upgrade%20Token%20on%20Solana%20Blockchain)

Bear in mind it will require some configuration:

- Set `NEXT_PUBLIC_TOKEN_UPGRADE_PROGRAM_ID` environment variable and provide the address of the deployed [`token-upgrade`](https://github.com/solana-labs/solana-program-library/tree/master/token-upgrade) program.
- Set all [other env variables](../../packages/app/.env) to the proper values.
- The [root directory](https://vercel.com/docs/deployments/configure-a-build#root-directory) should lead to the `packages/app` directory.
- `node@18.x`

#### Usage

To upgrade a token except for the program, you should have:
- replacement token (Token Extension)
- escrow account
- escrow should have enough replacement tokens for future upgrades

To create a replacement token, you use `@solana/spl-token`.

The [`spl-token-upgrade`](https://github.com/solana-labs/solana-program-library/tree/master/token-upgrade/cli) CLI creates an escrow.

Having all these, you can mint some tokens with ease.

There is a `scripts/issue-tokens.mts` script to demonstrate the complete flow. It will create all the needed tokens and accounts. The same is true for minting. You can use it on `devnet` like so:

```sh
SOLANA_TOKEN_UPGRADE_CLI=<%path_to_upgrade_cli%> \
    pnpx tsx ./scripts/issue-tokens.mts $HOLDER_ADDRESS
```
- `HOLDER_ADDRESS` - wallet to hold tokens
- `<%path_to_upgrade_cli%>` - path to a `spl-token-upgrade` cli at your system

> Do not forget to declare the proper ID for your [source code](https://github.com/solana-labs/solana-program-library/blob/master/token-upgrade/program/src/lib.rs#L15) version.

Upon execution, the script will provide a query string with all the needed addresses. You can launch the application and paste it into a browser.

### ⚙️  `packages/ui`

The package contains the `TokenUpgrade` component and the blocks from which it is built.

#### Basic usage

Use this sample to integrate the component.

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

If you do not need the UI, core functions can be used.

```typescript
import { 
  createUpgradeTokenInstruction, // construct upgrade instruction
  upgradeToken, // build upgrade transaction
  useTokenUpgrade // hook to upgrade a token
} from "@solana/token-upgrade-ui"
```

### 🔒 `packages/shared`

Shared configuration for both packages.

## Development

### 🛠️ Setup

```sh
pnpm it
# Install & check
```

### 💪 Build

```sh
pnpm dev
# Launch the demo application in watch mode.
# Scripts will track changes. 
# Use it for development
```

```sh
pnpm playground
# Launch Storybook. Use it to improve UI for components.
```

### 📋 Test & Quality control

```sh
pnpm lint
# Check code style
```

```sh
pnpm --filter "*" lint-fix
# Linting the source code
```

```sh
pnpm --filter "@solana/*ui" local:test-e2e
# Test the `upgrade token` scenario. 
# To run this properly env variables shall be tweaked. 
# See `packages/ui/tests/e2e.test.ts` for more info
```

```sh
pnpm --filter "@solana/*ui" local:test-smoke
# Run UI tests
```

### 📦 Release

```sh
pnpm build
# Build UI for a production
```

```sh
pnpm build-sb
# Build Storybook's artifacts
```

```sh
pnpm changeset $COMMAND
# Use `changeset` to prepare for a release
```

### 📒 Documentation

```sh
pnpm run docs
# Launch documentation
```
