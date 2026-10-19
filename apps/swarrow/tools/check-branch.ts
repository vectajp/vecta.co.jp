#!/usr/bin/env bun
// lefthook pre-push: 現在のブランチ名を検証する。ルールは commit-rules.ts。

import { validateBranch } from "./commit-rules";

const head = Bun.spawnSync(["git", "symbolic-ref", "--short", "HEAD"]);
const branch = head.stdout.toString().trim();

if (branch) {
  const error = validateBranch(branch);
  if (error) {
    process.stderr.write(`[pre-push] ${error}\n`);
    process.exit(1);
  }
}

process.exit(0);
