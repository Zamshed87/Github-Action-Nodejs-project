import DOMPurify from "dompurify";
import { marked } from "marked";
import mermaid from "mermaid";
import "./markdownDiagramPreview.css";
// Configure mermaid with more specific settings
mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
  flowchart: {
    htmlLabels: true,
    curve: "basis"
  }
});

// Configure marked with custom renderer for mermaid
const renderer = new marked.Renderer();
const originalCodeRenderer = renderer.code.bind(renderer);

renderer.code = (codeObj) => {
  console.log(codeObj, "codeObj");
  if (codeObj?.lang === "mermaid") {
    return `<div class="mermaid">${codeObj?.text}</div>`;
  }
  return originalCodeRenderer(codeObj);
};

marked.setOptions({
  renderer: renderer,
  breaks: true,
  gfm: true
});
type MarkdownDiagramPreviewType = {
  markdown: string;
};
function MarkdownDiagramPreview({ markdown }: MarkdownDiagramPreviewType) {
  // const [preview, setPreview] = useState("");

  let markdownSanitized = "";
  const renderMarkdown = async () => {
    try {
      const rendered: any = marked(markdown);
      const sanitized = DOMPurify.sanitize(rendered);
      markdownSanitized = sanitized;

      // Use a more robust way to render mermaid diagrams
      setTimeout(async () => {
        try {
          await mermaid.run({
            querySelector: ".mermaid",
            suppressErrors: true
          });
        } catch (error) {
          console.error("Mermaid rendering error:", error);
        }
      }, 100);
    } catch (error) {
      console.error("Markdown rendering error:", error);
    }
  };

  renderMarkdown();
  return (
    <div
      className="ai-chatbot-markdown-body"
      dangerouslySetInnerHTML={{ __html: markdownSanitized }}
    />
  );
}

export default MarkdownDiagramPreview;
