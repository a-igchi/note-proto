import { Hono } from "hono";
import { graph } from "../graph.js";

export const linksRouter = new Hono();

linksRouter.post("/", async (c) => {
  const { sourceId, targetId } = await c.req.json<{ sourceId: string; targetId: string }>();
  const result = await graph.createLink(sourceId, targetId);
  if (!result.ok) {
    const status =
      result.error === "SELF_LINK" ? 400 : result.error === "DUPLICATE_LINK" ? 409 : 404;
    return c.json({ error: result.error }, status);
  }
  return c.json(result.value, 201);
});

linksRouter.delete("/:id", async (c) => {
  const result = await graph.deleteLink(c.req.param("id"));
  if (!result.ok) return c.json({ error: result.error }, 404);
  return c.json({ ok: true });
});
