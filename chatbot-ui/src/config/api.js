// API Configuration
const API_CONFIG = {
  // Base URL - should be set via environment variables in production
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  
  // Endpoints
  ENDPOINTS: {
    STREAM_STORY: '/stream-story',
  },
  
  // Request timeouts
  TIMEOUTS: {
    DEFAULT: 30000, // 30 seconds
    STREAM: 300000, // 5 minutes for streaming
  },
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'text/event-stream',
  },
  
  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    BACKOFF_MULTIPLIER: 2,
    INITIAL_DELAY: 1000,
  },
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  INVALID_RESPONSE: 'Invalid response from server.',
  STREAM_ERROR: 'Error occurred while streaming response.',
  ABORT_ERROR: 'Request was cancelled.',
};

// API utility functions
export const ApiUtils = {
  // Create request configuration
  createRequestConfig: (signal, timeout = API_CONFIG.TIMEOUTS.DEFAULT) => ({
    headers: API_CONFIG.DEFAULT_HEADERS,
    signal,
    timeout,
  }),
  
  // Handle API errors
  handleApiError: (error) => {
    if (error.name === 'AbortError') {
      return ERROR_MESSAGES.ABORT_ERROR;
    }
    
    if (error.name === 'TimeoutError') {
      return ERROR_MESSAGES.TIMEOUT_ERROR;
    }
    
    if (!navigator.onLine) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
    
    if (error.status >= 500) {
      return ERROR_MESSAGES.SERVER_ERROR;
    }
    
    return error.message || ERROR_MESSAGES.NETWORK_ERROR;
  },
  
  // Validate response
  validateResponse: (response) => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response;
  },
};

export default API_CONFIG;
