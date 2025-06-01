/**
 * Utility functions for message processing and formatting
 */

/**
 * Format timestamp for display
 * @param {Date} timestamp - The timestamp to format
 * @returns {string} Formatted time string
 */
export const formatTimestamp = (timestamp) => {
  const now = new Date();
  const messageTime = new Date(timestamp);
  const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
  
  if (diffInMinutes < 1) {
    return 'just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) { // 24 hours
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h ago`;
  } else {
    return messageTime.toLocaleDateString();
  }
};

/**
 * Sanitize user input to prevent XSS
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate message input
 * @param {string} input - Message input to validate
 * @returns {Object} Validation result
 */
export const validateMessageInput = (input) => {
  const maxLength = parseInt(process.env.REACT_APP_MAX_MESSAGE_LENGTH) || 1000;
  
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: 'Message is required' };
  }
  
  const trimmed = input.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, error: 'Message cannot be empty' };
  }
  
  if (trimmed.length > maxLength) {
    return { isValid: false, error: `Message too long (max ${maxLength} characters)` };
  }
  
  // Check for potentially malicious content
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(trimmed)) {
      return { isValid: false, error: 'Message contains invalid content' };
    }
  }
  
  return { isValid: true, sanitized: sanitizeInput(trimmed) };
};

/**
 * Format message content for display
 * @param {string} content - Message content
 * @returns {string} Formatted content
 */
export const formatMessageContent = (content) => {
  if (!content) return '';
  
  // Convert URLs to clickable links
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return content.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
};

/**
 * Generate conversation summary
 * @param {Array} messages - Array of messages
 * @returns {string} Conversation summary
 */
export const generateConversationSummary = (messages) => {
  const userMessages = messages.filter(msg => msg.type === 'user');
  const botMessages = messages.filter(msg => msg.type === 'bot');
  
  return `Conversation with ${userMessages.length} user messages and ${botMessages.length} bot responses`;
};

/**
 * Export conversation data
 * @param {Array} messages - Array of messages
 * @param {string} conversationId - Conversation ID
 * @returns {Object} Exportable conversation data
 */
export const exportConversation = (messages, conversationId) => {
  return {
    id: conversationId,
    timestamp: new Date().toISOString(),
    messageCount: messages.length,
    summary: generateConversationSummary(messages),
    messages: messages.map(msg => ({
      type: msg.type,
      content: msg.content,
      timestamp: msg.timestamp.toISOString(),
    })),
  };
};

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for performance optimization
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
