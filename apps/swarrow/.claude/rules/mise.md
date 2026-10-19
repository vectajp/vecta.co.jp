---
paths:
  - "mise.toml"
  - "**/mise.toml"
  - "**/.mise.toml"
---

# mise.toml の規約

`mise.toml` はこのリポジトリにおけるツールチェーンの唯一の正となる設定ファイル。`[tools]` でツールバージョン(`aws-cli` / `bun` / `terraform`)を固定し、`[tasks.*]` で `bootstrap`(別名 `bs`)/ `clean` タスクを定義している。

- **バージョンは `mise.toml` にのみ記述する。** ドキュメントやスクリプトにツールバージョンを直書きせず、必ず mise を参照する。将来 `mise.toml` を読めない場所(例: 現状は存在しない Dockerfile の `FROM` タグなど)にバージョンを重複させる必要が生じた場合は、同一バージョンを固定し、同じ変更の中で両方を更新する。
- **バージョンは完全な `x.y.z` で固定する。** `latest` や `any` は禁止。
- **ルート設定は1つだけ。** このリポジトリは将来 Bun workspaces(`packages/` 配下に個別の `package.json`)を使う可能性があるが、ツールチェーンは統一されているためルートの `mise.toml` のみが存在する。将来サブディレクトリで本当に異なるツール/バージョンが必要になった場合にのみ、そこに `mise.toml` / `.mise.toml` を追加する(mise はルート設定にサブディレクトリ設定をマージする)。
- **`mise.toml` を新規作成・編集したら `mise trust` を実行する。**
- **`mise current` で、有効なツールチェーンがファイルの内容と一致しているか確認する。**
- **`bun` は mise の環境が有効になるまでシェルの PATH に乗らない。** ルート設定が1つしかなく解決されるツールチェーンも1つなので、毎回のコマンドを `mise exec --` でラップする必要はない。シェルを一度 activate すれば十分(`eval "$(mise activate zsh)"`)で `bun` / `bunx` が PATH に乗る。`mise exec -- bun ...` / `mise exec -- bunx ...` は、activate 済みシェルを前提にできない文脈(`tools/bootstrap.sh` や `tools/clean.sh` のような非対話スクリプト)のために取っておく(`mise run <task>` は mise が解決した環境の中で実行されるため、これはすでに考慮不要)。
