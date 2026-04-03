import path from "node:path";
import { createKnowledgeGraph } from "core";
import { createSqliteAdapter } from "adapter-sqlite";

const vaultDir = process.env.VAULT_DIR ?? path.resolve(process.cwd(), "vault");

const adapter = createSqliteAdapter({ vaultDir });

export const graph = createKnowledgeGraph({ adapter });
