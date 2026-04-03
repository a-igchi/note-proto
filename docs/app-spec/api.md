# API設計

## 概要

本ドキュメントでは、サーバーが提供するREST APIについて説明する。すべてのエンドポイントはJSON形式でリクエスト・レスポンスを行う。

## エンドポイント一覧

| メソッド | パス                   | 説明                     |
| -------- | ---------------------- | ------------------------ |
| GET      | /api/notes             | ノート一覧の取得         |
| GET      | /api/notes/:id         | ノートの取得（本文含む） |
| POST     | /api/notes             | ノートの作成             |
| PATCH    | /api/notes/:id         | ノートのリネーム         |
| DELETE   | /api/notes/:id         | ノートの削除             |
| PUT      | /api/notes/:id/content | ノート本文の保存         |
| POST     | /api/links             | リンクの作成             |
| DELETE   | /api/links/:id         | リンクの削除             |
| GET      | /api/graph             | グラフデータの取得       |

## ノート

### GET /api/notes

すべてのノートのメタデータを取得する。更新日時の降順で返す。

**レスポンス:**

```json
[
  {
    "id": "uuid",
    "title": "ノートのタイトル",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
```

### GET /api/notes/:id

指定したノートのメタデータと本文を取得する。

**レスポンス:**

```json
{
  "id": "uuid",
  "title": "ノートのタイトル",
  "content": "Markdownの本文",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

**エラー:**

- 404: ノートが存在しない。

### POST /api/notes

新しいノートを作成する。

**リクエスト:**

```json
{
  "title": "ノートのタイトル"
}
```

**レスポンス (201):**

```json
{
  "id": "uuid",
  "title": "ノートのタイトル",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

**エラー:**

- 409: 同名のノートが既に存在する。

### PATCH /api/notes/:id

ノートのタイトルを変更する。

**リクエスト:**

```json
{
  "title": "新しいタイトル"
}
```

**エラー:**

- 404: ノートが存在しない。
- 409: 変更先のタイトルが既に使用されている。

### DELETE /api/notes/:id

ノートを削除する。関連するリンクも自動で削除される。ファイルシステム上のMarkdownファイル（`{id}.md`）も削除する。

**エラー:**

- 404: ノートが存在しない。

### PUT /api/notes/:id/content

ノートの本文を保存する。データベースの `updated_at` を更新し、ファイルシステムにMarkdownファイル（`{id}.md`）を書き込む。

**リクエスト:**

```json
{
  "content": "Markdownの本文"
}
```

**エラー:**

- 404: ノートが存在しない。

## リンク

### POST /api/links

ノート間のリンクを作成する。

**リクエスト:**

```json
{
  "sourceId": "uuid",
  "targetId": "uuid"
}
```

**レスポンス (201):**

```json
{
  "id": "uuid",
  "sourceId": "uuid",
  "targetId": "uuid"
}
```

**エラー:**

- 400: sourceId と targetId が同一（自己リンク）。
- 409: 同じノード間のリンクが既に存在する。

### DELETE /api/links/:id

リンクを削除する。

**エラー:**

- 404: リンクが存在しない。

## グラフ

### GET /api/graph

グラフの可視化に必要なノードとエッジのデータを取得する。

**レスポンス:**

```json
{
  "nodes": [{ "id": "uuid", "label": "ノートのタイトル" }],
  "edges": [{ "id": "uuid", "source": "uuid", "target": "uuid" }]
}
```

## 型定義

```typescript
type Note = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

type NoteWithContent = Note & {
  content: string;
};

type Link = {
  id: string;
  sourceId: string;
  targetId: string;
};

type GraphNode = {
  id: string;
  label: string;
};

type GraphEdge = {
  id: string;
  source: string;
  target: string;
};

type GraphData = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};
```
