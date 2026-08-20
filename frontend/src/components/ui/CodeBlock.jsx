import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

const CodeBlock = ({ children }) => {
  const [copied, setCopied] = useState(false);

  const code = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  return (
    <div className="group relative my-4 overflow-hidden rounded-xl border border-white/10 bg-[#0d1117]">
      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 z-10 flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1.5 text-xs text-gray-300 opacity-0 backdrop-blur-sm transition group-hover:opacity-100 hover:bg-white/20"
        title="Copy code"
      >
        {copied ? (
          <>
            <Check size={14} />
            <span>Copied</span>
          </>
        ) : (
          <>
            <Copy size={14} />
            <span>Copy</span>
          </>
        )}
      </button>

      {/* Code */}
      <pre className="overflow-x-auto p-4 pt-12 text-sm leading-6">
        {children}
      </pre>
    </div>
  );
};
