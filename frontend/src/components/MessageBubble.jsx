import React, { Children, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';

import 'highlight.js/styles/github-dark.css';
import { X } from 'lucide-react';

const MessageBubble = ({ role, content, images }) => {
  const isUser = role === 'user';
  const [lightBox, setLightBox] = useState(null);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={` ${
          isUser
            ? 'max-w-[75%] rounded-xl rounded-tr-none bg-gray-950 px-4 py-3 text-white'
            : 'max-w-[85%] rounded-xl rounded-tl-none bg-slate-900 px-4 py-3 text-slate-200'
        } `}
      >
        {isUser ? (
          <p className="text-[14px] leading-7 whitespace-pre-wrap">{content}</p>
        ) : (
          <>
            {images.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    onClick={() => {
                      setLightBox(img);
                    }}
                    loading="lazy"
                    onError={(e) => e.currentTarget.remove()}
                    className="h-28 w-40 cursor-zoom-in rounded-xl border border-white/10 object-cover transition hover:opacity-90"
                  />
                ))}
              </div>
            )}
            <div className="prose prose-invert max-w-none text-[14px] leading-7">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                components={{
                  // Code
                  pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,

                  code: ({ children, className, ...props }) => (
                    <code
                      className={`${className || ''} font-mono text-[13px]`}
                      {...props}
                    >
                      {children}
                    </code>
                  ),

                  // Headings
                  h1: ({ children }) => (
                    <h1 className="mt-6 mb-4 text-2xl font-bold tracking-tight">
                      {children}
                    </h1>
                  ),

                  h2: ({ children }) => (
                    <h2 className="mt-5 mb-3 text-xl font-semibold tracking-tight">
                      {children}
                    </h2>
                  ),

                  h3: ({ children }) => (
                    <h3 className="mt-4 mb-2 text-lg font-semibold">
                      {children}
                    </h3>
                  ),

                  h4: ({ children }) => (
                    <h4 className="mt-3 mb-2 text-base font-semibold">
                      {children}
                    </h4>
                  ),

                  // Paragraph
                  p: ({ children }) => (
                    <p className="wrap-break-words mb-3 text-[14px] leading-7 whitespace-pre-wrap">
                      {children}
                    </p>
                  ),

                  // Unordered list
                  ul: ({ children }) => (
                    <ul className="my-3 list-disc space-y-1.5 pl-6 text-[14px]">
                      {children}
                    </ul>
                  ),

                  // Ordered list
                  ol: ({ children }) => (
                    <ol className="my-3 list-decimal space-y-1.5 pl-6 text-[14px]">
                      {children}
                    </ol>
                  ),

                  // List item
                  li: ({ children }) => (
                    <li className="pl-1 leading-6">{children}</li>
                  ),

                  // Bold
                  strong: ({ children }) => (
                    <strong className="font-semibold">{children}</strong>
                  ),

                  // Italic
                  em: ({ children }) => <em className="italic">{children}</em>,

                  // Links
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline decoration-blue-400/40 underline-offset-2 hover:text-blue-300"
                    >
                      {children}
                    </a>
                  ),

                  // Blockquote
                  blockquote: ({ children }) => (
                    <blockquote className="my-4 border-l-4 border-white/20 bg-white/5 px-4 py-2 text-gray-300 italic">
                      {children}
                    </blockquote>
                  ),

                  // Inline code / Code block
                  code: ({ children, className, ...props }) => {
                    const isInline = !className?.includes('language-');

                    if (isInline) {
                      return (
                        <code
                          className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[13px] text-pink-300"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    }

                    return (
                      <code
                        className={`${className || ''} block overflow-x-auto p-4 font-mono text-[13px] leading-6`}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },

                  // Code block container
                  pre: ({ children }) => (
                    <pre className="my-4 overflow-x-auto rounded-xl border border-white/10 bg-[#0d1117] shadow-lg">
                      {children}
                    </pre>
                  ),

                  // Table
                  table: ({ children }) => (
                    <div className="my-5 overflow-x-auto rounded-xl border border-white/10">
                      <table className="w-full border-collapse text-left text-sm">
                        {children}
                      </table>
                    </div>
                  ),

                  thead: ({ children }) => (
                    <thead className="bg-white/10">{children}</thead>
                  ),

                  tbody: ({ children }) => (
                    <tbody className="divide-y divide-white/10">
                      {children}
                    </tbody>
                  ),

                  tr: ({ children }) => (
                    <tr className="transition hover:bg-white/3">{children}</tr>
                  ),

                  th: ({ children }) => (
                    <th className="border-b border-white/10 px-4 py-3 font-semibold">
                      {children}
                    </th>
                  ),

                  td: ({ children }) => (
                    <td className="px-4 py-3 align-top">{children}</td>
                  ),

                  // Images
                  img: ({ src, alt }) => (
                    <img
                      src={src}
                      alt={alt || ''}
                      loading="lazy"
                      className="my-4 max-h-125 max-w-full rounded-xl border border-white/10 object-contain shadow-md"
                    />
                  ),

                  // Horizontal line
                  hr: () => <hr className="my-6 border-white/10" />,

                  // Strikethrough
                  del: ({ children }) => (
                    <del className="text-gray-500">{children}</del>
                  ),

                  // Task list checkbox
                  input: ({ checked, ...props }) => (
                    <input
                      type="checkbox"
                      checked={checked}
                      readOnly
                      className="mr-2 h-4 w-4 accent-blue-500"
                      {...props}
                    />
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </>
        )}
      </div>
      {lightBox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm">
          <button
            className="absolute top-5 right-5 rounded-full bg-white/10 p-2 text-white/80 hover:text-white"
            onClick={() => {
              setLightBox(null);
            }}
          >
            <X />
          </button>
          <img
            src={lightBox}
            className="max-h-[85vh] max-w-[90vw] rounded-2xl border border-white/10 object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
