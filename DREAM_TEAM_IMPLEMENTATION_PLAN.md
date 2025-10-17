# Dream Team Implementation Plan

## 🎯 Overview

This document outlines the complete implementation plan for the enhanced dream team system, incorporating:
1. Model selection best practices from Text 1
2. Custom Bash tools and common-log bus from Text 2

## 📋 Implementation Phases

### Phase 1: Model Optimization
Update all dream team agents with explicit model specifications based on the guidelines.

#### Changes to Agent Files:
```yaml
# orchestrator-prime.md
---
name: orchestrator-prime
model: opus  # Changed from implicit to explicit
# or use exact version: claude-4-opus-20250701
---

# development-lead.md
---
name: development-lead
model: sonnet  # Explicit model declaration
---

# rapid-prototype.md
---
name: rapid-prototype
model: haiku  # Fast and cheap for MVPs
---
```

#### Project Settings Configuration:
```json
// .claude/settings.json
{
  "model": "claude-3-5-sonnet-20250622",  // Default for main Claude
  "env": {
    "ANTHROPIC_SMALL_FAST_MODEL": "claude-3-5-haiku-20250724"  // Auto-downgrade for background tasks
  }
}
```

### Phase 2: Custom Bash Tools Infrastructure

#### Directory Structure:
```
dream-team-agents/
├── .claude/
│   ├── commands/        # Slash commands for tools
│   ├── agents/          # Agent definitions
│   ├── logs/            # Common log bus
│   │   └── agents.ndjson
│   └── CLAUDE.md        # Updated documentation
├── bin/                 # Custom bash tools
│   ├── agent-orchestrate
│   ├── agent-monitor
│   ├── agent-communicate
│   └── agent-health
└── scripts/
    ├── log_bus.sh       # Common logging infrastructure
    └── test/            # BATS tests for tools
```

### Phase 3: Common-Log Bus Implementation

#### Core Components:

1. **log_bus.sh** - Shared logging infrastructure
   - Atomic writes with flock
   - JSON-Lines format
   - Rotation support
   - Command bus pattern

2. **Enhanced Agent Communication**
   ```json
   {
     "ts": "2025-08-03T12:34:56Z",
     "agent": "ui-specialist",
     "level": "INFO",
     "topic": "task",
     "payload": "Component created successfully",
     "task_id": "task_123",
     "parent_agent": "development-lead",
     "model": "sonnet"
   }
   ```

3. **Inter-Agent Commands**
   ```json
   {
     "topic": "cmd",
     "payload": {
       "action": "review_code",
       "target": "code-reviewer",
       "params": {"pr": 123}
     }
   }
   ```

### Phase 4: Custom Tools

#### 1. **agent-orchestrate**
- Execute orchestration patterns (sequential, parallel, review, dynamic)
- Model override support
- Task tracking with IDs
- Integration with log bus

#### 2. **agent-monitor**
- Real-time log monitoring
- Filtering by agent/level/topic
- Statistics dashboard
- JSON or human-readable output

#### 3. **agent-communicate**
- Send commands between agents
- Wait for acknowledgments
- Query agent status
- Broadcast messages

#### 4. **agent-health**
- Check agent responsiveness
- Monitor resource usage
- Detect stuck tasks
- Alert on anomalies

### Phase 5: Enhanced Agent Definitions

#### Updated Agent Template:
```yaml
---
name: agent-name
description: Clear description for auto-selection
model: sonnet|haiku|opus
tools: [List, Of, Tools]
communication:
  subscribes: [topics, to, monitor]
  publishes: [topics, it, emits]
---

You are [agent role]...

## Communication Protocol
- Log all significant actions to common bus
- Subscribe to: [list topics]
- Respond to commands: [list commands]
- Use task_id for traceability
```

### Phase 6: Integration Patterns

#### 1. **Orchestrator Integration**
```bash
# In orchestrator-prime system prompt:
When coordinating work:
1. Generate unique task_id
2. Log task assignment to common bus
3. Monitor for completion signals
4. Aggregate results
```

#### 2. **Team Lead Integration**
```bash
# In development-lead:
For each specialist task:
1. Inherit task_id from orchestrator
2. Log delegation details
3. Monitor specialist progress
4. Report completion upstream
```

#### 3. **Specialist Integration**
```bash
# In each specialist:
1. Log task acceptance
2. Stream progress updates
3. Log completion with results
4. Listen for abort signals
```

## 🎨 Enhanced Visualization Updates

### New Features for HTML Dashboard:
1. **Real-time Log Stream** - Show agent communication
2. **Model Indicators** - Visual badges for haiku/sonnet/opus
3. **Task Flow Animation** - Animate active task paths
4. **Performance Metrics** - Response times, success rates
5. **Cost Tracking** - Model usage costs

## 🔧 Configuration Management

### Environment Variables:
```bash
# Model selection
export ANTHROPIC_MODEL=sonnet
export ANTHROPIC_SMALL_FAST_MODEL=claude-3-5-haiku-20250724

# Logging
export CLAUDE_LOG_DIR=/path/to/logs
export MAX_LOG_SIZE_MB=100

# Performance
export AGENT_TIMEOUT=300
export PARALLEL_LIMIT=5
```

### Permission Updates:
```bash
# Add to .claude/CLAUDE.md
## Custom Tools
- agent-orchestrate: Orchestrate complex workflows
- agent-monitor: Monitor agent communication
- agent-communicate: Send inter-agent messages
- agent-health: Check system health

# Whitelist in permissions
Bash(agent-orchestrate:*)
Bash(agent-monitor:*)
Bash(agent-communicate:*)
Bash(agent-health:*)
```

## 📊 Success Metrics

### Performance Targets:
- 80% of tasks complete without retry
- <2s average response time for haiku agents
- <10s for complex sonnet operations
- Zero message loss in log bus
- 99.9% uptime for core agents

### Cost Optimization:
- 70% haiku usage for utilities
- 25% sonnet for general work
- 5% opus for critical decisions
- Daily cost tracking and alerts

## 🚀 Rollout Plan

### Week 1: Foundation
- [ ] Update all agents with model specifications
- [ ] Deploy logging infrastructure
- [ ] Create basic monitoring tools

### Week 2: Integration
- [ ] Integrate log bus with all agents
- [ ] Implement orchestration patterns
- [ ] Test inter-agent communication

### Week 3: Optimization
- [ ] Performance tuning
- [ ] Cost analysis and optimization
- [ ] Enhanced monitoring dashboard

### Week 4: Production
- [ ] Full system deployment
- [ ] Documentation updates
- [ ] Team training

## 🔒 Risk Mitigation

1. **Backward Compatibility**
   - Keep existing agent interfaces
   - Gradual migration approach
   - Fallback mechanisms

2. **Performance**
   - Log rotation to prevent growth
   - Async communication patterns
   - Resource limits per agent

3. **Cost Control**
   - Model usage quotas
   - Automatic downgrade rules
   - Budget alerts

## 📚 Documentation Updates

### New Sections for CLAUDE.md:
1. Model Selection Guide
2. Custom Tools Reference
3. Communication Patterns
4. Troubleshooting Guide
5. Performance Tuning

### Training Materials:
1. Video: "Understanding Agent Communication"
2. Guide: "Choosing the Right Model"
3. Tutorial: "Building Custom Tools"
4. Reference: "Log Bus Query Patterns"

---

**This plan provides a complete blueprint for enhancing the dream team with:**
- Explicit model control for cost/performance optimization
- Robust bash tooling following best practices
- Real-time agent communication via log bus
- Enhanced monitoring and orchestration capabilities

**Next Steps:** Review this plan and indicate which components to implement first.