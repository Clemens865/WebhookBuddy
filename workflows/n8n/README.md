# N8N Workflows for Webhook Buddy

This directory contains N8N workflow examples that integrate with Webhook Buddy Chrome extension.

## 📋 Available Workflows

### 1. App Development Workflow
**File**: `webhook-buddy-app-development.json`

A comprehensive AI-powered app development workflow that transforms app ideas into complete project documentation:

**Features**:
- **AI App Analysis**: Processes app concepts using Claude and GPT models
- **Project Scope Generation**: Creates detailed project specifications
- **MVP Planning**: Generates roadmaps and feature prioritization
- **Technical Documentation**: Produces requirements, dependencies, and architecture docs
- **User Flow Design**: Creates comprehensive user journey documentation
- **Page Blueprints**: Generates detailed UI/UX specifications
- **Google Drive Integration**: Automatically saves all generated documents
- **Multi-AI Processing**: Uses Anthropic Claude, OpenAI GPT, and specialized prompts

**Use Cases**:
- Transform app ideas into development-ready specifications
- Generate comprehensive project documentation
- Create technical requirements and dependencies
- Produce user flows and page blueprints
- Automate project planning and scope definition

**Workflow Steps**:
1. Receives app concept via webhook
2. Analyzes and enhances the concept using AI
3. Generates project scope and MVP roadmap
4. Creates technical requirements and dependencies
5. Designs user flows and page blueprints
6. Produces scaling and administration strategies
7. Saves all documents to Google Drive
8. Generates project-specific coding rules

### 2. Basic Webhook Processing *(Coming Soon)*
**File**: `webhook-buddy-basic.json`

A foundational workflow that demonstrates how to:
- Receive webhook data from Webhook Buddy
- Parse and validate incoming data
- Process different data types (text, HTML, metadata)
- Handle errors and logging

## 🚀 Quick Setup

### Prerequisites
- N8N instance (cloud or self-hosted)
- Webhook Buddy Chrome extension installed
- Basic understanding of N8N workflows

### Installation Steps

1. **Import Workflow**
   - Download the `.json` file
   - In N8N, go to **Workflows** → **Import from File**
   - Select the downloaded JSON file
   - Click **Import**

2. **Configure Webhook Node**
   - Open the imported workflow
   - Click on the **Webhook** node
   - Copy the **Production URL**
   - Note: Use **Test URL** for development

3. **Set Up Webhook Buddy**
   - Open Webhook Buddy extension
   - Go to **Automation** tab
   - Create a new **Flow**
   - Paste the N8N webhook URL
   - Select data types to send
   - Test the connection

4. **Activate Workflow**
   - In N8N, click **Active** toggle
   - The workflow is now ready to receive data

## 🔒 Security & Credentials

### **⚠️ IMPORTANT: Credential Management**

The workflow files in this repository have been **sanitized** and contain placeholder credential IDs:
- `YOUR_ANTHROPIC_CREDENTIAL_ID` - Replace with your Anthropic API credential
- `YOUR_GOOGLE_DRIVE_CREDENTIAL_ID` - Replace with your Google Drive OAuth2 credential
- `YOUR_OPENAI_CREDENTIAL_ID` - Replace with your OpenAI API credential

### **🛡️ Before Using This Workflow**

1. **Set Up Your Credentials in N8N**:
   - Go to **Settings** → **Credentials** in your N8N instance
   - Add credentials for Anthropic, Google Drive, and OpenAI
   - Note down the credential IDs

2. **Update the Workflow**:
   - After importing, open each node that uses credentials
   - Select your actual credentials from the dropdown
   - Save the workflow

3. **Never Share Real Credential IDs**:
   - Credential IDs can provide access to your accounts
   - Always use placeholders when sharing workflows
   - Keep your actual credential IDs private

### **🔐 Required API Keys**

To use this workflow, you'll need:
- **Anthropic API Key**: For Claude AI processing
- **OpenAI API Key**: For GPT model processing
- **Google Drive OAuth2**: For document storage

Each service requires separate account setup and API key generation.

## 🔧 Configuration Options

### Webhook Node Settings
```json
{
  "httpMethod": "POST",
  "path": "webhook-buddy",
  "responseMode": "responseNode",
  "options": {}
}
```

### Expected Data Format
Webhook Buddy sends data in this format:
```json
{
  "url": "https://example.com",
  "title": "Page Title",
  "selectedText": "User selected text",
  "metadata": {
    "description": "Page description",
    "keywords": "keyword1, keyword2"
  },
  "headings": [
    {"level": "h1", "text": "Main Heading"},
    {"level": "h2", "text": "Sub Heading"}
  ],
  "paragraphs": ["Paragraph 1", "Paragraph 2"],
  "links": [
    {"text": "Link Text", "url": "https://link.com"}
  ],
  "images": [
    {"alt": "Image Alt", "src": "https://image.com/img.jpg"}
  ],
  "userContext": {
    "name": "User Name",
    "email": "user@example.com"
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## 🎯 Customization Ideas

### Data Processing
- **Filter Content**: Process only specific types of data
- **Transform Data**: Convert formats (HTML to Markdown, etc.)
- **Enrich Data**: Add external data sources
- **Validate Data**: Check data quality and completeness

### Integration Options
- **Databases**: Store in PostgreSQL, MongoDB, Airtable
- **Spreadsheets**: Save to Google Sheets, Excel Online
- **CRM Systems**: Add to Salesforce, HubSpot, Pipedrive
- **Messaging**: Send to Slack, Discord, Teams
- **AI Services**: Process with OpenAI, Claude, Gemini
- **Storage**: Save files to Google Drive, Dropbox, S3

### Workflow Patterns
- **Sequential Processing**: Step-by-step data handling
- **Parallel Processing**: Handle multiple data types simultaneously
- **Conditional Logic**: Different actions based on content
- **Error Handling**: Robust error management and retries
- **Scheduling**: Time-based processing and batching

## 🐛 Troubleshooting

### Common Issues

**Webhook Not Receiving Data**
- Check if workflow is **Active**
- Verify webhook URL in Webhook Buddy
- Test with N8N's **Test URL** first
- Check N8N logs for errors

**Data Format Issues**
- Verify expected JSON structure
- Check for missing required fields
- Validate data types in N8N nodes

**Authentication Problems**
- Ensure API keys are correctly set
- Check service-specific authentication
- Verify webhook permissions

### Debug Tips
- Use **Edit Fields** nodes to inspect data
- Add **Set** nodes for debugging variables
- Enable **Save Execution Data** in workflow settings
- Check execution history for error details

## 📚 Resources

- [N8N Documentation](https://docs.n8n.io/)
- [Webhook Buddy Documentation](../../README.md)
- [N8N Community](https://community.n8n.io/)
- [Webhook Best Practices](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)

## 🤝 Contributing

To contribute a new N8N workflow:

1. **Test Thoroughly**: Ensure the workflow works reliably
2. **Document Well**: Add clear descriptions and comments
3. **Follow Naming**: Use descriptive node names
4. **Include Examples**: Provide sample data and use cases
5. **Update README**: Add your workflow to this documentation

### Workflow Naming Convention
- Use descriptive names: `webhook-buddy-[purpose].json`
- Include version if applicable: `webhook-buddy-ai-v2.json`
- Keep names lowercase with hyphens

## 📄 License

These workflows are provided under the same MIT License as the main project.
