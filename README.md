# Cata Classic Pre-Raid BiS

Next.js app listing Pre-Raid Best in Slot gear for **all specs** in Cataclysm Classic.

## Features
- All specs: Hunter (SV/BM/MM), Warrior (Arms/Fury/Prot), Death Knight (Blood/Frost), Paladin (Ret/Holy), Druid (Balance/Feral), Mage (Fire), Rogue (Combat), Shaman (Enh/Ele)
- Dark WoW-themed UI with class colours
- Each item links to Wowhead
- Enchant recommendations per slot
- Mobile-friendly layout

## Deploy to Vercel (1 minute)

### Option A — CLI
```bash
npm install -g vercel
cd cata-bis
npm install
vercel
```

### Option B — GitHub + Vercel Dashboard
1. Push this folder to a GitHub repo
2. Go to https://vercel.com/new
3. Import the repo → Vercel auto-detects Next.js
4. Click Deploy

## Local dev
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Structure
```
src/
  app/
    page.tsx           ← Home: class grid
    bis/[spec]/
      page.tsx         ← Spec BiS table
  data/
    bisData.ts         ← All gear data — edit here!
```

## Adding/editing specs
Open `src/data/bisData.ts` and edit or add entries in the `specs` array.
Each item needs: `slot`, `slotLabel`, `name`, `itemId` (Wowhead ID), `source`, `location`.
Optional: `enchant`, `stats`.
