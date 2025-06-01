import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaStop } from 'react-icons/fa';

const MessageInput = ({ onSendMessage, isLoading, onStopGeneration }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [input]);

  return (
    <div className="message-input">
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-container">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? "Generating story..." : "Type your message here... (Shift+Enter for new line)"}
            disabled={isLoading}
            className="message-textarea"
            rows="1"
          />
          <div className="input-actions">
            {isLoading ? (
              <button
                type="button"
                onClick={onStopGeneration}
                className="action-btn stop-btn"
                title="Stop generation"
              >
                <FaStop />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="action-btn send-btn"
                title="Send message"
              >
                <FaPaperPlane />
              </button>
            )}
          </div>
        </div>
      </form>
      <div className="input-hint">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
};

export default MessageInput;
