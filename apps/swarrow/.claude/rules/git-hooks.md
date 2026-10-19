---
paths:
  - "lefthook.yml"
  - "tools/commit-rules.ts"
  - "tools/check-commit-msg.ts"
  - "tools/check-branch.ts"
---

# lefthook / commit ルールの規約

`tools/commit-rules.ts` がコミットメッセージ・ブランチ名・危険コマンドに関するルールの唯一の正である。`process` / `Bun` のグローバルに依存しない純粋なモジュールなので、git hooks(lefthook)と将来の Claude Code フック(`.claude/hooks/`、ファイル冒頭のコメントで言及されているが未作成)の両方から import できる。ルールを変更する際はこのファイルだけを編集し、フックスクリプト側に正規表現を直書きしないこと。

- **コミットの subject** は `CONVENTIONAL`(`type(scope): description`、type は `feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert`)に一致し、`MAX_SUBJECT_LENGTH`(72)文字以下でなければならない。`commit-msg` フックが `tools/check-commit-msg.ts` → `validateSubject` 経由で検証する。`fixup!` / `squash!` の subject は対象外(後で rebase により畳まれるため)。
- **ブランチ名** は `BRANCH_OK`(prefix は `feature|fix|hotfix|chore|docs|refactor` の `prefix/name` 形式、または `main` / `master` そのもの)に一致しなければならない。`pre-push` フックが `tools/check-branch.ts` → `validateBranch` 経由で検証する。このリポジトリの prefix は `feat/` ではなく `feature/` である点に注意(グローバル CLAUDE.md のブランチ規約と一致)。
- **`DANGEROUS` パターンは定義済みだがどのフックにも未接続。** 将来の利用者(前述の共有モジュールの意図どおり、Claude Code の `PreToolUse` フック)のために存在する。そのフックを追加する場合は、パターンを重複定義せず `DANGEROUS` を import すること。
- **`pre-commit` は3つのジョブを順番に実行する**: Biome(ステージ済みの `.ts` / `.json` / `.svelte` に `--write`、`stage_fixed: true` により自動再ステージ)→ `svelte-kit sync && svelte-check --tsconfig ./tsconfig.json`(`.svelte` を含むプロジェクト全体の型チェック。素の `tsc` は `.svelte` を解釈できないため`typescript.md` 参照)→ ステージ済みの `.ts` / `.md` / `.svelte` に対する cspell(`spelling.md` 参照)。
- **`bunx lefthook install` でインストールする**(`mise run bootstrap` が自動実行済み、`mise.md` 参照)。`--no-verify` はこれらのフックを迂回する。フックが誤っている場合はスキップするのではなく、フックまたは `commit-rules.ts` 自体を直すこと。
