/**
 * RawApiResponseTab
 *
 * Developer-friendly pretty-printed JSON view of the full API response.
 */
import { useState } from "react";

export default function RawApiResponseTab({ data }) {
  const [copied, setCopied] = useState(false);

  const json = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 rounded bg-slate-700 px-2 py-1 text-xs font-medium text-slate-200 hover:bg-slate-600 transition z-10"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre className="max-h-[600px] overflow-auto rounded-lg bg-slate-900 p-4 text-xs leading-relaxed text-slate-200">
        {json}
      </pre>
    </div>
  );
}
