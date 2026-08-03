<p align="center">
  <a href="https://redduck.io">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset=".github/assets/redduck-logo-dark.svg">
      <img src=".github/assets/redduck-logo.svg" alt="RedDuck" width="240">
    </picture>
  </a>
</p>

<h1 align="center">Onchain Arcade</h1>

<p align="center">
  <b>Ten games, no house backend — every round settled on-chain with Chainlink VRF.</b>
</p>

---

A **fully on-chain, decentralized casino** running on Arbitrum. There is no game server and no house backend deciding outcomes: every bet is a smart-contract transaction, every result comes from **Chainlink VRF** (verifiable random function), and every payout is executed by the contract itself. The frontend you see here is just a window into the chain — anyone can verify any game round by reading the contract events.

## Built with

| Area | Technology |
| --- | --- |
| Framework | React 18, TypeScript, Vite |
| Web3 | wagmi, viem, Reown AppKit |
| Data fetching | TanStack Query, Apollo Client + The Graph, SWR, Axios |
| UI | Tailwind CSS, Radix UI, `lucide-react`, `class-variance-authority` |
| Forms & validation | Formik, Yup |
| State | Zustand |
| Physics | Matter.js (Plinko) |
| Auth | `web3-token` (signed-message auth against the admin backend) |
| Monitoring | Sentry |
| Tooling | Yarn 1 (classic), ESLint, Prettier |

## About this repository

This repository is a **frontend demo** of a complete white-label casino product built by RedDuck. The full product also includes the on-chain part this interface is built against — game smart contracts with Chainlink VRF integration, the referral and VIP systems, and The Graph subgraphs — which are **not** part of this repository.

If you'd like to launch your own casino on top of this stack, please reach out to us.

## Why on-chain?

- **Provably fair.** Randomness is supplied by Chainlink VRF: the random number comes with an on-chain cryptographic proof that neither the player nor the house could have predicted or manipulated it.
- **Non-custodial.** The casino never holds player accounts. You bet USDT/USDC straight from your wallet; winnings are paid out by the game contract in the same transaction flow.
- **Transparent economics.** House edge, bet fees, minimum/maximum bets and per-token limits are public contract state, changeable only through the on-chain admin roles — and readable by anyone.
- **No trust required for refunds.** If Chainlink doesn't deliver randomness within a configured number of blocks, the player can trigger an on-chain refund and get the bet back. The frontend tracks pending rounds and offers the refund automatically.

## How a game round works

1. The player approves the betting token and calls `playGame` on the game contract (bet amount, encoded game parameters, slippage guard).
2. The contract emits `GameStart` and requests randomness from Chainlink VRF.
3. VRF fulfills the request with a proven random number; the contract computes the outcome, pays out if the player won, and emits `GameEnd`.
4. The frontend picks up the event, plays the round animation and updates balances and history (recent rounds are fed by The Graph subgraphs).

Auto-bet mode resolves multiple rounds with a single VRF request — the contract settles each bet against its own random word, and the UI reveals the results one by one.

## Games

| Game | The gist |
|---|---|
| **Dice** | Pick a target and roll over/under it — payout scales with the win probability you chose |
| **Coinflip** | Heads or tails against the contract |
| **Limbo** | Name your multiplier; win if the hidden roll lands above it |
| **Blast Off** | Crash-style rocket: set a cash-out multiplier before the rocket blows |
| **Wheel** | Spin a segmented wheel with selectable risk levels |
| **Roulette** | Full European roulette (0–36) with the complete betting table and multi-chip bets |
| **Slide** | A ticker slides across multipliers and lands on the winning one |
| **Rock-Paper-Scissors** | Classic RPS versus the contract — draws return your bet |
| **Plinko** | A ball bounces through a physics-simulated peg pyramid (8–16 rows, 3 risk levels) |
| **Classic Slots** | Slot machine with on-chain reels and claimable wins |

## Beyond the games

- **Referral program** — GMX-style on-chain referral codes: create a code, share a link, earn a share of referred players' fees. Tiers are managed on-chain.
- **VIP ranks** — Bronze/Silver/Gold ranks lower the player's bet fee; the discount is read from the VIP contract per player.
- **Admin panel** — a separate UI for on-chain game management: bet limits, house edge, fees, allowed tokens, blocks-to-refund, role management. Admin access is verified by contract roles plus a signed-message auth against the backend.

## Getting started

Requires Node.js 22+ and Yarn 1 (classic).

```bash
yarn install
yarn dev
```

1. Copy `.env.example` to `.env` and fill in the values. At minimum you need `VITE_PROJECT_ID` — a [Reown](https://dashboard.reown.com) project id used for wallet connection.
2. Contract addresses per chain live in [`src/constants/contracts.ts`](src/constants/contracts.ts) — point them at your deployments.

Other scripts: `yarn build` (type-check + production build), `yarn preview`, `yarn lint` (zero-warning policy).

## Project structure

```
src/
├── abi/         # contract ABIs
├── api/         # backend REST helpers
├── components/  # UI components, per-game logic under components/games/
├── constants/   # chains, contracts, tokens, per-game configs
├── hooks/       # shared hooks (game events, VRF, bets, refunds, admin)
├── lib/         # utilities, The Graph queries, Sentry setup
├── pages/       # one page per game + landing, referrals, admin
├── providers/   # wagmi/AppKit, Apollo, React Query, token context
└── router/      # react-router setup
```

## Local development against a fork

With `VITE_ENV=development` the app adds a `localhost` chain (`http://localhost:8545`, chain id `31337`) that expects an Arbitrum fork with the game contracts deployed. On the local chain, VRF requests are fulfilled through a mocked coordinator (see [`src/hooks/useLocalVrfAutoFulfill.ts`](src/hooks/useLocalVrfAutoFulfill.ts)), so games can complete without live Chainlink infrastructure.

## Security notes

`package.json` contains a `resolutions` block that pins transitive dependencies to patched versions (mostly inside the legacy `web3-token` dependency tree). If you remove or update dependencies, re-run `yarn audit` to make sure no known vulnerabilities are reintroduced.

## License

[MIT](LICENSE) © RedDuck Limited
