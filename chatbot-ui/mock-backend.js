const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Simulated story content for different types
const storyTemplates = {
  horror: [
    "In the dead of night, shadows began to move on their own...",
    "The old mansion creaked as footsteps echoed from empty rooms...\n\n![Haunted mansion](https://images.unsplash.com/photo-1520637836862-4d197d17c50a?w=400)",
    "Her reflection showed something that wasn't there...",
    "The whispers grew louder as the candle flickered out..."
  ],
  fantasy: [
    "The dragon's eyes gleamed like emeralds in the moonlight...\n\n![Dragon](https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400)",
    "Magic sparkled through the enchanted forest...",
    "The wizard's staff pulsed with ancient power...",
    "Fairies danced around the mystical portal..."
  ],
  'sci-fi': [
    "The spaceship's engines hummed as they approached the unknown planet...\n\n![Spaceship](https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400)",
    "Artificial intelligence had evolved beyond human comprehension...",
    "Time travel was possible, but the consequences were dire...",
    "The alien technology defied all known physics..."
  ],
  romance: [
    "Their eyes met across the crowded ballroom...",
    "The letter arrived fifty years too late...",
    "Love found them in the most unexpected place...\n\n![Romantic sunset](https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400)",
    "The promise ring sparkled in the sunset..."
  ],
  adventure: [
    "The treasure map led to an uncharted island...\n\n![Treasure map](https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400)",
    "Through dense jungle and treacherous rapids...",
    "The mountain peak held secrets of the ancient civilization...",
    "With sword in hand, the hero faced the unknown..."
  ],
  mystery: [
    "The detective noticed something others had missed...",
    "The locked room held no clues, yet someone had been there...",
    "Every witness told a different story...",
    "The evidence pointed to an impossible conclusion..."
  ],
  comedy: [
    "The banana peel had been strategically placed...",
    "Murphy's Law was working overtime that day...",
    "The mix-up led to the most embarrassing situation...",
    "Laughter was the only medicine for this chaos..."
  ],
  drama: [
    "The family secret had been buried for decades...",
    "Forgiveness came at the highest price...",
    "The truth would change everything they believed...",
    "Sometimes the hardest person to face is yourself..."
  ]
};

// Helper function to generate story chunks
function generateStoryChunks(storyType, input) {
  const templates = storyTemplates[storyType] || storyTemplates.fantasy;
  const baseStory = templates[Math.floor(Math.random() * templates.length)];
  
  // Create a story inspired by the input
  const words = input.toLowerCase().split(' ');
  let story = baseStory;
  
  // Add some input-inspired content
  if (words.includes('dark') || words.includes('night')) {
    story += " The darkness seemed to swallow all hope...";
  }
  if (words.includes('quick') || words.includes('fast')) {
    story += " Time was running out quickly...";
  }
  if (words.includes('love') || words.includes('heart')) {
    story += " The heart knew what the mind refused to accept...";
  }
  
  // Split story into chunks for streaming
  const sentences = story.split(/(?<=[.!?])\s+/);
  const chunks = [];
  
  sentences.forEach((sentence, index) => {
    // Add some variation in chunk sizes
    if (index === 0) {
      chunks.push(sentence);
    } else {
      chunks.push(' ' + sentence);
    }
  });
  
  return chunks;
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main story streaming endpoint
app.post('/stream-story', (req, res) => {
  const { input, story_type, conversation_id } = req.body;
  
  console.log(`📖 Story request: ${input} (${story_type}) - Conversation: ${conversation_id}`);
  
  // Validate request
  if (!input || !story_type || !conversation_id) {
    return res.status(400).json({
      error: 'Missing required fields: input, story_type, conversation_id'
    });
  }
  
  // Set up Server-Sent Events
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });
  
  // Generate story chunks
  const chunks = generateStoryChunks(story_type, input);
  let chunkIndex = 0;
  const streamId = Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
  
  // Send stream start event
  res.write(`event:stream_start\n`);
  res.write(`data:${JSON.stringify({
    "type": "stream_start",
    "id": streamId,
    "data": {
      "conversationId": conversation_id,
      "model": "mock-backend",
      "usage": null
    },
    "metadata": null
  })}\n\n`);
  
  // Send chunks with realistic timing
  const sendNextChunk = () => {
    if (chunkIndex < chunks.length) {
      const chunk = chunks[chunkIndex];
      
      // Send content delta event
      res.write(`event:content_delta\n`);
      res.write(`data:${JSON.stringify({
        "type": "content_delta",
        "id": streamId,
        "data": {
          "text": chunk,
          "index": chunkIndex
        },
        "metadata": null
      })}\n\n`);
      
      chunkIndex++;
      
      // Random delay between 100ms and 800ms for realistic typing
      const delay = Math.random() * 700 + 100;
      setTimeout(sendNextChunk, delay);
    } else {
      // Send stream end event
      res.write(`event:stream_end\n`);
      res.write(`data:${JSON.stringify({
        "type": "stream_end",
        "id": streamId,
        "data": {
          "usage": {
            "inputTokens": input.split(' ').length,
            "outputTokens": chunks.join('').split(' ').length,
            "totalTokens": input.split(' ').length + chunks.join('').split(' ').length
          },
          "stopReason": "end_turn"
        },
        "metadata": null
      })}\n\n`);
      
      res.end();
      console.log(`✅ Story completed for conversation: ${conversation_id}`);
    }
  };
  
  // Start sending chunks after a brief delay
  setTimeout(sendNextChunk, 300);
  
  // Handle client disconnect
  req.on('close', () => {
    console.log(`🔌 Client disconnected from conversation: ${conversation_id}`);
    res.end();
  });
});

// Legacy endpoint for old format (kept for backward compatibility)
app.post('/stream-story-legacy', (req, res) => {
  const { input, story_type, conversation_id } = req.body;
  
  console.log(`📖 Legacy Story request: ${input} (${story_type}) - Conversation: ${conversation_id}`);
  
  // Validate request
  if (!input || !story_type || !conversation_id) {
    return res.status(400).json({
      error: 'Missing required fields: input, story_type, conversation_id'
    });
  }
  
  // Set up Server-Sent Events
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });
  
  // Generate story chunks
  const chunks = generateStoryChunks(story_type, input);
  let chunkIndex = 0;
  
  // Send chunks with realistic timing (old format)
  const sendNextChunk = () => {
    if (chunkIndex < chunks.length) {
      const chunk = chunks[chunkIndex];
      
      // Send as JSON format
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
      
      chunkIndex++;
      
      // Random delay between 100ms and 800ms for realistic typing
      const delay = Math.random() * 700 + 100;
      setTimeout(sendNextChunk, delay);
    } else {
      // Send completion signal
      res.write('data: [DONE]\n\n');
      res.end();
      console.log(`✅ Legacy story completed for conversation: ${conversation_id}`);
    }
  };
  
  // Start sending chunks after a brief delay
  setTimeout(sendNextChunk, 300);
  
  // Handle client disconnect
  req.on('close', () => {
    console.log(`🔌 Client disconnected from conversation: ${conversation_id}`);
    res.end();
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Mock backend server running on http://localhost:${port}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET  /health - Health check`);
  console.log(`   POST /stream-story - Story generation (matches your real backend format)`);
  console.log(`   POST /stream-story-legacy - Story generation (old format)`);
  console.log(`\n🎭 Supported story types: ${Object.keys(storyTemplates).join(', ')}`);
  console.log(`\n📖 Example request:`);
  console.log(`curl -X POST http://localhost:${port}/stream-story \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{"input":"tell me a story","story_type":"horror","conversation_id":"test-123"}'`);
});

module.exports = app;
