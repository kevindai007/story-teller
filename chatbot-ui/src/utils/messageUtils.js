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

/**
 * Parse markdown content and convert to JSX elements
 * @param {string} content - Markdown content to parse
 * @returns {Array} Array of JSX elements
 */
export const parseMarkdownContent = (content) => {
  if (!content) return [];
  
  const elements = [];
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let processedLine = line;
    const lineElements = [];
    let lastIndex = 0;
    
    // First, check for markdown image pattern: ![alt text](url)
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;
    
    while ((match = imageRegex.exec(processedLine)) !== null) {
      // Add any text before the image
      if (match.index > lastIndex) {
        const textBefore = processedLine.substring(lastIndex, match.index);
        if (textBefore.trim()) {
          lineElements.push(textBefore);
        }
      }
      
      // Add the image element
      const altText = match[1] || 'Image';
      const imageUrl = match[2];
      
      lineElements.push({
        type: 'image',
        alt: altText,
        src: imageUrl,
        key: `img-${i}-${match.index}`
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // If no markdown images found, check for regular links that might be images
    if (lineElements.length === 0) {
      const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
      lastIndex = 0;
      
      while ((match = linkRegex.exec(processedLine)) !== null) {
        // Add any text before the link
        if (match.index > lastIndex) {
          const textBefore = processedLine.substring(lastIndex, match.index);
          if (textBefore.trim()) {
            lineElements.push(textBefore);
          }
        }
        
        const linkText = match[1];
        const linkUrl = match[2];
        
        // Check if the URL appears to be an image
        if (isValidImageUrl(linkUrl)) {
          // Convert link to image
          lineElements.push({
            type: 'image',
            alt: linkText || 'Image',
            src: linkUrl,
            key: `img-link-${i}-${match.index}`
          });
        } else {
          // Keep as regular link
          lineElements.push({
            type: 'link',
            text: linkText,
            url: linkUrl,
            key: `link-${i}-${match.index}`
          });
        }
        
        lastIndex = match.index + match[0].length;
      }
    }
    
    // Add any remaining text after the last match
    if (lastIndex < processedLine.length) {
      const textAfter = processedLine.substring(lastIndex);
      if (textAfter.trim()) {
        lineElements.push(textAfter);
      }
    }
    
    // If no images or links were found, just add the line as text
    if (lineElements.length === 0 && processedLine.trim()) {
      lineElements.push(processedLine);
    }
    
    // Add line elements to the main elements array
    if (lineElements.length > 0) {
      elements.push({
        type: 'line',
        content: lineElements,
        key: `line-${i}`
      });
    } else if (processedLine.trim() === '') {
      // Preserve empty lines for spacing
      elements.push({
        type: 'line',
        content: [''],
        key: `line-${i}`
      });
    }
  }
  
  return elements;
};

/**
 * Check if a URL is a valid image URL
 * @param {string} url - URL to check
 * @returns {boolean} True if URL appears to be an image
 */
export const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  // Check for common image extensions
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i;
  if (imageExtensions.test(url)) return true;
  
  // Check for common image hosting domains
  const imageHosts = [
    'imgur.com',
    'i.imgur.com',
    'cdn.discordapp.com',
    'media.discordapp.net',
    'images.unsplash.com',
    'pixabay.com',
    'pexels.com',
    'blob.core.windows.net',  // Azure Blob Storage
    'amazonaws.com',          // Amazon S3
    'googleusercontent.com',  // Google Storage
    'oaidalleapiprodscus.blob.core.windows.net', // OpenAI DALL-E images
    'cdn.openai.com',
    'files.openai.com'
  ];
  
  try {
    const urlObj = new URL(url);
    
    // Check if hostname matches any image hosting service
    const isImageHost = imageHosts.some(host => urlObj.hostname.includes(host));
    if (isImageHost) return true;
    
    // Additional checks for Azure Blob Storage URLs with image-like paths
    if (urlObj.hostname.includes('blob.core.windows.net')) {
      return true; // Assume Azure blob storage URLs are images in this context
    }
    
    // Check URL path for image indicators
    const pathLower = urlObj.pathname.toLowerCase();
    if (pathLower.includes('/img') || pathLower.includes('/image') || pathLower.includes('/photo')) {
      return true;
    }
    
    // Check query parameters for image indicators
    const searchParams = urlObj.searchParams;
    if (searchParams.has('rsct') && searchParams.get('rsct').includes('image')) {
      return true;
    }
    
    return false;
  } catch {
    return false;
  }
};

/**
 * Extract all image URLs from markdown content
 * @param {string} content - Markdown content
 * @returns {Array} Array of image objects with alt text and URLs
 */
export const extractImagesFromMarkdown = (content) => {
  if (!content) return [];
  
  const images = [];
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  
  while ((match = imageRegex.exec(content)) !== null) {
    const altText = match[1] || 'Image';
    const imageUrl = match[2];
    
    if (isValidImageUrl(imageUrl)) {
      images.push({
        alt: altText,
        src: imageUrl,
        markdown: match[0]
      });
    }
  }
  
  return images;
};
