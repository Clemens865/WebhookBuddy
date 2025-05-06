# Yorizon Buddy Chrome Extension

## Overview
Yorizon Buddy is a powerful Chrome side panel extension designed to bridge web browsing with data processing workflows. It enables users to collect, process, and send web page data to webhooks and AI agents through four main components: Automation System, Prompts Management, Agent System, and Voice System.

## Features

### Automation System
- Create and manage categories for organizing workflows
- Define flows with webhooks to process page data
- Execute flows to send current page data to configured webhooks
- Organize workflows in a visual, user-friendly interface

### Prompts Management
- Create and manage prompts with system and user components
- Associate prompts with flows for consistent AI interactions
- Organize prompts for different use cases and scenarios

### Voice System
- Create voice channels with webhook endpoints
- Record voice messages directly in the extension
- Send voice recordings with user and page context to webhooks
- High-quality audio processing with metadata

### Agent System
- Configure AI agents with webhook endpoints
- Chat with agents through a modern chat interface
- Attach files (images, documents) to messages
- Send messages with user and page context

### User Profile
- Configure user information (name, email, URL, mission statement)
- Persistent storage of user preferences
- Dark mode support

## Technical Details

### Technology Stack
- **Frontend**: React 18+ with TypeScript
- **Styling**: TailwindCSS with custom theme
- **Storage**: IndexedDB via Dexie.js
- **Extension Framework**: Chrome Extension Manifest V3
- **State Management**: React Context API and custom hooks

### Data Processing
- Extracts page metadata, headings, and content
- Processes and formats data for webhook consumption
- Handles binary data (audio, images) efficiently
- Supports both JSON and multipart/form-data formats

## Installation

### Development Mode
1. Clone the repository
2. Install dependencies: `npm install`
3. Build the extension: `npm run build`
4. Load the extension in Chrome:
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` directory

### Usage
1. Open the Chrome side panel (Ctrl+Shift+.)
2. Select Yorizon Buddy from the side panel dropdown
3. Configure your user profile
4. Start using the different features (Automation, Prompts, Voice, Agent)

## License
All rights reserved. This project is proprietary and confidential.

## Contact
For support or inquiries, please contact [support@yorizon.com](mailto:support@yorizon.com)
