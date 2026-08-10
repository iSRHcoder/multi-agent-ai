import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

import 'highlight.js/styles/github-dark.css';

const MessageBubble = ({ role, content }) => {
  const isUser = role === 'user';

  return (
    <div className={`mt-5 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={` ${
          isUser
            ? 'max-w-[75%] rounded-xl rounded-tr-none bg-linear-to-br from-indigo-500 to-violet-700 px-4 py-3 text-white'
            : 'w-full max-w-212.5 rounded-xl rounded-tl-none bg-linear-to-br from-slate-700 to-slate-900 px-4 py-3 text-slate-200'
        } `}
      >
        {isUser ? (
          <p className="text-[14px] leading-7 whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="prose prose-invert max-w-none text-[14px] leading-7">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
