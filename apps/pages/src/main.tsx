import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { initGraph } from "./lib/graph";

const graph = await initGraph();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App graph={graph} />
  </StrictMode>,
);
