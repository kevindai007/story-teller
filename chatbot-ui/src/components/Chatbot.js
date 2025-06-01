import React, { useState, useRef, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import StoryTypeSelector from './StoryTypeSelector';
import chatbotService from '../services/chatbotService';
import { DEFAULT_MESSAGES, MESSAGE_TYPES } from '../constants';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(() => uuidv4());
  const [storyType, setStoryType] = useState('horror');
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        id: uuidv4(),
        type: MESSAGE_TYPES.BOT,
        content: DEFAULT_MESSAGES.WELCOME,
        timestamp: new Date(),
      },
    ]);
  }, []);

  const addMessage = useCallback((message) => {
    setMessages(prev => [...prev, { ...message, id: uuidv4(), timestamp: new Date() }]);
  }, []);

  const updateLastMessage = useCallback((content) => {
    setMessages(prev => {
      const updated = [...prev];
      const lastMessage = updated[updated.length - 1];
      if (lastMessage && lastMessage.type === MESSAGE_TYPES.BOT) {
        updated[updated.length - 1] = {
          ...lastMessage,
          content: lastMessage.content + content,
        };
      }
      return updated;
    });
  }, []);

  const handleSendMessage = useCallback(async (input) => {
    if (!input.trim() || isLoading) return;

    setError(null);
    
    // Add user message
    addMessage({
      type: MESSAGE_TYPES.USER,
      content: input,
    });

    // Add initial bot message
    addMessage({
      type: MESSAGE_TYPES.BOT,
      content: '',
    });

    setIsLoading(true);

    try {
      // Cancel any previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      const messageData = {
        input: input.trim(),
        story_type: storyType,
        conversation_id: conversationId,
      };

      // Validate message data
      chatbotService.validateMessageData(messageData);

      // Send message and handle streaming response
      await chatbotService.sendMessage(
        messageData,
        abortControllerRef.current.signal,
        (content) => {
          updateLastMessage(content);
        }
      );
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Request aborted');
        return;
      }
      
      console.error('Stream error:', err);
      setError(err.message || 'Failed to get response from server');
      
      // Update the last message with error
      setMessages(prev => {
        const updated = [...prev];
        const lastMessage = updated[updated.length - 1];
        if (lastMessage && lastMessage.type === MESSAGE_TYPES.BOT && !lastMessage.content) {
          updated[updated.length - 1] = {
            ...lastMessage,
            content: DEFAULT_MESSAGES.ERROR_GENERIC,
            isError: true,
          };
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [conversationId, storyType, isLoading, addMessage, updateLastMessage]);

  const handleStoryTypeChange = useCallback((newStoryType) => {
    setStoryType(newStoryType);
  }, []);

  const handleNewConversation = useCallback(() => {
    setConversationId(uuidv4());
    setMessages([
      {
        id: uuidv4(),
        type: MESSAGE_TYPES.BOT,
        content: DEFAULT_MESSAGES.NEW_CONVERSATION,
        timestamp: new Date(),
      },
    ]);
    setError(null);
  }, []);

  const handleStopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="chatbot">
      <div className="chatbot-header">
        <h1>AI Storyteller</h1>
        <div className="chatbot-controls">
          <StoryTypeSelector 
            storyType={storyType} 
            onStoryTypeChange={handleStoryTypeChange}
            disabled={isLoading}
          />
          <button 
            className="new-conversation-btn"
            onClick={handleNewConversation}
            disabled={isLoading}
          >
            New Chat
          </button>
        </div>
      </div>
      
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
      
      <MessageList messages={messages} isLoading={isLoading} />
      
      <MessageInput 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onStopGeneration={handleStopGeneration}
      />
    </div>
  );
};

export default Chatbot;
