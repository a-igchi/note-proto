import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { notesRouter } from "./routes/notes.js";
import { linksRouter } from "./routes/links.js";
import { graphRouter } from "./routes/graph.js";

const app = new Hono();

app.use("/api/*", cors());

app.route("/api/notes", notesRouter);
app.route("/api/links", linksRouter);
app.route("/api/graph", graphRouter);

const port = Number(process.env.PORT ?? 3000);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server running on http://localhost:${info.port}`);
});
