---
name: usability-round
description: ユーザビリティテスト 1 ラウンド (テスター → 課題管理係 → 修正役) を順に実行する。`/loop /usability-round` で連続実行も可。
argument-hint: "[dev_server_url]"
disable-model-invocation: true
---

ユーザビリティテストループを 1 ラウンド回してください。引数: `$ARGUMENTS`（開発サーバー URL。無ければ `http://localhost:5173` で試行し、繋がらなければ user に聞く）。

## 手順

### 前提チェック

1. 現在のブランチが `main` か確認し、clean working tree であることを確認する。dirty なら user に相談して止める
2. `git pull --ff-only` で最新化

### 1. テスターを起動

`Agent` ツールで `subagent_type: usability-tester` を foreground で呼ぶ。prompt には:

- 開発サーバー URL
- このラウンドの連番（`docs/usability-test/reports/` を ls して今日付のファイル数をカウントし +1 したもの）

を渡す。

テスターからレポートパスと課題件数サマリが返るのを待つ。

### 2. 課題管理係を起動

`Agent` ツールで `subagent_type: issue-manager` を foreground で呼ぶ。prompt にはテスターが返したレポートパスを渡す。

管理係から triage 結果（新規/更新/reopen の issue 番号リスト）が返るのを待つ。

### 3. 修正役を起動（条件付き）

管理係の結果に `severity:blocker` または `severity:major` の open issue が含まれる場合のみ、`Agent` ツールで `subagent_type: usability-fixer` を foreground で呼ぶ。それ以外なら修正役はスキップ。

修正役から PR URL または「対象無し」が返るのを待つ。

### 4. 終了サマリ

user に以下を報告:

- ラウンド番号
- テスターレポート: パス / 課題件数 (severity 別)
- 管理係: 新規 #N, 更新 #M, reopen #K, スキップ L 件
- 修正役: PR URL または「対象無し」
- 続行可否の所感（例: `まだ open の major が X 件ある` / `blocker/major はゼロ、次は minor に取り掛かるか？`）

## 注意

- ラウンド中にブロッカー（ビルド失敗、テスト失敗、gh auth 失効など）が出たら **止めて user に報告**。勝手に進まない
- サブエージェントは順に呼ぶ（並列にしない）。各段の出力が次段の入力になる
- この slash command は 1 ラウンドで終わる。連続実行したい場合は `/loop /usability-round <url>` を user に勧める
