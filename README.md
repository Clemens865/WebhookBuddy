# 🪝 Webhook Buddy

<div align="center">
  <img src="public/icons/icon-128.png" alt="Webhook Buddy Logo" width="128" height="128">
  <h3>A powerful Chrome extension for web data processing workflows</h3>
  <p>Bridge your web browsing with automation, AI agents, and webhook integrations</p>
</div>

---

## 🚀 Overview

Webhook Buddy is a Chrome side panel extension that transforms how you interact with web data. It enables seamless collection, processing, and forwarding of web page content to webhooks, AI services, and custom endpoints through an intuitive interface.

**Perfect for:**
- 📊 Data researchers and analysts
- 🤖 AI workflow automation
- 📝 Content creators and writers
- 🔗 Webhook integration developers
- 🎯 Knowledge workers who need efficient data processing

---

## ✨ Features

### 🔄 **Automation System**
- **Smart Data Extraction**: Automatically extract HTML, text, metadata, headings, paragraphs, links, and images
- **Category Management**: Organize workflows with hierarchical categories
- **Flow Configuration**: Define custom data processing flows with webhook endpoints
- **Real-time Processing**: Execute flows instantly and view webhook responses
- **Error Handling**: Built-in retry mechanisms and rate limiting protection
- **Activity Logging**: Track all automation activities for debugging

### 📝 **Prompts Management**
- **Template System**: Create reusable text prompts with dynamic variables
- **Variable Support**: Use `{selected_text}`, `{url}`, `{title}` and custom variables
- **Category Organization**: Organize prompts by use case and scenario
- **Export/Import**: Backup and share prompt libraries in JSON format
- **Version History**: Track changes and revert to previous versions
- **Search & Filter**: Quickly find prompts with advanced filtering
- **Token Counting**: Monitor prompt length and token usage

### 🤖 **Agent System**
- **AI Chat Interface**: Modern conversation UI for AI interactions
- **OpenAI Integration**: Built-in support for GPT models
- **Custom Webhooks**: Connect to any AI service via webhook
- **Rich Messages**: Send text, page content, selected text, and images
- **Persistent History**: Conversations saved across browser sessions
- **Streaming Responses**: Real-time response streaming from supported APIs
- **Context Management**: Smart token counting and context optimization
- **Multi-Agent Support**: Switch between different agents seamlessly

### 🎙️ **Voice System**
- **Voice Channels**: Create dedicated channels for different use cases
- **High-Quality Recording**: Professional audio capture with visualization
- **Webhook Integration**: Send recordings to transcription and processing services
- **Context Enrichment**: Include page data and user context with recordings
- **Playback Controls**: Review recordings before sending
- **Metadata Support**: Rich audio metadata for processing workflows

### 👤 **User Profile & Settings**
- **Profile Management**: Configure user information and preferences
- **Dark/Light Mode**: Automatic theme detection with manual override
- **Secure Storage**: Encrypted storage for API keys and sensitive data
- **Export Settings**: Backup and restore configuration
- **Privacy Controls**: Granular control over data sharing

---

## 🛠️ Installation

### **Option 1: Chrome Web Store** *(Coming Soon)*
*This extension will be available on the Chrome Web Store soon.*

### **Option 2: Developer Installation**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Clemens865/WebhookBuddy.git
   cd webhook-buddy
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **"Developer mode"** (toggle in top-right corner)
   - Click **"Load unpacked"** and select the `dist` folder
   - The Webhook Buddy icon should appear in your Chrome toolbar

5. **Verify Installation**
   - Click the extension icon or press `Ctrl+Shift+.` (Windows/Linux) or `Cmd+Shift+.` (Mac)
   - Select "Webhook Buddy" from the side panel dropdown
   - You should see the main interface with four tabs: Automation, Prompts, Voice, Agent

---

## 📖 Quick Start Guide

### **1. Initial Setup**
- Click the **"Set Up Profile"** button to configure your user information
- Toggle **Dark Mode** if preferred
- Configure any API keys you plan to use (OpenAI, custom services)

### **2. Create Your First Automation**
- Go to the **"Automation"** tab
- Click **"Add"** in the Categories section to create a category
- Click **"Add"** in the Flows section to create your first flow
- Configure a webhook endpoint and select data types to extract
- Test the flow on any webpage

### **3. Set Up Prompts**
- Navigate to the **"Prompts"** tab
- Create categories for different types of prompts
- Add prompts with variables like `{selected_text}` or `{url}`
- Use prompts in automation flows or agent conversations

### **4. Try Voice Recording**
- Go to the **"Voice"** tab
- Create a voice channel with a webhook endpoint
- Record a message and send it for processing
- View the webhook response

### **5. Chat with AI Agents**
- Open the **"Agent"** tab
- Configure an OpenAI API key or custom webhook endpoint
- Start a conversation and include page context
- Attach images or documents to messages

---

## 🔧 Configuration

### **API Keys & Security**
- All API keys are encrypted and stored locally in Chrome's secure storage
- Keys are never transmitted except to their intended services
- Use the profile settings to manage API keys securely

### **Webhook Endpoints**
- Support for both JSON and multipart/form-data formats
- Custom headers and authentication supported
- Built-in retry logic with exponential backoff
- Response visualization and error handling

### **Data Types**
Webhook Buddy can extract and send:
- **Page Metadata**: Title, URL, description, keywords
- **Content**: Headings (H1-H6), paragraphs, selected text
- **Media**: Images with metadata and optional compression
- **Structure**: Links, lists, tables
- **User Context**: Profile information, timestamps
- **Audio**: Voice recordings with metadata

---

## 🏗️ Technical Details

### **Architecture**
- **Frontend**: React 18+ with TypeScript for type safety
- **Styling**: TailwindCSS with custom design system
- **Storage**: IndexedDB via Dexie.js for large datasets, Chrome Storage API for configuration
- **Extension**: Chrome Manifest V3 with side panel API
- **State Management**: React Context API with custom hooks
- **Build**: Webpack with optimized production builds

### **Performance**
- Lazy loading for optimal performance
- Virtual scrolling for large datasets
- Debounced inputs and efficient re-renders
- Web workers for CPU-intensive tasks
- Optimized bundle splitting

### **Security**
- Content Security Policy compliant
- API key encryption using Chrome's storage
- Input validation and sanitization
- HTTPS enforcement for external requests
- Minimal permissions model

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Setup**
```bash
# Clone and install
git clone https://github.com/yourusername/webhook-buddy.git
cd webhook-buddy
npm install

# Start development
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

### **Project Structure**
```
src/
├── background/     # Background scripts
├── content/        # Content scripts
├── sidepanel/      # Main React application
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── services/       # API and data services
├── types/          # TypeScript definitions
└── utils/          # Utility functions
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/Clemens865/WebhookBuddy/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Clemens865/WebhookBuddy/discussions)
- **Documentation**: [Wiki](https://github.com/Clemens865/WebhookBuddy/wiki)

---

<div align="center">
  <p>Made with ❤️ for the automation community</p>
  <p>⭐ Star this repo if you find it useful!</p>
</div>
