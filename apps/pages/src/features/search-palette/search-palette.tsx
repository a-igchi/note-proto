import { useState, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useGraph } from "../../lib/graph";
import { queryKeys } from "../../lib/query";
import type { Note } from "core";

type SearchPaletteProps = {
  onClose: () => void;
};

export const SearchPalette = ({ onClose }: SearchPaletteProps) => {
  const graph = useGraph();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: notes = [] } = useQuery({
    queryKey: queryKeys.notes,
    queryFn: () => graph.getNotes(),
  });

  const filtered = notes.filter((note: Note) =>
    note.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = useCallback(
    (targetId: string) => {
      onClose();
      void navigate(`/notes/${targetId}`);
    },
    [navigate, onClose],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      handleSelect(filtered[selectedIndex].id);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]" onClick={onClose}>
      <div
        className="bg-popover border border-border rounded-lg shadow-xl w-[400px] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder="ノートを検索..."
          className="w-full px-4 py-3 bg-transparent border-b border-border outline-none text-sm"
          autoFocus
        />
        {search && filtered.length > 0 && (
          <div className="max-h-[200px] overflow-y-auto py-1">
            {filtered.map((note: Note, index: number) => (
              <button
                key={note.id}
                className={`w-full text-left px-4 py-2 text-sm ${
                  index === selectedIndex ? "bg-accent" : "hover:bg-accent/50"
                }`}
                onClick={() => handleSelect(note.id)}
              >
                {note.title}
              </button>
            ))}
          </div>
        )}
        {search && filtered.length === 0 && (
          <div className="px-4 py-3 text-sm text-muted-foreground">該当するノートがありません</div>
        )}
      </div>
    </div>
  );
};
