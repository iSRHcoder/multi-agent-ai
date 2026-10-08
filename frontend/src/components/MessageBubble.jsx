import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';

import 'highlight.js/styles/github-dark.css';

import { X } from 'lucide-react';

/* =========================================================
   Image URL Helper
========================================================= */

const isImageUrl = (url = '') => {
  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname.toLowerCase();

    return (
      /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(pathname) ||
      parsedUrl.hostname.includes('images') ||
      parsedUrl.hostname.includes('image')
    );
  } catch {
    return false;
  }
};

/* =========================================================
   Code Artifact
========================================================= */

const CodingResponse = ({ artifact, onImageClick }) => {
  if (!artifact || !Array.isArray(artifact.files)) {
    return null;
  }

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const getLanguage = (filename = '') => {
    const extension = filename.split('.').pop()?.toLowerCase();

    const languages = {
      html: 'HTML',
      htm: 'HTML',
      css: 'CSS',
      scss: 'SCSS',
      js: 'JavaScript',
      jsx: 'React JSX',
      ts: 'TypeScript',
      tsx: 'React TSX',
      json: 'JSON',
      md: 'Markdown',
      yaml: 'YAML',
      yml: 'YAML',
      xml: 'XML',
      svg: 'SVG',
      sh: 'Shell',
      bash: 'Shell',
    };

    return languages[extension] || 'Code';
  };

  return (
    <div className="space-y-4">
      {/* Artifact title */}
      {artifact.title && (
        <div className="mb-3">
          <h3 className="text-base font-semibold text-slate-100">
            {artifact.title}
          </h3>

          {artifact.intent && (
            <span className="mt-1 inline-block rounded-md bg-blue-500/10 px-2 py-1 text-[10px] font-medium text-blue-400">
              {artifact.intent.replaceAll('_', ' ')}
            </span>
          )}
        </div>
      )}

      {/* Files */}
      {artifact.files.map((file, index) => (
        <div
          key={`${file.name}-${index}`}
          className="overflow-hidden rounded-xl border border-white/10 bg-[#0d1117] shadow-lg"
        >
          {/* File Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2.5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="truncate font-mono text-sm font-medium text-slate-200">
                {file.name}
              </span>

              <span className="shrink-0 rounded-md bg-white/10 px-2 py-1 text-[11px] text-slate-400">
                {getLanguage(file.name)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => copyCode(file.content)}
              className="ml-3 shrink-0 rounded-md px-3 py-1.5 text-xs text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              Copy
            </button>
          </div>

          {/* Code */}
          <div className="overflow-x-auto">
            <pre className="m-0 p-4 text-[13px] leading-6">
              <code className="font-mono text-slate-300">
                {file.content}
              </code>
            </pre>
          </div>
        </div>
      ))}
    </div>
  );
};

/* =========================================================
   Artifact Renderer
========================================================= */

const ArtifactRenderer = ({ artifacts, onImageClick }) => {
  if (!Array.isArray(artifacts) || artifacts.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-5">
      {artifacts.map((artifact, index) => {
        if (artifact?.type === 'code') {
          return (
            <CodingResponse
              key={artifact.id || `artifact-${index}`}
              artifact={artifact}
              onImageClick={onImageClick}
            />
          );
        }

        return null;
      })}
    </div>
  );
};

/* =========================================================
   Message Bubble
========================================================= */

const MessageBubble = ({
  role,
  content = '',
  images = [],
  artifacts = [],
}) => {
  const isUser = role === 'user';

  const [lightBox, setLightBox] = useState(null);

  const safeImages = Array.isArray(images) ? images : [];
  const safeArtifacts = Array.isArray(artifacts) ? artifacts : [];

  return (
    <div
      className={`flex ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`${
          isUser
            ? 'max-w-[75%] rounded-xl rounded-tr-none bg-gray-950 px-4 py-3 text-white'
            : 'max-w-[90%] rounded-xl rounded-tl-none bg-slate-900 px-4 py-3 text-slate-200'
        }`}
      >
        {/* =================================================
            USER MESSAGE
        ================================================= */}
        {isUser ? (
          <p className="whitespace-pre-wrap text-[14px] leading-7">
            {content}
          </p>
        ) : (
          <>
            {/* =================================================
                AI TEXT RESPONSE
            ================================================= */}
            {content && (
              <div className="prose prose-invert max-w-none text-[14px] leading-7">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeHighlight]}
                  components={{
                    /* =========================
                       Headings
                    ========================= */

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

                    /* =========================
                       Paragraph
                    ========================= */

                    p: ({ children }) => (
                      <p className="mb-3 wrap-break-words text-[14px] leading-7 whitespace-pre-wrap">
                        {children}
                      </p>
                    ),

                    /* =========================
                       Lists
                    ========================= */

                    ul: ({ children }) => (
                      <ul className="my-3 list-disc space-y-1.5 pl-6 text-[14px]">
                        {children}
                      </ul>
                    ),

                    ol: ({ children }) => (
                      <ol className="my-3 list-decimal space-y-1.5 pl-6 text-[14px]">
                        {children}
                      </ol>
                    ),

                    li: ({ children }) => (
                      <li className="pl-1 leading-6">
                        {children}
                      </li>
                    ),

                    /* =========================
                       Text formatting
                    ========================= */

                    strong: ({ children }) => (
                      <strong className="font-semibold">
                        {children}
                      </strong>
                    ),

                    em: ({ children }) => (
                      <em className="italic">{children}</em>
                    ),

                    del: ({ children }) => (
                      <del className="text-gray-500">
                        {children}
                      </del>
                    ),

                    /* =========================
                       Links
                    ========================= */

                    a: ({ children, href }) => {
                      const text = String(children ?? '');

                      const isImage =
                        href &&
                        (isImageUrl(href) ||
                          text.toLowerCase().trim() === 'view');

                      if (isImage) {
                        return (
                          <img
                            src={href}
                            alt="Image"
                            loading="lazy"
                            onClick={() => setLightBox(href)}
                            onError={(e) => {
                              console.error(
                                'Broken image URL:',
                                href
                              );

                              e.currentTarget.style.display =
                                'none';
                            }}
                            className="my-2 h-32 w-44 cursor-zoom-in rounded-xl border border-white/10 object-cover transition hover:opacity-90"
                          />
                        );
                      }

                      return (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 underline decoration-blue-400/40 underline-offset-2 hover:text-blue-300"
                        >
                          {children}
                        </a>
                      );
                    },

                    /* =========================
                       Blockquote
                    ========================= */

                    blockquote: ({ children }) => (
                      <blockquote className="my-4 border-l-4 border-white/20 bg-white/5 px-4 py-2 text-gray-300 italic">
                        {children}
                      </blockquote>
                    ),

                    /* =========================
                       Code
                    ========================= */

                    code: ({
                      children,
                      className,
                      ...props
                    }) => {
                      const isInline =
                        !className?.includes('language-');

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
                          className={`${
                            className || ''
                          } block overflow-x-auto p-4 font-mono text-[13px] leading-6`}
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },

                    /* =========================
                       Code block
                    ========================= */

                    pre: ({ children }) => (
                      <pre className="my-4 overflow-x-auto rounded-xl border border-white/10 bg-[#0d1117] shadow-lg">
                        {children}
                      </pre>
                    ),

                    /* =========================
                       Tables
                    ========================= */

                    table: ({ children }) => (
                      <div className="my-5 overflow-x-auto rounded-xl border border-white/10">
                        <table className="w-full border-collapse text-left text-sm">
                          {children}
                        </table>
                      </div>
                    ),

                    thead: ({ children }) => (
                      <thead className="bg-white/10">
                        {children}
                      </thead>
                    ),

                    tbody: ({ children }) => (
                      <tbody className="divide-y divide-white/10">
                        {children}
                      </tbody>
                    ),

                    tr: ({ children }) => (
                      <tr className="transition hover:bg-white/5">
                        {children}
                      </tr>
                    ),

                    th: ({ children }) => (
                      <th className="border-b border-white/10 px-4 py-3 font-semibold">
                        {children}
                      </th>
                    ),

                    td: ({ children }) => (
                      <td className="px-4 py-3 align-top">
                        {children}
                      </td>
                    ),

                    /* =========================
                       Markdown Images
                    ========================= */

                    img: ({ src, alt }) => {
                      if (!src) return null;

                      return (
                        <img
                          src={src}
                          alt={alt || 'Image'}
                          loading="lazy"
                          onClick={() => setLightBox(src)}
                          onError={(e) => {
                            console.error(
                              'Broken markdown image:',
                              src
                            );

                            e.currentTarget.style.display =
                              'none';
                          }}
                          className="my-4 max-h-[500px] max-w-full cursor-zoom-in rounded-xl border border-white/10 object-contain shadow-md"
                        />
                      );
                    },

                    /* =========================
                       Horizontal Rule
                    ========================= */

                    hr: () => (
                      <hr className="my-6 border-white/10" />
                    ),

                    /* =========================
                       Task List Checkbox
                    ========================= */

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
            )}

            {/* =================================================
                SEPARATE AI IMAGES
            ================================================= */}

            {safeImages.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {safeImages.map((img, index) => (
                  <img
                    key={`${img}-${index}`}
                    src={img}
                    alt={`AI result ${index + 1}`}
                    loading="lazy"
                    onClick={() => setLightBox(img)}
                    onError={(e) => {
                      console.error(
                        'Broken image URL:',
                        img
                      );

                      e.currentTarget.style.display = 'none';
                    }}
                    className="h-28 w-40 cursor-zoom-in rounded-xl border border-white/10 object-cover transition hover:opacity-90"
                  />
                ))}
              </div>
            )}

            {/* =================================================
                GENERATED ARTIFACTS
            ================================================= */}

            {safeArtifacts.length > 0 && (
              <ArtifactRenderer
                artifacts={safeArtifacts}
                onImageClick={setLightBox}
              />
            )}
          </>
        )}
      </div>

      {/* =================================================
          LIGHTBOX
      ================================================= */}

      {lightBox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm">
          <button
            type="button"
            aria-label="Close image"
            className="absolute top-5 right-5 rounded-full bg-white/10 p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
            onClick={() => setLightBox(null)}
          >
            <X size={24} />
          </button>

          <img
            src={lightBox}
            alt="Full size preview"
            loading="lazy"
            onError={(e) => {
              console.error(
                'Broken lightbox image:',
                lightBox
              );

              setLightBox(null);
            }}
            className="max-h-[85vh] max-w-[90vw] rounded-2xl border border-white/10 object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;

