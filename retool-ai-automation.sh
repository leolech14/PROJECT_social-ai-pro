#!/bin/bash

# 🚀 Retool AI Automation Suite for Power Users
# Combines terminal AI agents with Retool app creation

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Configuration
RETOOL_API_KEY="${RETOOL_API_KEY:-}"
CLAUDE_API_KEY="${CLAUDE_API_KEY:-}"
OPENAI_API_KEY="${OPENAI_API_KEY:-}"

# Functions
print_banner() {
    echo -e "${PURPLE}╔════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║     Retool AI Automation Suite v2.0        ║${NC}"
    echo -e "${PURPLE}║       Terminal AI + Retool Power           ║${NC}"
    echo -e "${PURPLE}╚════════════════════════════════════════════╝${NC}"
    echo
}

# Generate Retool app using AI
generate_retool_app() {
    local APP_TYPE=$1
    local APP_NAME=$2
    local AI_MODEL=${3:-claude}
    
    echo -e "${BLUE}🤖 Generating $APP_TYPE app: $APP_NAME${NC}"
    
    # Create generation prompt
    cat > .tmp_prompt.txt << EOF
Create a complete Retool application JSON export for:

Application Type: $APP_TYPE
Application Name: $APP_NAME

Requirements:
1. Modern, responsive UI with dark theme
2. Complete CRUD operations
3. Data validation and error handling
4. Search and filter capabilities
5. Export functionality
6. Mobile-responsive design

Include:
- All UI components with proper layout
- REST API resource configurations
- State management variables
- Query definitions with transformers
- Custom CSS for professional styling
- Event handlers and business logic

Use Retool JSON export format version 3.78.0
Make it production-ready with proper error handling
EOF

    # Generate based on selected AI
    case $AI_MODEL in
        claude)
            if command -v claude &> /dev/null; then
                claude < .tmp_prompt.txt > "${APP_NAME}.json"
            else
                echo -e "${YELLOW}Claude CLI not found. Using curl...${NC}"
                generate_with_api "claude" "${APP_NAME}"
            fi
            ;;
        openai)
            generate_with_api "openai" "${APP_NAME}"
            ;;
        *)
            echo -e "${YELLOW}Unknown AI model. Using template...${NC}"
            generate_from_template "$APP_TYPE" "${APP_NAME}"
            ;;
    esac
    
    # Cleanup
    rm -f .tmp_prompt.txt
    
    # Validate generated JSON
    if jq . "${APP_NAME}.json" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Valid JSON generated${NC}"
        
        # Pretty print and minify
        jq . "${APP_NAME}.json" > "${APP_NAME}_formatted.json"
        jq -c . "${APP_NAME}.json" > "${APP_NAME}_minified.json"
        
        return 0
    else
        echo -e "${YELLOW}⚠️  Invalid JSON generated. Attempting to fix...${NC}"
        fix_json "${APP_NAME}.json"
    fi
}

# Generate using API calls
generate_with_api() {
    local AI_TYPE=$1
    local OUTPUT_FILE=$2
    
    case $AI_TYPE in
        claude)
            curl -s -X POST https://api.anthropic.com/v1/messages \
                -H "x-api-key: $CLAUDE_API_KEY" \
                -H "anthropic-version: 2023-06-01" \
                -H "content-type: application/json" \
                -d "{
                    \"model\": \"claude-3-opus-20240229\",
                    \"max_tokens\": 8000,
                    \"messages\": [{
                        \"role\": \"user\",
                        \"content\": \"$(cat .tmp_prompt.txt | jq -Rs .)\"
                    }]
                }" | jq -r '.content[0].text' > "${OUTPUT_FILE}.json"
            ;;
        openai)
            curl -s https://api.openai.com/v1/chat/completions \
                -H "Authorization: Bearer $OPENAI_API_KEY" \
                -H "Content-Type: application/json" \
                -d "{
                    \"model\": \"gpt-4-turbo\",
                    \"messages\": [{
                        \"role\": \"user\",
                        \"content\": \"$(cat .tmp_prompt.txt | jq -Rs .)\"
                    }],
                    \"max_tokens\": 8000
                }" | jq -r '.choices[0].message.content' > "${OUTPUT_FILE}.json"
            ;;
    esac
}

# Generate from template
generate_from_template() {
    local TEMPLATE_TYPE=$1
    local APP_NAME=$2
    
    echo -e "${BLUE}📋 Using template: $TEMPLATE_TYPE${NC}"
    
    # Base template structure
    cat > "${APP_NAME}.json" << 'EOF'
{
  "name": "APP_NAME_PLACEHOLDER",
  "uuid": "APP_UUID_PLACEHOLDER",
  "version": "3.78.0",
  "createdAt": "2025-01-31T00:00:00.000Z",
  "page": {
    "canvas": {
      "type": "main",
      "children": {
        "container1": {
          "type": "widget",
          "subtype": "ContainerWidget",
          "template": {
            "ordered": [
              {
                "type": "widget",
                "style": {
                  "ordered": [
                    { "background": "rgb(17, 24, 39)" }
                  ]
                }
              }
            ]
          }
        }
      }
    }
  },
  "queries": {},
  "customCSS": "/* Dark theme */\n:root { font-size: 90%; }\n._retool-container1 { background: #111827; }"
}
EOF

    # Replace placeholders
    sed -i.bak "s/APP_NAME_PLACEHOLDER/$APP_NAME/g" "${APP_NAME}.json"
    sed -i.bak "s/APP_UUID_PLACEHOLDER/$(uuidgen | tr '[:upper:]' '[:lower:]')/g" "${APP_NAME}.json"
    rm "${APP_NAME}.json.bak"
}

# Fix common JSON issues
fix_json() {
    local FILE=$1
    
    # Try to extract JSON from response
    if grep -q '```json' "$FILE"; then
        sed -n '/```json/,/```/p' "$FILE" | sed '1d;$d' > "${FILE}.fixed"
        mv "${FILE}.fixed" "$FILE"
    fi
    
    # Validate again
    if jq . "$FILE" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ JSON fixed successfully${NC}"
    else
        echo -e "${YELLOW}⚠️  Unable to fix JSON. Manual intervention required.${NC}"
    fi
}

# Deploy to Retool
deploy_to_retool() {
    local JSON_FILE=$1
    
    echo -e "${BLUE}🚀 Deploying to Retool...${NC}"
    
    if [ -n "$RETOOL_API_KEY" ]; then
        # Future API method (when available)
        echo -e "${YELLOW}Note: Direct API deployment coming soon${NC}"
        
        # Current method
        echo -e "${GREEN}📋 Manual deployment steps:${NC}"
        echo "1. Open https://retool.com"
        echo "2. Go to Apps → Create new → From JSON"
        echo "3. Upload: $JSON_FILE"
        echo "4. Configure data sources"
        echo
        
        # Open browser if available
        if command -v open &> /dev/null; then
            echo -e "${BLUE}Opening Retool in browser...${NC}"
            open "https://retool.com/apps"
        fi
    else
        echo -e "${YELLOW}RETOOL_API_KEY not set. Manual import required.${NC}"
    fi
}

# Create GitHub workflow
create_github_workflow() {
    local PROJECT_NAME=$1
    
    echo -e "${BLUE}📁 Creating GitHub workflow...${NC}"
    
    mkdir -p .github/workflows
    
    cat > .github/workflows/retool-deploy.yml << 'EOF'
name: Deploy Retool App

on:
  push:
    branches: [main]
    paths:
      - 'retool-apps/**'
      - '.github/workflows/retool-deploy.yml'

jobs:
  generate-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          npm install -g @anthropic-ai/claude-cli
          npm install -g jq
          
      - name: Generate Retool App
        env:
          CLAUDE_API_KEY: ${{ secrets.CLAUDE_API_KEY }}
        run: |
          ./retool-ai-automation.sh generate "CRM" "production-crm" "claude"
          
      - name: Validate JSON
        run: |
          jq . production-crm.json
          
      - name: Upload Artifact
        uses: actions/upload-artifact@v3
        with:
          name: retool-app
          path: production-crm.json
          
      - name: Notify Deployment
        run: |
          echo "::notice::Retool app generated successfully!"
          echo "::notice::Download artifact and import to Retool"
EOF
    
    echo -e "${GREEN}✓ GitHub workflow created${NC}"
}

# Interactive menu
show_menu() {
    echo -e "${BLUE}Select an option:${NC}"
    echo "1) Generate CRM Application"
    echo "2) Generate Dashboard Application"
    echo "3) Generate Admin Panel"
    echo "4) Generate Custom Application"
    echo "5) Setup GitHub Workflow"
    echo "6) View Power User Guide"
    echo "7) Exit"
    echo
    read -p "Enter choice [1-7]: " choice
    
    case $choice in
        1)
            read -p "Enter app name: " app_name
            generate_retool_app "CRM" "${app_name:-crm-app}" "claude"
            deploy_to_retool "${app_name:-crm-app}.json"
            ;;
        2)
            read -p "Enter app name: " app_name
            generate_retool_app "Dashboard" "${app_name:-dashboard-app}" "claude"
            deploy_to_retool "${app_name:-dashboard-app}.json"
            ;;
        3)
            read -p "Enter app name: " app_name
            generate_retool_app "Admin" "${app_name:-admin-app}" "claude"
            deploy_to_retool "${app_name:-admin-app}.json"
            ;;
        4)
            read -p "Enter app type: " app_type
            read -p "Enter app name: " app_name
            read -p "Select AI (claude/openai): " ai_model
            generate_retool_app "$app_type" "$app_name" "$ai_model"
            deploy_to_retool "${app_name}.json"
            ;;
        5)
            read -p "Enter project name: " project_name
            create_github_workflow "${project_name:-retool-project}"
            ;;
        6)
            if [ -f "POWERUSER_RETOOL_AI_GUIDE.md" ]; then
                less POWERUSER_RETOOL_AI_GUIDE.md
            else
                echo -e "${YELLOW}Guide not found${NC}"
            fi
            ;;
        7)
            echo -e "${GREEN}Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${YELLOW}Invalid option${NC}"
            ;;
    esac
}

# Main execution
main() {
    print_banner
    
    # Check for required tools
    for cmd in jq curl; do
        if ! command -v $cmd &> /dev/null; then
            echo -e "${YELLOW}Warning: $cmd not found. Some features may not work.${NC}"
        fi
    done
    
    # Check for API keys
    if [ -z "$CLAUDE_API_KEY" ] && [ -z "$OPENAI_API_KEY" ]; then
        echo -e "${YELLOW}Note: No AI API keys found. Will use templates.${NC}"
        echo "Set CLAUDE_API_KEY or OPENAI_API_KEY for AI generation."
        echo
    fi
    
    # Process command line arguments
    if [ $# -eq 0 ]; then
        # Interactive mode
        while true; do
            show_menu
            echo
            read -p "Press Enter to continue..."
            clear
            print_banner
        done
    else
        # Command mode
        case $1 in
            generate)
                generate_retool_app "$2" "$3" "${4:-claude}"
                ;;
            deploy)
                deploy_to_retool "$2"
                ;;
            workflow)
                create_github_workflow "$2"
                ;;
            *)
                echo "Usage: $0 [generate|deploy|workflow] [args...]"
                echo "  generate <type> <name> [ai-model]"
                echo "  deploy <json-file>"
                echo "  workflow <project-name>"
                ;;
        esac
    fi
}

# Run main function
main "$@"