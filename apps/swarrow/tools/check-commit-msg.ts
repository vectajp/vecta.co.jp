#!/usr/bin/env bun
// lefthook commit-msg: コミットメッセージ 1行目を検証する。
// lefthook が {1} = コミットメッセージファイルのパスを渡す。ルールは commit-rules.ts。

import { validateSubject } from "./commit-rules";

const messageFile = process.argv[2];
if (!messageFile) {
  process.exit(0);
}

const raw = await Bun.file(messageFile).text();
// コメント行 (#) と空行を除いた最初の実体行を subject とみなす。
const subject = raw
  .split("\n")
  .find((line) => line.trim().length > 0 && !line.startsWith("#"));

// fixup! / squash! は後で rebase で畳まれるため検証しない。
if (subject && !/^(?:fixup|squash)!/.test(subject)) {
  const error = validateSubject(subject.trimEnd());
  if (error) {
    process.stderr.write(`[commit-msg] ${error}\n`);
    process.exit(1);
  }
}

process.exit(0);
