import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query";
import { GraphView } from "./features/graph/graph-view";
import { EditorPanel } from "./features/editor/editor-panel";

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GraphView />} />
        <Route path="/notes/new" element={<EditorPanel />} />
        <Route path="/notes/:id" element={<EditorPanel />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);
