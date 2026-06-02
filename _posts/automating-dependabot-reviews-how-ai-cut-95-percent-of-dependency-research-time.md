---
title: "Automating Dependabot reviews: how AI cut 95% of dependency research time"
excerpt: "Dependabot PRs are useful, but researching every upgrade across a large monorepo is slow. I wired Copilot CLI into GitHub Actions so AI handles the dependency research and humans make the call."
coverImage: "/assets/blog/automating-dependabot-reviews-how-ai-cut-95-percent-of-dependency-research-time/cover.avif"
date: "2025-10-24 19:28"
ogImage:
  url: "/assets/blog/automating-dependabot-reviews-how-ai-cut-95-percent-of-dependency-research-time/cover.avif"
---

After the unused dep cleanup in my last post (used Knip to trim ~120 packages), we were left with just shy of 400 dependencies. Out of those, about 100 were outdated, some by a couple of major versions.

After you clean house, the next natural step is to keep it clean. That means upgrading what’s left and preventing drift.

### The setup

Our company policy says all production deps must be on supported, latest versions. Dev deps get a little more slack.

The team agreed to build a consistent refinement process for Dependabot PRs instead of merging them blindly.
We drafted a question set to keep upgrades transparent and risk-aware:

- do we actually need this dep? could we bring it in-house?
- how widely is it used across the monorepo?
- do we need additional tests for this upgrade?
- what stands out in the release notes?
- any known breaking changes or codemods?

Each PR became a short research task.
One dev would check usage, changelogs, risk level, and summarize everything for refinement.

Repeat that across ~100 packages and you’ve got a lot of busywork.

### The problem

That research phase was repetitive and slow.
It wasn’t hard work, just constant tab-switching, grepping, and cross-checking.
All the info existed, it just took time to find.

So I started thinking, what if we offload that entire research phase to AI and let humans focus on decisions instead of data gathering?

### Picking the right AI

At my company, Copilot is the only approved AI.
That’s fine. It’s mature enough, and we already use it daily.

This workflow would work with Codex CLI or Claude Code too. Same idea, different binary.

At first, I tried using GitHub’s built-in Copilot PR reviewer.
It looked good on paper but blind. It only sees the PR title, description, and diff (files changed).
No grep, no codebase context, no clue how widely a dep is used.

Not good enough.

### How I actually ran it

Copilot CLI can run inside GitHub Actions with access to the full checked-out repo.
That’s the key. It can grep, search configs, and inspect code usage just like a human would, only faster.

I also wrote up a Copilot instruction file in the repo that tells it how to answer the same refinement questions we agreed on earlier. Things like usage count, test needs, release note highlights, and overall risk.

Here’s the minimal workflow I wired up (same concept works for other AI CLIs too):

```yaml
jobs:
  ai-dependabot-review:
    if: github.event.pull_request.user.login == 'dependabot[bot]'
    permissions:
      contents: read
    env:
      GITHUB_TOKEN: ${{ secrets.COPILOT_PAT }} # fine-grained PAT with "Copilot Requests" read-only
      PR_TITLE: ${{ github.event.pull_request.title }}
      PR_BODY: ${{ github.event.pull_request.body }} # treat as untrusted prompt input
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v6
        with:
          node-version: 22 # Copilot CLI requires Node.js 22+
      - run: npm i -g @github/copilot
      - run: |
          copilot \
            --model claude-sonnet-4.5 \
            --allow-all-tools \
            --deny-tool 'shell(git push)' \
            --deny-tool 'write' \
            --add-dir "$GITHUB_WORKSPACE" \
            -p "Review this PR using the repo’s Dependabot PR review instructions.
          Title: $PR_TITLE
          Body: $PR_BODY           
          Output markdown" \
            > /tmp/review.md
```

The instructions also ask Copilot to include receipts for its reasoning so reviewers can see why it reached a conclusion before deciding to merge.

I also found that AI doesn’t hallucinate much when it’s asked to find files or references. It’s surprisingly accurate at that, which makes it perfect for this kind of analysis.

You can then post review.md back as a PR comment, send it to Jira via API, or ship it anywhere through MCP.
It’ll include reasoning process. You can trim that part if you want the research only.

### How it flows

Automation does the grind, humans handle the judgment.

![Dependabot AI review flow](/assets/blog/automating-dependabot-reviews-how-ai-cut-95-percent-of-dependency-research-time/flow.png)

### Security bits

Before rolling this out, I ran it through an ADR and review cycle with our security team/AppSec.

Copilot CLI is still in preview, but its security posture is enterprise-grade.
It runs in ephemeral environments, supports read-only execution, and respects org-level guardrails against exfiltration.
Features are evolving fast, but the foundation is solid.

From a permissions standpoint:

- needs only `contents: read` and a fine-grained PAT with "Copilot Requests" permission
- no secrets ever leave the environment
- it can’t write to disk or push code
- sees the checked-out repo inside the runner, nothing else

Some other AI CLIs might be more feature-rich today, but Copilot CLI was the safest and simplest choice for our setup.

### Results

This workflow cut our research time by roughly 95%.
It scales perfectly. You can centralize it in your internal Actions repo and import it everywhere across the org.

Average run time: ~2 minutes even on large monorepos.
Each review burns one Copilot premium request. Same cost as a single IDE chat prompt.

### That’s it

You could do this inside your IDE chat, but it doesn’t scale. It’s still manual.

The automation is the difference-maker here.

Dependabot + Copilot CLI turned dependency research from a drag into a background process.
Now we spend time making calls, not collecting facts.

Exactly how it should be.
