import React, { useEffect, useRef } from 'react';
import { FaUser, FaRobot, FaSpinner } from 'react-icons/fa';
import { parseMarkdownContent } from '../utils/messageUtils';

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

    const parsedContent = parseMarkdownContent(content);
    
    return (
      <div className="text-content">
        {parsedContent.map((element, index) => (
          <div key={element.key || index} className="content-line">
            {element.content.map((item, itemIndex) => {
              if (typeof item === 'string') {
                // Regular text content
                return (
                  <span key={itemIndex}>
                    {item}
                  </span>
                );
              } else if (item.type === 'image') {
                // Image content
                return (
                  <div key={item.key} className="message-image-container">
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="message-image"
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                      loading="lazy"
                    />
                    {item.alt && (
                      <div className="image-caption">{item.alt}</div>
                    )}
                  </div>
                );
              } else if (item.type === 'link') {
                // Regular link content
                return (
                  <a
                    key={item.key}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="message-link"
                  >
                    {item.text}
                  </a>
                );
              }
              return null;
            })}
          </div>
        ))}
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
