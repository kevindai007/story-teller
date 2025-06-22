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

// Simulated story content for different types with markdown formatting
const storyTemplates = {
  horror: [
    "In the **dead of night**, shadows began to move on their own...\n\n> *The darkness whispered secrets no mortal should hear.*",
    "The old mansion creaked as footsteps echoed from empty rooms...\n\n![Haunted mansion](https://images.unsplash.com/photo-1520637836862-4d197d17c50a?w=400)\n\n- Strange sounds from the attic\n- Doors that open by themselves\n- Cold spots in the hallway",
    "Her reflection showed something that ***wasn't there***...\n\n```\nMirror, mirror on the wall,\nWho's the deadest of them all?\n```",
    "The whispers grew louder as the candle `flickered out`..."
  ],
  fantasy: [
    "# The Dragon's Tale\n\nThe dragon's eyes gleamed like **emeralds** in the moonlight...\n\n![Dragon](https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400)\n\n## Ancient Powers\n\n1. Fire breath that could melt steel\n2. Scales harder than diamond\n3. Wings that could block out the sun",
    "## The Enchanted Forest\n\nMagic sparkled through the enchanted forest...\n\n> *\"Magic is not about power, but about understanding the flow of nature.\"* - Ancient Wizard",
    "The wizard's staff pulsed with ***ancient power***...\n\n| Spell | Effect | Mana Cost |\n|-------|--------|----------|\n| Fireball | 20 damage | 5 |\n| Heal | Restore 15 HP | 3 |\n| Lightning | 35 damage | 8 |",
    "Fairies danced around the mystical portal...\n\n- ✨ Sparkles of light\n- 🧚 Tiny wings fluttering\n- 🌟 Magic in the air"
  ],
  'sci-fi': [
    "# Space Odyssey\n\nThe spaceship's engines hummed as they approached the **unknown planet**...\n\n![Spaceship](https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400)\n\n## Ship Status\n\n```json\n{\n  \"fuel\": \"78%\",\n  \"shields\": \"operational\",\n  \"crew\": \"5 members\"\n}\n```",
    "Artificial intelligence had evolved beyond human comprehension...\n\n> The AI spoke: *\"I think, therefore I am... but what am I?\"*",
    "Time travel was possible, but the consequences were **dire**...\n\n⚠️ **Warning**: Temporal paradoxes detected",
    "The alien technology defied all known physics...\n\n~~Impossible~~ → **Achieved**"
  ],
  romance: [
    "# A Love Story\n\nTheir eyes met across the **crowded ballroom**...\n\n💕 *Love at first sight*",
    "## The Letter\n\nThe letter arrived fifty years too late...\n\n> *\"My dearest love, if you're reading this, then time has found a way...\"*",
    "Love found them in the most ***unexpected place***...\n\n![Romantic sunset](https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400)\n\n- [ ] First glance\n- [x] First conversation  \n- [x] First date\n- [ ] Forever",
    "The promise ring sparkled in the `sunset`..."
  ],
  adventure: [
    "# The Treasure Hunt\n\nThe treasure map led to an **uncharted island**...\n\n![Treasure map](https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400)\n\n## Journey Ahead\n\n1. Cross the raging river\n2. Navigate through the dense jungle  \n3. Climb the treacherous mountain\n4. Find the hidden cave",
    "Through **dense jungle** and treacherous rapids...\n\n> *Adventure is not about the destination, but the courage to begin the journey.*",
    "The mountain peak held secrets of the ***ancient civilization***...\n\n```\nInscription found:\n\"Only the brave shall claim\nWhat time has hidden away\"\n```",
    "With sword in hand, the hero faced the `unknown`...\n\n⚔️ **Battle Mode Activated**"
  ],
  mystery: [
    "# The Detective's Case\n\nThe detective noticed something others had **missed**...\n\n🔍 *Evidence found*",
    "## The Locked Room\n\nThe locked room held no clues, yet someone had been there...\n\n| Evidence | Location | Significance |\n|----------|----------|-------------|\n| Footprint | Window | Size 9 boot |\n| Hair | Carpet | Blonde, 6 inches |\n| Watch | Table | Stopped at 3:17 |",
    "Every witness told a ***different story***...\n\n> Witness 1: *\"I saw him leave at midnight.\"*\n> \n> Witness 2: *\"He never left the building.\"*\n> \n> Witness 3: *\"There was no one there at all.\"*",
    "The evidence pointed to an `impossible` conclusion..."
  ],
  comedy: [
    "# Comedy of Errors\n\nThe banana peel had been **strategically placed**...\n\n🍌 *Classic comedy setup*",
    "Murphy's Law was working ***overtime*** that day...\n\n- [x] Everything that can go wrong\n- [x] Will go wrong\n- [x] At the worst possible moment",
    "The mix-up led to the most **embarrassing situation**...\n\n> *\"Well, this is awkward...\"* 😅",
    "Laughter was the only medicine for this `chaos`...\n\n## Prescription\n\n```\nDr. Comedy's Orders:\n- 3 belly laughs daily\n- 1 hearty chuckle with meals\n- Unlimited giggles as needed\n```"
  ],
  drama: [
    "# Family Secrets\n\nThe family secret had been buried for **decades**...\n\n> *\"Some truths are too painful to speak, yet too important to forget.\"*",
    "Forgiveness came at the ***highest price***...\n\n💔 **The cost of love**",
    "The truth would change everything they **believed**...\n\n| Before | After |\n|--------|-------|\n| Trust | Doubt |\n| Love | Pain |\n| Family | Strangers |",
    "Sometimes the hardest person to face is `yourself`...\n\n## Self-Reflection\n\n- Who am I really?\n- What do I stand for?\n- Can I forgive myself?"
  ],
  monster: [
    "# The Monster's Awakening\n\nThe creature stirred in the **depths of darkness**...\n\n![Monster silhouette](https://images.unsplash.com/photo-1520637836862-4d197d17c50a?w=400)\n\n## Monster Stats\n\n| Attribute | Value |\n|-----------|-------|\n| Strength | 💪💪💪💪💪 |\n| Speed | ⚡⚡⚡ |\n| Intelligence | 🧠🧠 |\n| Scariness | 😱😱😱😱😱 |",
    "***Tentacles*** writhed in the murky water...\n\n> *\"From the depths it rises, ancient and terrible.\"*",
    "The beast's roar echoed through the `forbidden forest`...\n\n```\nMonster roar detected:\n- Frequency: 20Hz\n- Volume: 120dB\n- Effect: Terror\n```",
    "Glowing eyes pierced through the **midnight fog**...\n\n- [x] Sharp claws\n- [x] Razor teeth  \n- [x] Supernatural strength\n- [ ] Mercy"
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
