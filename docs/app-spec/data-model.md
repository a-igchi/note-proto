# データモデル設計

## 概要

本ドキュメントでは、アプリケーションのデータモデルについて説明する。

## Vault

Vaultは、アプリケーションのデータを永続化するためのストレージシステムである。SQLiteデータベースとファイルシステムのハイブリッド構成を採用する。

### ディレクトリ構造

```
vault/
├── graph.db            # SQLiteデータベース
└── notes/
    ├── {id}.md         # ノートの本文（Markdown）
    └── ...
```

### 配置

環境変数 `VAULT_DIR` でVaultの配置先を指定する。未指定の場合はプロジェクトルートの `vault/` を使用する。

### ストレージの役割分担

| 対象                                  | ストレージ       | 備考            |
| ------------------------------------- | ---------------- | --------------- |
| ノートのメタデータ（id, title, 日時） | SQLite           | Source of Truth |
| ノートの本文                          | ファイルシステム | `notes/{id}.md` |
| リンク情報                            | SQLite           |                 |

SQLiteデータベースをSource of Truthとする。書き込み時は常にデータベースを先に更新し、その後ファイルシステムに書き込む（DB-First Write）。

ファイルシステムへの書き込みが失敗した場合、データベースのロールバックは行わない。エラーをそのままクライアントに返す。DBとFSの不整合が発生しうるが、次回の保存で上書きされるため実害は小さい。

### データベース設定

- ジャーナルモード: WAL（Write-Ahead Logging）
- 外部キー制約: 有効

## エンティティ

### Note

ノートを表す。タイトルと本文を持つ。

| フィールド | 型              | 説明               |
| ---------- | --------------- | ------------------ |
| id         | UUID            | 主キー             |
| title      | TEXT            | タイトル。一意制約 |
| created_at | TEXT (ISO 8601) | 作成日時           |
| updated_at | TEXT (ISO 8601) | 更新日時           |

本文はファイルシステム上の `notes/{id}.md` に保存する。データベースには本文を含めない。

タイトルに利用可能な文字は以下のとおり。

- 英数字、日本語（ひらがな、カタカナ、漢字）
- 記号（`_`, `-`, `#` 等）
- 空白文字（スペース、タブ等）は使用不可
- 空文字列は不可

### Link

ノート間のリンクを表す。方向を持つ（source → target）が、アプリケーション上は無向グラフとして扱う。

| フィールド | 型               | 説明           |
| ---------- | ---------------- | -------------- |
| id         | UUID             | 主キー         |
| source_id  | UUID (FK → Note) | リンク元ノート |
| target_id  | UUID (FK → Note) | リンク先ノート |

## テーブル定義

```sql
CREATE TABLE notes (
  id         TEXT PRIMARY KEY,
  title      TEXT UNIQUE NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE links (
  id        TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  target_id TEXT NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  UNIQUE(source_id, target_id)
);
```

## 制約・ルール

- **タイトルの一意性**: 同名のノートは作成できない。
- **ファイル名はIDベース**: ファイル名にはノートのIDを使用する（`{id}.md`）。タイトルの変更時にファイルの移動は発生しない。
- **自己リンク禁止**: source_id と target_id が同一のリンクは作成できない。APIレベルで防止する。
- **重複リンク禁止**: 同じノード間のリンクは1つまで。UNIQUE制約で防止する。
- **CASCADE削除**: ノートを削除すると、そのノートに関連するリンクも自動で削除される。ファイルシステム上のMarkdownファイルも削除する。
