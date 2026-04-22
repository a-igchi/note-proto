import type { Note, NoteWithContent, Link, GraphData } from "core";

const BASE = "/api";

const fetchJson = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(`${BASE}${url}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...Object.fromEntries(new Headers(init?.headers)),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
};

export const api = {
  getNotes: () => fetchJson<Note[]>("/notes"),
  searchNotes: (query: string) => fetchJson<Note[]>(`/notes/search?q=${encodeURIComponent(query)}`),
  getNote: (id: string) => fetchJson<NoteWithContent>(`/notes/${id}`),
  createNote: (title: string) =>
    fetchJson<Note>("/notes", { method: "POST", body: JSON.stringify({ title }) }),
  renameNote: (id: string, title: string) =>
    fetchJson<Note>(`/notes/${id}`, { method: "PATCH", body: JSON.stringify({ title }) }),
  deleteNote: (id: string) => fetchJson<{ ok: boolean }>(`/notes/${id}`, { method: "DELETE" }),
  saveContent: (id: string, content: string) =>
    fetchJson<{ ok: boolean }>(`/notes/${id}/content`, {
      method: "PUT",
      body: JSON.stringify({ content }),
    }),
  createLink: (sourceId: string, targetId: string) =>
    fetchJson<Link>("/links", { method: "POST", body: JSON.stringify({ sourceId, targetId }) }),
  deleteLink: (id: string) => fetchJson<{ ok: boolean }>(`/links/${id}`, { method: "DELETE" }),
  getGraph: () => fetchJson<GraphData>("/graph"),
};
