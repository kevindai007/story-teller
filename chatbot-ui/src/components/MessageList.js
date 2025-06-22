import React, { useEffect, useRef } from 'react';
import { FaUser, FaRobot, FaSpinner } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MessageList = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTimestamp = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(timestamp);
  };

  const handleImageLoad = (event) => {
    // Scroll to bottom when images load to maintain proper positioning
    scrollToBottom();
  };

  const handleImageError = (event) => {
    // Hide broken images or show placeholder
    event.target.style.display = 'none';
  };

  const renderMessageContent = (content) => {
    if (!content) return null;

    return (
      <div className="text-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Custom image component with better styling
            img: ({ node, alt, src, title, ...props }) => (
              <div className="message-image-container">
                <img
                  src={src}
                  alt={alt}
                  title={title}
                  className="message-image"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  loading="lazy"
                  {...props}
                />
                {alt && (
                  <div className="image-caption">{alt}</div>
                )}
              </div>
            ),
            // Custom link component
            a: ({ node, href, children, ...props }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="message-link"
                {...props}
              >
                {children}
              </a>
            ),
            // Custom code block component
            code: ({ node, inline, className, children, ...props }) => {
              return !inline ? (
                <pre className="code-block">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              ) : (
                <code className="inline-code" {...props}>
                  {children}
                </code>
              );
            },
            // Custom blockquote component
            blockquote: ({ children }) => (
              <blockquote className="markdown-blockquote">
                {children}
              </blockquote>
            ),
            // Custom list components
            ul: ({ children }) => (
              <ul className="markdown-list">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="markdown-list">{children}</ol>
            ),
            // Custom heading components
            h1: ({ children }) => <h1 className="markdown-heading markdown-h1">{children}</h1>,
            h2: ({ children }) => <h2 className="markdown-heading markdown-h2">{children}</h2>,
            h3: ({ children }) => <h3 className="markdown-heading markdown-h3">{children}</h3>,
            h4: ({ children }) => <h4 className="markdown-heading markdown-h4">{children}</h4>,
            h5: ({ children }) => <h5 className="markdown-heading markdown-h5">{children}</h5>,
            h6: ({ children }) => <h6 className="markdown-heading markdown-h6">{children}</h6>,
            // Custom table components
            table: ({ children }) => (
              <div className="table-container">
                <table className="markdown-table">{children}</table>
              </div>
            ),
            th: ({ children }) => <th className="table-header">{children}</th>,
            td: ({ children }) => <td className="table-cell">{children}</td>,
            // Custom paragraph component to handle spacing
            p: ({ children }) => <p className="markdown-paragraph">{children}</p>,
            // Custom emphasis components
            strong: ({ children }) => <strong className="markdown-bold">{children}</strong>,
            em: ({ children }) => <em className="markdown-italic">{children}</em>,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="message-list">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`message ${message.type} ${message.isError ? 'error' : ''}`}
        >
          <div className="message-avatar">
            {message.type === 'user' ? (
              <FaUser className="avatar-icon user-icon" />
            ) : (
              <FaRobot className="avatar-icon bot-icon" />
            )}
          </div>
          <div className="message-content">
            <div className="message-text">
              {message.content && renderMessageContent(message.content)}
              {message.type === 'bot' && !message.content && isLoading && (
                <div className="typing-indicator">
                  <FaSpinner className="spinner" />
                  <span>Generating story...</span>
                </div>
              )}
            </div>
            <div className="message-timestamp">
              {formatTimestamp(message.timestamp)}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
