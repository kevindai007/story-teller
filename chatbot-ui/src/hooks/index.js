import { useState, useCallback } from 'react';

/**
 * Custom hook for handling errors in the chatbot application
 * Provides error state management and logging capabilities
 */
export const useErrorHandler = () => {
  const [error, setError] = useState(null);

  const handleError = useCallback((error, context = '') => {
    console.error(`Error ${context}:`, error);
    
    // In production, you might want to send errors to a logging service
    if (process.env.REACT_APP_ERROR_REPORTING_URL) {
      // Send to error reporting service
      fetch(process.env.REACT_APP_ERROR_REPORTING_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: error.message,
          stack: error.stack,
          context,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      }).catch(reportingError => {
        console.error('Failed to report error:', reportingError);
      });
    }
    
    setError(error.message || 'An unexpected error occurred');
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
  };
};

/**
 * Custom hook for managing conversation state
 */
export const useConversation = () => {
  const [conversationId, setConversationId] = useState(() => {
    // Generate UUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  });

  const startNewConversation = useCallback(() => {
    const newId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    setConversationId(newId);
    return newId;
  }, []);

  return {
    conversationId,
    startNewConversation,
  };
};

/**
 * Custom hook for managing loading states
 */
export const useLoadingState = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const startLoading = useCallback((message = 'Loading...') => {
    setIsLoading(true);
    setLoadingMessage(message);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingMessage('');
  }, []);

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
  };
};
