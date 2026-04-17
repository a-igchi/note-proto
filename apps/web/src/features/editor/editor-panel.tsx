import { useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { validateTitle as validateTitleCore } from "core";
import { api } from "../../lib/api";
import { queryKeys } from "../../lib/query";
import { MilkdownEditor } from "./milkdown-editor";

const ERROR_MESSAGES: Record<string, string> = {
  TITLE_REQUIRED: "タイトルは必須です",
  TITLE_INVALID: "空白文字は使用できません",
};

const validateTitle = (title: string): string | null => {
  const error = validateTitleCore(title);
  return error ? (ERROR_MESSAGES[error] ?? error) : null;
};

export const EditorPanel = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === undefined;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load existing note
  const { data: note } = useQuery({
    queryKey: queryKeys.note(id ?? ""),
    queryFn: () => api.getNote(id!),
    enabled: !isNew && !!id,
  });

  // Initialize state from loaded note
  if (note && !initialized) {
    setTitle(note.title);
    setContent(note.content);
    setInitialized(true);
  }

  const createNoteMutation = useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      const created = await api.createNote(title);
      if (content) {
        await api.saveContent(created.id, content);
      }
      return created;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.graph });
      void queryClient.invalidateQueries({ queryKey: queryKeys.notes });
    },
  });

  const renameNoteMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => api.renameNote(id, title),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.graph });
      void queryClient.invalidateQueries({ queryKey: queryKeys.notes });
      void queryClient.invalidateQueries({ queryKey: queryKeys.note(id!) });
    },
  });

  const saveContentMutation = useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) => api.saveContent(id, content),
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    setTitleError(validateTitle(value));
  };

  const handleTitleBlur = () => {
    if (!isNew && id && note && title !== note.title) {
      const error = validateTitle(title);
      if (!error) {
        renameNoteMutation.mutate({ id, title });
      }
    }
  };

  const handleContentChange = useCallback(
    (markdown: string) => {
      setContent(markdown);
      // Auto-save with debounce for existing notes
      if (!isNew && id) {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
          saveContentMutation.mutate({ id, content: markdown });
        }, 500);
      }
    },
    [isNew, id, saveContentMutation],
  );

  const handleBack = async () => {
    if (isNew) {
      // New note: empty title + empty content → discard
      if (title === "" && content === "") {
        void navigate("/");
        return;
      }
      // New note: empty title + has content → error
      if (title === "") {
        setTitleError("タイトルは必須です");
        return;
      }
      // New note: valid title → save and go back
      const error = validateTitle(title);
      if (error) {
        setTitleError(error);
        return;
      }
      await createNoteMutation.mutateAsync({ title, content });
      void navigate("/");
    } else {
      // Existing note: validate title
      const error = validateTitle(title);
      if (error) {
        setTitleError(error);
        return;
      }
      // Save pending content
      if (id && saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        await saveContentMutation.mutateAsync({ id, content });
      }
      // Save title if changed
      if (id && note && title !== note.title) {
        await renameNoteMutation.mutateAsync({ id, title });
      }
      void navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex justify-end p-4">
        <button
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          onClick={handleBack}
        >
          <ArrowLeft size={16} />
          戻る
        </button>
      </div>
      <div className="flex-1 max-w-3xl w-full mx-auto px-6 pb-12">
        <div className="mb-6">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            placeholder="タイトル"
            className="w-full text-3xl font-bold bg-transparent outline-none border-none"
          />
          {titleError && <p className="text-sm text-destructive mt-1">{titleError}</p>}
        </div>
        {(isNew || initialized) && (
          <MilkdownEditor defaultValue={content} onChange={handleContentChange} />
        )}
      </div>
    </div>
  );
};
