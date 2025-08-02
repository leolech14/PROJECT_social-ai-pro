import { useState, useEffect } from 'react'
import { AnimatePresence, useMotionValue, useTransform, motion } from 'framer-motion'
import { Mic, Sparkles, Video, Wand2, Zap, Play, ChevronDown, Film, Palette, Clock, Camera, Music, Share2 } from 'lucide-react'
import './App.css'

function App() {
  const [stage, setStage] = useState(0) // 0: Input, 1: Voice, 2: Video
  const [inputText, setInputText] = useState('')
  const [showConfig, setShowConfig] = useState(false)
  const [selectedTone, setSelectedTone] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState([])
  const [duration, setDuration] = useState(30)
  const [isRecording, setIsRecording] = useState(false)
  
  // Data persistence between stages
  const [generatedScript, setGeneratedScript] = useState(null)
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [selectedMusic, setSelectedMusic] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Mouse parallax effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  const stages = ['Script Creation', 'Voice Selection', 'Video Assembly']
  
  // Parallax transforms
  const translateX = useTransform(mouseX, [0, window.innerWidth], [-50, 50])
  const translateY = useTransform(mouseY, [0, window.innerHeight], [-50, 50])

  const togglePlatform = (platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  // Floating particles animation
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10
  }))

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-[#0f0f0f] to-black"></div>
        
        {/* Floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: `${particle.x}%`,
              y: `${particle.y}%`,
            }}
            animate={{
              x: [`${particle.x}%`, `${particle.x + 10}%`, `${particle.x}%`],
              y: [`${particle.y}%`, `${particle.y - 30}%`, `${particle.y}%`],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ width: particle.size, height: particle.size }}
          />
        ))}
        
        {/* Animated gradient orbs with parallax */}
        <motion.div 
          className="absolute -top-40 -right-40 w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full opacity-20"
          style={{ x: translateX, y: translateY }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-purple-600/30 via-pink-600/30 to-orange-600/30 rounded-full blur-[100px]"></div>
        </motion.div>
        
        <motion.div 
          className="absolute -bottom-40 -left-40 w-[350px] md:w-[500px] h-[350px] md:h-[500px] rounded-full opacity-20"
          style={{ x: translateX, y: translateY }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-blue-600/30 via-cyan-600/30 to-purple-600/30 rounded-full blur-[100px]"></div>
        </motion.div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(255,255,255,0.03)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' /%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 pb-10 sm:pb-12 lg:pb-16">
        {/* Compact Header for Mobile */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 lg:mb-6 tracking-tight">
              <motion.span 
                className="inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 text-gradient drop-shadow-2xl"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: '200% 200%',
                }}
              >
                AI Video
              </motion.span>{' '}
              <span className="inline-block text-white drop-shadow-lg">Creator</span>
            </h1>
            <motion.div 
              className="w-24 sm:w-32 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 mx-auto rounded-full mb-3 sm:mb-4 lg:mb-6"
              animate={{
                scaleX: [0, 1],
                opacity: [0, 1]
              }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base sm:text-lg lg:text-xl text-gray-300 font-light max-w-2xl mx-auto px-4"
          >
            Transform your ideas into viral social media videos with AI-powered intelligence
          </motion.p>
        </motion.header>

        {/* Responsive Stage Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center mb-8 sm:mb-12 lg:mb-16 px-4"
        >
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-full p-1 sm:p-2 border border-white/10 inline-flex">
            {stages.map((stageName, index) => (
              <motion.div
                key={index}
                className={`inline-flex items-center ${index < stages.length - 1 ? 'mr-1 sm:mr-2' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <motion.div 
                  className={`relative w-8 h-8 sm:w-10 md:w-12 sm:h-10 md:h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 text-xs sm:text-sm ${
                    index === stage ? 'scale-110' : ''
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Background */}
                  <div className={`absolute inset-0 rounded-full ${
                    index === stage 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                      : index < stage 
                        ? 'bg-green-500' 
                        : 'bg-gray-800'
                  }`}></div>
                  
                  {/* Pulse effect for active */}
                  {index === stage && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                  
                  <span className="relative z-10">
                    {index < stage ? '✓' : index + 1}
                  </span>
                </motion.div>
                
                {/* Stage name - hidden on mobile */}
                <span className={`ml-2 hidden lg:inline text-xs md:text-sm font-medium ${
                  index === stage ? 'text-white' : 'text-gray-500'
                }`}>
                  {stageName}
                </span>
                
                {/* Connector line */}
                {index < stages.length - 1 && (
                  <div className={`w-8 sm:w-12 md:w-16 lg:w-24 h-0.5 ml-1 sm:ml-2 lg:ml-3 transition-all duration-300 ${
                    index < stage ? 'bg-green-500' : 'bg-gray-800'
                  }`}></div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Responsive Vertical Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {/* Stage 0: Input */}
            {stage === 0 && (
              <motion.div
                key="stage0"
                className="flex items-start justify-center px-4"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 80, damping: 20 }}
              >
                <div className="w-full max-w-3xl mb-8">
                  <motion.div 
                    className="relative"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {/* Glass card with subtle glow */}
                    <div className="relative bg-gray-900/60 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/10 shadow-2xl">
                      {/* Subtle gradient border */}
                      <motion.div 
                        className="absolute -inset-[1px] bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 rounded-2xl sm:rounded-3xl opacity-50 blur-sm"
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      <div className="relative z-10">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-center flex items-center justify-center">
                          <motion.div
                            animate={{
                              rotate: [0, 360],
                            }}
                            transition={{
                              duration: 20,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          >
                            <Sparkles className="mr-2 sm:mr-3 text-yellow-400 w-6 h-6 sm:w-8 sm:h-8" />
                          </motion.div>
                          Describe Your Video
                        </h2>
                        
                        {/* Text Input with animated border */}
                        <div className="relative mb-6 sm:mb-8">
                          <motion.div 
                            className="absolute -inset-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-xl sm:rounded-2xl opacity-0"
                            animate={{
                              opacity: inputText.length > 0 ? [0.3, 0.6, 0.3] : 0,
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                          <textarea
                            value={inputText}
                            onChange={(e) => {
                              setInputText(e.target.value)
                              if (e.target.value.length > 0 && !showConfig) {
                                setShowConfig(true)
                              }
                            }}
                            placeholder="Tell me about the video you want to create..."
                            className="relative w-full h-28 sm:h-32 lg:h-36 p-4 sm:p-5 lg:p-6 bg-black/40 border-2 border-white/10 rounded-xl sm:rounded-2xl resize-none focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 text-sm sm:text-base lg:text-lg placeholder-gray-500"
                          />
                          
                          {/* Animated Microphone Button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsRecording(!isRecording)}
                            className={`absolute right-3 bottom-3 sm:right-4 sm:bottom-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all ${
                              isRecording 
                                ? 'bg-red-500' 
                                : 'bg-gradient-to-r from-purple-500 to-pink-500'
                            }`}
                          >
                            <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
                            {isRecording && (
                              <motion.div
                                className="absolute inset-0 rounded-full bg-red-500"
                                animate={{
                                  scale: [1, 1.5, 1],
                                  opacity: [0.5, 0, 0.5]
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                            )}
                          </motion.button>
                        </div>

                        {/* Progressive Configuration */}
                        <AnimatePresence>
                          {showConfig && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.4, ease: "easeOut" }}
                              className="space-y-4 sm:space-y-6 overflow-hidden"
                            >
                              {/* Tone Selection */}
                              <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                              >
                                <label className="block text-xs sm:text-sm font-medium mb-2 sm:mb-3 text-gray-300 flex items-center">
                                  <Palette className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                  Tone
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                                  {['Educational', 'Fun', 'Professional', 'Inspiring'].map((tone) => (
                                    <motion.button
                                      key={tone}
                                      whileHover={{ scale: 1.05, y: -2 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => setSelectedTone(tone)}
                                      className={`py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 ${
                                        selectedTone === tone 
                                          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/50' 
                                          : 'bg-gray-800/50 border border-white/10 hover:border-white/20 hover:bg-gray-800/70'
                                      }`}
                                    >
                                      {tone}
                                    </motion.button>
                                  ))}
                                </div>
                              </motion.div>

                              {/* Platform Selection - Subtle styling */}
                              <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                              >
                                <label className="block text-xs sm:text-sm font-medium mb-2 sm:mb-3 text-gray-300 flex items-center">
                                  <Film className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                  Platforms
                                </label>
                                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                  {[
                                    { 
                                      name: 'TikTok', 
                                      icon: <Video className="w-4 h-4" />,
                                      accent: 'from-pink-500/20 to-purple-500/20'
                                    },
                                    { 
                                      name: 'Instagram', 
                                      icon: <Camera className="w-4 h-4" />,
                                      accent: 'from-purple-500/20 to-orange-500/20'
                                    },
                                    { 
                                      name: 'YouTube', 
                                      icon: <Play className="w-4 h-4" />,
                                      accent: 'from-red-500/20 to-red-600/20'
                                    }
                                  ].map((platform) => (
                                    <motion.button
                                      key={platform.name}
                                      whileHover={{ scale: 1.05, y: -2 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => togglePlatform(platform.name)}
                                      className={`relative py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 overflow-hidden group ${
                                        selectedPlatforms.includes(platform.name)
                                          ? 'bg-gray-800/70 text-white border border-white/30' 
                                          : 'bg-gray-800/50 border border-white/10 hover:border-white/20'
                                      }`}
                                    >
                                      <span className="relative z-10 flex items-center justify-center">
                                        <span className="mr-1 sm:mr-2">{platform.icon}</span>
                                        <span className="hidden sm:inline">{platform.name}</span>
                                        <span className="sm:hidden">{platform.name.slice(0, 3)}</span>
                                      </span>
                                      {selectedPlatforms.includes(platform.name) && (
                                        <motion.div
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          className={`absolute inset-0 bg-gradient-to-r ${platform.accent}`}
                                        />
                                      )}
                                    </motion.button>
                                  ))}
                                </div>
                              </motion.div>

                              {/* Duration Slider */}
                              <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                              >
                                <label className="block text-xs sm:text-sm font-medium mb-2 sm:mb-3 text-gray-300 flex items-center justify-between">
                                  <span className="flex items-center">
                                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                    Duration
                                  </span>
                                  <motion.span 
                                    key={duration}
                                    initial={{ scale: 1.2, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-purple-400 font-bold"
                                  >
                                    {duration}s
                                  </motion.span>
                                </label>
                                <div className="relative">
                                  <input
                                    type="range"
                                    min="10"
                                    max="120"
                                    step="5"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer slider"
                                  />
                                  <motion.div 
                                    className="absolute top-0 left-0 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg pointer-events-none"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((duration - 10) / 110) * 100}%` }}
                                    transition={{ duration: 0.3 }}
                                  />
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1 sm:mt-2">
                                  <span>10s</span>
                                  <span>60s</span>
                                  <span>120s</span>
                                </div>
                              </motion.div>

                              {/* Generate Button */}
                              <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={async () => {
                                  try {
                                    setIsGenerating(true);
                                    const response = await fetch('/api/generate-script', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({
                                        description: inputText,
                                        tone: selectedTone,
                                        platforms: selectedPlatforms,
                                        duration: parseInt(duration)
                                      })
                                    });
                                    const data = await response.json();
                                    if (data.success) {
                                      console.log('Script generated:', data.script);
                                      setGeneratedScript(data.script);
                                      setStage(1);
                                    } else {
                                      console.error('Script generation failed:', data.error);
                                    }
                                  } catch (error) {
                                    console.error('Error generating script:', error);
                                  } finally {
                                    setIsGenerating(false);
                                  }
                                }}
                                disabled={!inputText || !selectedTone || selectedPlatforms.length === 0 || isGenerating}
                                className="w-full py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl font-semibold text-white shadow-xl relative overflow-hidden group text-sm sm:text-base lg:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <span className="relative z-10 flex items-center justify-center">
                                  {isGenerating ? (
                                    <>
                                      Generating...
                                      <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="ml-2"
                                      >
                                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                                      </motion.div>
                                    </>
                                  ) : (
                                    <>
                                      Generate Script 
                                      <Wand2 className="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5" />
                                    </>
                                  )}
                                </span>
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500"
                                  initial={{ x: '-100%' }}
                                  whileHover={{ x: 0 }}
                                  transition={{ duration: 0.3 }}
                                />
                              </motion.button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>

                  {/* Quick Mode Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 sm:mt-8 mx-auto flex items-center py-3 sm:py-4 px-6 sm:px-8 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-full font-semibold text-white shadow-xl relative overflow-hidden group text-sm sm:text-base"
                  >
                    <Zap className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Do it for me quickly</span>
                    <span className="ml-2 text-xs sm:text-sm opacity-80">(33% cheaper)</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Stage 1: Voice Selection */}
            {stage === 1 && (
              <motion.div
                key="stage1"
                className="flex items-start justify-center px-4"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 80, damping: 20 }}
              >
                <div className="w-full max-w-4xl">
                  <motion.div 
                    className="relative"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="relative bg-gray-900/60 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/10 shadow-2xl">
                      <motion.div 
                        className="absolute -inset-[1px] bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 rounded-2xl sm:rounded-3xl opacity-50 blur-sm"
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      <div className="relative z-10">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-center flex items-center justify-center">
                          <motion.div
                            animate={{
                              scale: [1, 1.1, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <Mic className="mr-2 sm:mr-3 text-blue-400 w-6 h-6 sm:w-8 sm:h-8" />
                          </motion.div>
                          Select Your Voice
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                          {[
                            { name: 'Sarah', style: 'Professional', gender: 'Female', preview: '🎯' },
                            { name: 'Marcus', style: 'Energetic', gender: 'Male', preview: '⚡' },
                            { name: 'Emma', style: 'Friendly', gender: 'Female', preview: '😊' },
                            { name: 'James', style: 'Confident', gender: 'Male', preview: '💪' },
                          ].map((voice, index) => (
                            <motion.div
                              key={voice.name}
                              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + index * 0.1 }}
                              whileHover={{ scale: 1.03, y: -5 }}
                              whileTap={{ scale: 0.98 }}
                              className="relative bg-gray-800/50 border border-white/10 rounded-xl p-4 sm:p-6 cursor-pointer hover:border-purple-500/50 transition-all duration-300"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h3 className="text-lg sm:text-xl font-semibold text-white">{voice.name}</h3>
                                  <p className="text-sm text-gray-400">{voice.style} • {voice.gender}</p>
                                </div>
                                <div className="text-3xl">{voice.preview}</div>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="flex items-center px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-500/30"
                                >
                                  <Play className="w-3 h-3 mr-1.5" />
                                  Preview
                                </motion.button>
                                
                                <div className="flex-1">
                                  <div className="h-8 bg-gray-700/50 rounded-lg p-1 flex items-center">
                                    <motion.div
                                      className="h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md"
                                      initial={{ width: 0 }}
                                      animate={{ width: '60%' }}
                                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setStage(0)}
                            className="flex-1 py-3 sm:py-4 bg-gray-700/50 rounded-xl font-semibold text-white hover:bg-gray-700/70 transition-all"
                          >
                            Back to Script
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setStage(2)}
                            className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white shadow-xl relative overflow-hidden group"
                          >
                            <span className="relative z-10 flex items-center justify-center">
                              Generate Voice
                              <motion.div
                                animate={{
                                  x: [0, 5, 0],
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              >
                                <ChevronDown className="ml-2 w-5 h-5 rotate-[-90deg]" />
                              </motion.div>
                            </span>
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500"
                              initial={{ x: '-100%' }}
                              whileHover={{ x: 0 }}
                              transition={{ duration: 0.3 }}
                            />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Stage 2: Video Assembly */}
            {stage === 2 && (
              <motion.div
                key="stage2"
                className="flex items-start justify-center px-4"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 80, damping: 20 }}
              >
                <div className="w-full max-w-5xl">
                  <motion.div 
                    className="relative"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="relative bg-gray-900/60 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/10 shadow-2xl">
                      <motion.div 
                        className="absolute -inset-[1px] bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 rounded-2xl sm:rounded-3xl opacity-50 blur-sm"
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      <div className="relative z-10">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-center flex items-center justify-center">
                          <motion.div
                            animate={{
                              rotate: [0, 360],
                            }}
                            transition={{
                              duration: 20,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          >
                            <Video className="mr-2 sm:mr-3 text-green-400 w-6 h-6 sm:w-8 sm:h-8" />
                          </motion.div>
                          Assemble Your Video
                        </h2>
                        
                        {/* Media Selection */}
                        <div className="mb-6 sm:mb-8">
                          <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <Film className="w-5 h-5 mr-2 text-purple-400" />
                            Choose Media Style
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['Stock Footage', 'AI Generated', 'Animated', 'Text Only'].map((style, index) => (
                              <motion.button
                                key={style}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.05 }}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="py-3 px-4 bg-gray-800/50 border border-white/10 rounded-xl text-sm font-medium hover:border-purple-500/50 hover:bg-gray-800/70 transition-all"
                              >
                                {style}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Music Selection */}
                        <div className="mb-6 sm:mb-8">
                          <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <Music className="w-5 h-5 mr-2 text-pink-400" />
                            Background Music
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {['Upbeat', 'Chill', 'Epic'].map((mood, index) => (
                              <motion.div
                                key={mood}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                className="bg-gray-800/50 border border-white/10 rounded-xl p-4 hover:border-pink-500/50 transition-all cursor-pointer"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{mood}</span>
                                  <Play className="w-4 h-4 text-pink-400" />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Final Actions */}
                        <div className="flex flex-col sm:flex-row gap-4">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setStage(1)}
                            className="flex-1 py-3 sm:py-4 bg-gray-700/50 rounded-xl font-semibold text-white hover:bg-gray-700/70 transition-all"
                          >
                            Back to Voice
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-semibold text-white shadow-xl relative overflow-hidden group"
                          >
                            <span className="relative z-10 flex items-center justify-center">
                              Create Video
                              <Sparkles className="ml-2 w-5 h-5" />
                            </span>
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500"
                              initial={{ x: '-100%' }}
                              whileHover={{ x: 0 }}
                              transition={{ duration: 0.3 }}
                            />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default App