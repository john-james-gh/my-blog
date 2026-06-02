---
title: "Cleaning house in an Nx monorepo: how I removed 120 unused deps safely"
excerpt: "I ran Knip across our Nx repo, took the “unused” list as a hint, deleted candidates, built, tested, booted apps, and put a few back when they were secretly used. Net, about 120 packages gone. Yarn install dropped by roughly a minute. Fewer CVE nags. Everyone slept better."
coverImage: "/assets/blog/cleaning-house-in-nx-monorepo-how-i-removed-120-unused-deps-safely/cover.avif"
date: "2025-09-28 22:03"
ogImage:
  url: "/assets/blog/cleaning-house-in-nx-monorepo-how-i-removed-120-unused-deps-safely/cover.avif"
---

Short version, I ran Knip across our Nx repo, took the “unused” list as a hint, deleted candidates, built, tested, booted apps, and put a few back when they were secretly used. Net, about 120 packages gone. Yarn install dropped by roughly a minute. Fewer CVE nags. Everyone slept better.

### The situation

We got a chunky Nx monorepo. Roughly 500 deps scattered across apps and packages/libs, not all living in the root. Installs felt slow. Security alerts felt noisy. I wanted to clean house without breaking anything or making dev life worse.

### Why I ditched depcheck and tried Knip

I used to reach for depcheck. It’s been on life support for years and doesn’t love modern setups. Knip looked current, understands monorepos, and actually sniffs entry points for common stacks. Depcheck recommends it too. It builds a little graph from imports and config refs, then compares it to package.json. Good enough for a first pass.

### What I actually did

Baseline scan first:

```js
yarn dlx knip
```

Then I ran the usual suspects to see what would scream if I yanked packages:

```js
yarn nx affected -t build test lint

# I also spun up the app locally

yarn nx run <app>:serve # or :dev
```

Knip’s pass flagged a ton of stuff on the first scan. About 40% of what it called “unused” turned out to be false positives in my setup. Totally fine, that’s expected.

#### How I treated the results

Knip is a signal, not the judge. For each package it flagged:

uninstall it

build, test, lint, e2e, codegen/typegen, and then boot the owning app

if something broke, put it back and document why in my Knip ignore list

Most of the false positives were “used but not imported” stuff:

strings in config files, for example Jest preset or runner names

CLI tools only used in scripts or CI

plugin discovery patterns

type-only or toolchain stuff

I kept a running ignore list with little comments so future me/dev isn’t confused.

### The Knip setup

I made the config monorepo-aware and added a few ignores that always trip scanners in our stack. Yours will vary, but this is just a taste without exposing too much:

```js
/** @type {import('knip').KnipConfig} */
const config = {
  include: ["dependencies", "devDependencies"],
  ignoreWorkspaces: ["packages/eslint-config"],
  ignoreDependencies: [
    "ts-node", // referenced by name in jest config
    "cross-env", // scripts only
  ],
  workspaces: {
    "apps/cms": {
      ignoreDependencies: ["@sanity/vision"],
    },
    "packages/ui": {
      ignoreDependencies: [
        "tw-animate-css", // weird @import in global.css
        "@tailwindcss/typography", // same as above
      ],
    },
  },
};

export default config;
```

### Verification loop

Delete the thing. Build. Test. Yadda, yadda. Quick smoke in dev. If it’s green, ship it. If not, restore and ignore with a one-liner note.

I also did a preview deploy and watched for dumb stuff like missing assets or new console errors. Nothing exciting showed up, which is the best possible outcome.

### Numbers

Before, about 510 unique packages across the workspace. After, about 390. Roughly 120 gone. Yarn install shaved off around a minute on my machine and in CI. Exactly what I wanted.

### What Knip nailed, and where it didn’t

Good at common React and server app entry points, and lots of config conventions. Not great when usage is indirect or only happens in scripts or CI. That’s fine. Humans still have jobs.

### How I merged it without ruining anyone’s day

Small PRs are safer, but I batched this one, deployed to a preview branch, then merged during a quiet slot so rollback would only touch my PR. I left it live while I clicked through a few user flows and tailed logs. All quiet.

### The extra bit

Knip can also flag unused files, enums, types. Nice for dead code hunts. Same rule, treat it as a hint and verify with real builds and tests.

### What I’d do next

Wire Knip into CI as a gentle report first. Let it run for a sprint while you tune the ignore list, then consider failing on new unused deps. Keeps the bloat from creeping back in.

### That’s it

I didn’t reinvent anything here. Knip found low-hanging fruit, I did the human check, and we shipped a smaller, cleaner repo without drama.
