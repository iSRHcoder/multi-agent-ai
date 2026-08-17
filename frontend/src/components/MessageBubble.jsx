import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

import 'highlight.js/styles/github-dark.css';

const MessageBubble = ({ role, content }) => {
  const isUser = role === 'user';

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
