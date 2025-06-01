# AI Storyteller Chatbot

A modern, production-ready React chatbot application that communicates with a backend API via Server-Sent Events (SSE) to generate interactive stories.

## Features

- 🎨 **Modern UI**: Beautiful, responsive design with gradient backgrounds and smooth animations
- 🔄 **Real-time Streaming**: Server-Sent Events (SSE) support for streaming responses
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🎭 **Story Types**: Multiple story genres (Horror, Fantasy, Sci-Fi, Romance, Adventure, Mystery, Comedy, Drama)
- 💬 **Conversation Management**: Start new conversations and maintain context
- ⚡ **Error Handling**: Comprehensive error handling and recovery
- 🔧 **Production Ready**: Environment-based configuration, error reporting, and best practices

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- A backend server running on `localhost:8080` with the `/stream-story` endpoint

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.production.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:8080
   REACT_APP_DEBUG=true
   ```

## Development

1. **Start the development server**:
   ```bash
   npm start
   ```

2. **Open your browser** and navigate to `http://localhost:3000`

3. **Start your backend server** on `localhost:8080` with the required endpoint

## Backend API Requirements

Your backend should implement the following endpoint:

### POST `/stream-story`

**Request Body:**
```json
{
  "input": "tell me a story in 10 words",
  "story_type": "horror",
  "conversation_id": "f597d2ad-16d6-4ee2-8539-0feb07420ee0"
}
```

**Response:** Server-Sent Events stream

**Example curl command:**
```bash
curl --location 'localhost:8080/stream-story' \
--header 'Content-Type: application/json' \
--data '{
    "input":"tell me a story in 10 words",
    "story_type":"horror",
    "conversation_id":"f597d2ad-16d6-4ee2-8539-0feb07420ee0"
}'
```

**Expected SSE Response Format:**
```
data: {"content": "Once upon a time..."}
data: {"content": " there was a haunted house..."}
data: [DONE]
```

Or plain text format:
```
data: Once upon a time...
data:  there was a haunted house...
data: [DONE]
```

## Building for Production

1. **Create production environment file**:
   ```bash
   cp .env.production.example .env.production
   ```

2. **Update production settings** in `.env.production`

3. **Build the application**:
   ```bash
   npm run build
   ```

4. **Deploy the `build` folder** to your web server
