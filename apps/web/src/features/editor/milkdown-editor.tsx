import { useRef, useEffect } from "react";
import { Editor, rootCtx, defaultValueCtx } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { nord } from "@milkdown/theme-nord";
import "@milkdown/theme-nord/style.css";

type MilkdownEditorProps = {
  defaultValue: string;
  onChange: (markdown: string) => void;
};

export const MilkdownEditor = ({ defaultValue, onChange }: MilkdownEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Editor | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const editor = Editor.make()
      .config(nord)
      .config((ctx) => {
        ctx.set(rootCtx, containerRef.current!);
        ctx.set(defaultValueCtx, defaultValue);
        ctx.get(listenerCtx).markdownUpdated((_ctx, markdown) => {
          onChange(markdown);
        });
      })
      .use(commonmark)
      .use(listener)
      .create();

    void editor.then((e) => {
      editorRef.current = e;
    });

    return () => {
      void editor.then((e) => e.destroy());
    };
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} className="prose max-w-none min-h-[300px]" />;
};
