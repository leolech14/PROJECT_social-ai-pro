const fs = require('fs');

// Generate complete Retool app structure
const retoolApp = {
  name: "Social AI Pro",
  version: "3.0.0",
  queries: [
    {
      id: "getVoices",
      resourceName: "SocialAIProAPI",
      type: "GET",
      url: "/api/voices",
      runWhenPageLoads: true
    },
    {
      id: "generateScript",
      resourceName: "SocialAIProAPI", 
      type: "POST",
      url: "/api/generate-script",
      body: `{{
        {
          description: inputDescription.value,
          tone: selectTone.value,
          platforms: multiselectPlatforms.value,
          duration: numberDuration.value
        }
      }}`
    },
    {
      id: "previewVoice",
      resourceName: "SocialAIProAPI",
      type: "POST",
      url: "/api/voice-preview",
      body: `{{
        {
          voiceId: table1.selectedRow.id,
          demoText: "Testing the new compact UI with Google AI Studio voices"
        }
      }}`
    }
  ],
  components: {
    container1: {
      type: "container",
      properties: {
        backgroundColor: "#111827"
      }
    },
    textTitle: {
      type: "text",
      properties: {
        value: "Social Media Science",
        style: {
          fontSize: "32px",
          color: "#ffffff",
          fontWeight: "bold"
        }
      }
    },
    buttonStart: {
      type: "button",
      properties: {
        text: "Start Creating",
        style: {
          backgroundColor: "#7C3AED"
        }
      }
    }
  }
};

console.log(JSON.stringify(retoolApp, null, 2));
fs.writeFileSync('retool-app-complete.json', JSON.stringify(retoolApp, null, 2));
console.log('✅ Retool app structure generated!');
