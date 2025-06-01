import { useEffect, useImperativeHandle, useRef, forwardRef } from "react";

export type RichTextEditorRef = {
  setContent: (html: string) => void;
  getContent: () => string;
  clearContent: () => void;
  getInstance: () => any;
};

type Props = {
  initialValue?: string;
  onChange?: (content: string) => void;
  height?: number;
};

const RichTextEditor = forwardRef<RichTextEditorRef, Props>(
  ({ initialValue = "", onChange, height }, ref) => {
    const editorDivRef = useRef<HTMLDivElement>(null);
    const editorInstanceRef = useRef<any>(null);

    useEffect(() => {
      if (window && (window as any).RichTextEditor && editorDivRef.current) {
        const instance = new (window as any).RichTextEditor(
          editorDivRef.current
        );
        instance.setHTMLCode(initialValue);

        // Add onChange event
        instance.attachEvent("change", () => {
          const html = instance.getHTMLCode();
          onChange?.(html);
        });

        editorInstanceRef.current = instance;
      }
    }, [onChange]);

    useImperativeHandle(ref, () => ({
      setContent: (html: string) => {
        editorInstanceRef.current?.setHTMLCode(html);
      },
      getContent: () => {
        return editorInstanceRef.current?.getHTMLCode() || "";
      },
      clearContent: () => {
        editorInstanceRef.current?.setHTMLCode("");
      },
      getInstance: () => {
        return editorInstanceRef.current;
      },
    }));

    return (
      <div style={{ height: `${height ?? 350}px` }} ref={editorDivRef}></div>
    );
  }
);

export default RichTextEditor;
