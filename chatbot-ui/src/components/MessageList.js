import React, { useEffect, useRef } from 'react';
import { FaUser, FaRobot, FaSpinner } from 'react-icons/fa';

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
              {message.content && (
                <div className="text-content">
                  {message.content.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < message.content.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              )}
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
