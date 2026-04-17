import { createContext, useContext } from "react";
import type { KnowledgeGraph } from "core";
import { createKnowledgeGraph } from "core";
import { createIdbAdapter } from "adapter-idb";

const GraphContext = createContext<KnowledgeGraph | null>(null);

export const useGraph = (): KnowledgeGraph => {
  const graph = useContext(GraphContext);
  if (!graph) throw new Error("GraphProvider missing");
  return graph;
};

export const initGraph = async (): Promise<KnowledgeGraph> => {
  const adapter = await createIdbAdapter();
  return createKnowledgeGraph({ adapter });
};

export { GraphContext };
