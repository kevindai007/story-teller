import API_CONFIG, { ApiUtils } from '../config/api';

class ChatbotService {
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  /**
   * Send a message to the backend and handle streaming response
   * @param {Object} messageData - The message data to send
   * @param {string} messageData.input - User input
   * @param {string} messageData.story_type - Type of story
   * @param {string} messageData.conversation_id - Conversation ID
   * @param {AbortSignal} signal - Abort signal for cancelling request
   * @param {Function} onChunk - Callback for handling streaming chunks
   * @returns {Promise<void>}
   */
  async sendMessage(messageData, signal, onChunk) {
    const url = `${this.baseUrl}${API_CONFIG.ENDPOINTS.STREAM_STORY}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify(messageData),
        signal,
      });

      ApiUtils.validateResponse(response);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        // Accumulate chunks in buffer
        buffer += decoder.decode(value, { stream: true });
        
        // Process complete events from buffer
        const events = buffer.split('\n\n');
        
        // Keep the last incomplete event in buffer
        buffer = events.pop() || '';
        
        // Process all complete events
        for (const event of events) {
          if (event.trim()) {
            await this.processChunk(event + '\n\n', onChunk);
          }
        }
      }
      
      // Process any remaining data in buffer
      if (buffer.trim()) {
        await this.processChunk(buffer, onChunk);
      }
    } catch (error) {
      const errorMessage = ApiUtils.handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Process incoming chunk data
   * @param {string} chunk - Raw chunk data
   * @param {Function} onChunk - Callback for processed chunk
   */
  async processChunk(chunk, onChunk) {
    // Split the chunk into lines and process SSE format
    const lines = chunk.split('\n');
    let currentEvent = null;
    let currentData = null;

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) {
        // Empty line indicates end of event - process if we have both event and data
        if (currentEvent && currentData) {
          try {
            const parsed = JSON.parse(currentData);
            
            // Handle different event types
            switch (currentEvent) {
              case 'stream_start':
                console.log('Stream started:', parsed.data?.conversationId);
                break;
                
              case 'content_delta':
                // Content chunk received - this is what we want to display
                if (parsed.data?.text) {
                  onChunk(parsed.data.text);
                }
                break;
                
              case 'stream_end':
                console.log('Stream ended:', parsed.data?.stopReason);
                break;
                
              default:
                console.log(`Unknown event type: ${currentEvent}`, parsed);
            }
          } catch (parseError) {
            console.error('Error parsing event data:', parseError, currentData);
          }
        }
        
        // Reset for next event
        currentEvent = null;
        currentData = null;
        continue;
      }
      
      // Parse event line
      if (trimmedLine.startsWith('event:')) {
        currentEvent = trimmedLine.slice(6).trim();
      }
      // Parse data line
      else if (trimmedLine.startsWith('data:')) {
        currentData = trimmedLine.slice(5).trim();
      }
    }
    
    // Handle case where chunk ends without empty line
    if (currentEvent && currentData) {
      try {
        const parsed = JSON.parse(currentData);
        
        switch (currentEvent) {
          case 'stream_start':
            console.log('Stream started:', parsed.data?.conversationId);
            break;
            
          case 'content_delta':
            if (parsed.data?.text) {
              onChunk(parsed.data.text);
            }
            break;
            
          case 'stream_end':
            console.log('Stream ended:', parsed.data?.stopReason);
            break;
            
          default:
            console.log(`Unknown event type: ${currentEvent}`, parsed);
        }
      } catch (parseError) {
        console.error('Error parsing event data:', parseError, currentData);
      }
    }
  }

  /**
   * Health check for the backend service
   * @returns {Promise<boolean>}
   */
  async healthCheck() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.warn('Health check failed:', error.message);
      return false;
    }
  }

  /**
   * Validate message data before sending
   * @param {Object} messageData - Message data to validate
   * @returns {boolean}
   */
  validateMessageData(messageData) {
    if (!messageData.input || typeof messageData.input !== 'string') {
      throw new Error('Input is required and must be a string');
    }
    
    if (!messageData.story_type || typeof messageData.story_type !== 'string') {
      throw new Error('Story type is required and must be a string');
    }
    
    if (!messageData.conversation_id || typeof messageData.conversation_id !== 'string') {
      throw new Error('Conversation ID is required and must be a string');
    }
    
    if (messageData.input.trim().length === 0) {
      throw new Error('Input cannot be empty');
    }
    
    if (messageData.input.length > 1000) {
      throw new Error('Input is too long (maximum 1000 characters)');
    }
    
    return true;
  }
}

// Export singleton instance
const chatbotServiceInstance = new ChatbotService();
export default chatbotServiceInstance;
