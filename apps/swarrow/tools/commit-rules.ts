// コミット / ブランチ / 危険コマンドの共有ルール (単一ソース)。
// Claude hook (.claude/hooks) と git hooks (lefthook) の双方が import し、
// ルールの二重定義・矛盾を防ぐ。グローバル依存 (process / Bun) は使わない。

/** コミットメッセージ 1行目 (subject) の最大文字数。 */
export const MAX_SUBJECT_LENGTH = 72;

/** Conventional Commits の subject 形式。 */
export const CONVENTIONAL =
  /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?!?: .+/;

/** 許可するブランチ名 (prefix のみ。GH 番号は必須にしない)。 */
export const BRANCH_OK =
  /^(?:feature|fix|hotfix|chore|docs|refactor)\/.+$|^(?:main|master)$/;

/** ブロックする破壊的コマンド。 */
export const DANGEROUS: { re: RegExp; msg: string }[] = [
  { re: /\brm\s+-[a-z]*r[a-z]*\s+\/(?:\s|$)/i, msg: "ルート (/) の再帰削除" },
  { re: /\brm\s+-[a-z]*r[a-z]*\s+\/\*/i, msg: "ルート配下 (/*) の再帰削除" },
  {
    re: /\brm\s+-[a-z]*r[a-z]*\s+~(?:\/\*?|\s|$)/i,
    msg: "ホーム (~) の再帰削除",
  },
  { re: /\brm\s+-[a-z]*r[a-z]*\s+\$HOME/i, msg: "ホーム ($HOME) の再帰削除" },
  {
    re: /\bgit\s+push\b[^\n]*\s(?:--force(?!-with-lease)|-f)\b/,
    msg: "force push",
  },
];

/** コミット subject を検証する。問題があればメッセージ、なければ null。 */
export function validateSubject(subject: string): string | null {
  if (!CONVENTIONAL.test(subject)) {
    return `コミットメッセージが Conventional Commits 形式ではありません: "${subject}"\n形式: <type>(<scope>): <説明>  例) chore: 初期セットアップ`;
  }
  if (subject.length > MAX_SUBJECT_LENGTH) {
    return `コミットメッセージ 1行目が長すぎます (${subject.length} 文字 > ${MAX_SUBJECT_LENGTH})。`;
  }
  return null;
}

/** ブランチ名を検証する。問題があればメッセージ、なければ null。 */
export function validateBranch(branch: string): string | null {
  if (!BRANCH_OK.test(branch)) {
    return `ブランチ名が規約に合いません: "${branch}"\n形式: <prefix>/<name>  例) feature/GH-123 (prefix: feature|fix|hotfix|chore|docs|refactor)`;
  }
  return null;
}
