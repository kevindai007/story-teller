// Message types
export const MESSAGE_TYPES = {
  USER: 'user',
  BOT: 'bot',
  SYSTEM: 'system',
};

// Story types configuration
export const STORY_TYPES = [
  { 
    value: 'horror', 
    label: '🎃 Horror', 
    description: 'Scary and spooky stories',
    color: '#e53e3e'
  },
  { 
    value: 'fantasy', 
    label: '🧚 Fantasy', 
    description: 'Magical and mystical tales',
    color: '#9f7aea'
  },
  { 
    value: 'sci-fi', 
    label: '🚀 Sci-Fi', 
    description: 'Science fiction adventures',
    color: '#3182ce'
  },
  { 
    value: 'romance', 
    label: '💕 Romance', 
    description: 'Love and relationship stories',
    color: '#ed64a6'
  },
  { 
    value: 'adventure', 
    label: '⚔️ Adventure', 
    description: 'Action-packed journeys',
    color: '#38a169'
  },
  { 
    value: 'mystery', 
    label: '🔍 Mystery', 
    description: 'Puzzles and detective stories',
    color: '#d69e2e'
  },
  { 
    value: 'comedy', 
    label: '😄 Comedy', 
    description: 'Funny and humorous tales',
    color: '#fd971f'
  },
  { 
    value: 'drama', 
    label: '🎭 Drama', 
    description: 'Emotional and character-driven stories',
    color: '#718096'
  },
];

// Default messages
export const DEFAULT_MESSAGES = {
  WELCOME: "Hello! I'm your AI storyteller. Send me a message and I'll create a story for you. You can also select the story type below.",
  NEW_CONVERSATION: "New conversation started! What story would you like me to tell?",
  ERROR_GENERIC: "Sorry, I encountered an error while generating the story. Please try again.",
  GENERATING: "Generating story...",
};

// UI Constants
export const UI_CONSTANTS = {
  MAX_MESSAGE_LENGTH: parseInt(process.env.REACT_APP_MAX_MESSAGE_LENGTH) || 1000,
  AUTO_SCROLL_DELAY: 100,
  TYPING_DELAY: 50,
  MAX_TEXTAREA_HEIGHT: 120,
  MIN_TEXTAREA_HEIGHT: 20,
};

// Animation durations (in milliseconds)
export const ANIMATIONS = {
  FADE_IN: 300,
  SLIDE_IN: 250,
  BOUNCE: 400,
  TYPING_INDICATOR: 1000,
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1200,
};

// Theme colors
export const THEME_COLORS = {
  PRIMARY: '#667eea',
  SECONDARY: '#764ba2',
  SUCCESS: '#38a169',
  ERROR: '#e53e3e',
  WARNING: '#d69e2e',
  INFO: '#3182ce',
  LIGHT: '#f7fafc',
  DARK: '#2d3748',
};
