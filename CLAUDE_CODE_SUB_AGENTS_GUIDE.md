# Claude Code Sub-Agents: Complete Guide

## 🎯 Overview

Claude Code sub-agents are specialized AI assistants that handle specific types of tasks. They work like having different experts for different jobs, each with their own focus and tools. This guide is based on the YouTube video demonstrating how to create and use sub-agents in Claude Code.

## 🔑 Key Concepts

### 1. **Sub-Agent Architecture**

```
User → Primary Agent → Sub-Agents (in parallel) → Primary Agent → User
```

- **Primary Agent**: The main Claude interface that receives user requests
- **Sub-Agents**: Specialized agents that handle specific tasks
- **Parallel Execution**: Sub-agents can run simultaneously, not sequentially
- **Result Synthesis**: Primary agent combines sub-agent responses into a coherent answer

### 2. **Each Sub-Agent Has**

- **System Prompt**: Specific instructions for that agent's role
- **Tool Set**: Limited, focused tools for better accuracy
- **Context Window**: Independent memory space, not shared with primary agent

### 3. **Why Use Sub-Agents?**

- **Tool Overload**: Adding too many tools to one agent reduces consistency
- **Specialization**: Each sub-agent can be optimized for specific tasks
- **Parallel Processing**: Multiple tasks can run simultaneously
- **Better Success Rate**: Fewer tools per agent = higher accuracy

## 🛠️ Setting Up Sub-Agents

### Step 1: Install Claude Code
```bash
# Install Claude Code (if not already installed)
npx @anthropic-ai/claude-cli
```

### Step 2: Create Project Structure
```bash
# Create project folder
mkdir testing-sub-agents
cd testing-sub-agents

# Claude Code will create this structure:
.claude/
└── agents/
    ├── x-api-poster.md
    ├── image-generator.md
    └── web-research-specialist.md
```

### Step 3: Create Sub-Agents

Use the `/agents` command in Claude Code:

```bash
# In Claude Code terminal
/agents

# Select options:
# 1. Project (for project-specific agents)
# 2. Generate with Claude
# 3. Describe what the agent should do
```

## 📝 Sub-Agent File Format

Each sub-agent is a markdown file with YAML frontmatter:

```markdown
---
name: x-api-poster
description: Use this agent when you need to post content to X (Twitter)
color: blue  # Visual indicator in terminal
---

You are an expert X (formerly Twitter) API integration specialist.

Your core responsibilities:
- Compose and post tweets
- Handle media uploads
- Manage API authentication

## Tools Available
- X API posting functionality
- Media handling capabilities

## Important Guidelines
- Keep tweets under 280 characters
- Always verify successful posting
- Handle errors gracefully
```

## 🎨 Example Sub-Agents from the Video

### 1. **X API Poster (Blue)**
- **Purpose**: Post tweets to Twitter/X
- **Tools**: X API integration
- **Keys Required**: API key, API secret, Access token, Access secret

### 2. **Image Generator (Green)**
- **Purpose**: Generate images and videos
- **Tools**: FAL API (Flux model, video generation)
- **Keys Required**: FAL API key

### 3. **Web Research Specialist (Cyan)**
- **Purpose**: Research topics on the web
- **Tools**: Web search, content synthesis
- **Keys Required**: None (uses built-in search)

## 🚀 Using Sub-Agents

### Basic Usage
```bash
# The primary agent automatically delegates based on task
"Please research AI trends and create a tweet about it with an image"

# Claude will:
# 1. Use web-research-specialist for research
# 2. Use image-generator for visual content
# 3. Use x-api-poster to tweet
```

### What Happens Behind the Scenes

1. **Primary agent** analyzes your request
2. **Delegates** to appropriate sub-agents based on their descriptions
3. **Sub-agents execute** in parallel (not sequentially)
4. **Results return** to primary agent
5. **Primary agent synthesizes** and responds to you

## 🎯 Best Practices

### 1. **Keep Sub-Agents Focused**
- Limit tools per agent (ideally 2-5)
- Single responsibility principle
- Clear, specific system prompts

### 2. **Write Good Descriptions**
```markdown
---
description: Use this agent when you need to analyze code quality, find bugs, or review pull requests
---
```

### 3. **Test Independently**
- Test each sub-agent separately before combining
- Verify tool functionality
- Check error handling

### 4. **Organize Outputs**
```javascript
// In sub-agent instructions:
"Always save generated images to the outputs/ folder"
"Name files descriptively: space-panda-2024-01-15.png"
```

## 🔧 Advanced Configuration

### API Key Management
```markdown
# Create sensitive-keys.md (add to .gitignore!)
X_API_KEY=your-key-here
X_API_SECRET=your-secret-here
FAL_API_KEY=your-fal-key-here
```

### Color Coding
- Helps identify which agent is working
- Set in agent creation dialog
- Shows in terminal output

### Tool Configuration
```javascript
// Example tool setup in agent
const tools = {
  postToX: async (content, mediaPath) => {
    // Implementation
  },
  generateImage: async (prompt, model) => {
    // Implementation
  }
};
```

## 📊 Real-World Example: CMO Agent

The video demonstrates building a Chief Marketing Officer (CMO) agent:

```
CMO Agent (Primary)
├── X API Poster (Posts to social media)
├── Image Generator (Creates visuals)
└── Web Research (Gathers information)
```

### Workflow Example
1. **Request**: "Create and post a tweet about our new feature"
2. **CMO delegates to**:
   - Web Research: Find trending topics
   - Image Generator: Create relevant visual
   - X API Poster: Compose and post tweet
3. **Result**: Automated social media post with research-backed content

## 🚨 Common Issues and Solutions

### Issue: Sub-agent not being called
**Solution**: Check the agent's description - it must clearly indicate when to use it

### Issue: Tools failing
**Solution**: Verify API keys are correctly set and have proper permissions

### Issue: Slow performance
**Solution**: Sub-agents run in parallel by default, but check for blocking operations

## 🔮 Future Possibilities

As demonstrated in the video, sub-agents enable:
- **24/7 Automation**: Agents running continuously
- **Complex Workflows**: Hundreds of tools organized into specialized agents
- **Business Integration**: Connect to Notion, Buffer, Analytics, etc.
- **Passive Productivity**: Set up once, runs forever

## 📚 Key Takeaways

1. **Sub-agents solve the "too many tools" problem**
2. **Parallel execution makes complex tasks faster**
3. **Each agent has its own context window**
4. **Specialization improves success rates**
5. **The primary agent doesn't see sub-agent implementation details**

## 🎬 Video Summary

The presenter (building "Vibe Mo" - an AI CMO) demonstrates:
- Creating three sub-agents (Twitter, Image Gen, Web Research)
- Sub-agents working in parallel
- Automatic delegation based on task requirements
- Real posting to Twitter with generated images
- Vision for 24/7 automated marketing operations

The goal: Replace manual CMO tasks with AI agents that can run continuously, make decisions, and execute marketing strategies autonomously.

---

*Note: This guide is based on the YouTube video "Claude Code Sub-Agents" demonstrating the feature released by Anthropic. The feature allows creating specialized AI assistants that work together to accomplish complex tasks more efficiently than a single agent with many tools.*