// Generate test data for Retool
const testData = {
  mockScript: {
    id: Date.now(),
    title: "How to Master AI Voice Generation",
    hook: "Ever wondered how to create perfect AI voices? Here's the secret!",
    mainPoints: [
      "Choose the right voice for your content",
      "Optimize your script for voice synthesis",
      "Use the compact UI for better workflow"
    ],
    callToAction: "Try it yourself with our 43 amazing voices!",
    duration: 30
  },
  mockVoiceData: {
    audioUrl: "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA",
    duration: 30,
    status: "ready"
  }
};

console.log(JSON.stringify(testData, null, 2));
