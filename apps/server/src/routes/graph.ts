import { Hono } from "hono";
import { graph } from "../graph.js";

export const graphRouter = new Hono();

graphRouter.get("/", async (c) => {
  const data = await graph.getGraph();
  return c.json(data);
});
