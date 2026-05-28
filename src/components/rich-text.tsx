import { Fragment } from "react";

/**
 * Renders the markdown-lite format used by editable long-form content:
 *   "## heading"  -> sub-heading
 *   "- bullet"    -> bulleted list item
 *   blank line    -> paragraph break
 * Plain text only (no raw HTML), so admin-entered content can't inject markup.
 */
export function RichText({ text, className }: { text: string; className?: string }) {
  const lines = (text || "").split("\n");
  const blocks: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listBuffer.length) {
      blocks.push(
        <ul key={key++} className="list-disc space-y-1 pl-6">
          {listBuffer.map((li, i) => (
            <li key={i}>{li}</li>
          ))}
        </ul>,
      );
      listBuffer = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith("## ")) {
      flushList();
      blocks.push(<h2 key={key++} className="h3 mt-6">{line.slice(3)}</h2>);
    } else if (line.startsWith("- ")) {
      listBuffer.push(line.slice(2));
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      blocks.push(<p key={key++} className="mt-3">{line}</p>);
    }
  }
  flushList();

  return <div className={className}>{blocks.map((b, i) => <Fragment key={i}>{b}</Fragment>)}</div>;
}
