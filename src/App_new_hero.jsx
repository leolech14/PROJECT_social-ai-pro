import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mic, Sparkles, Video, Wand2, Zap, Play, ChevronDown, Film, Palette, Clock, Camera, Music, Share2, ArrowDown } from 'lucide-react'
import VoiceSelector from './components/VoiceSelector'
import ErrorNotification from './components/ErrorNotification'
import './App.css'

function App() {
  const [stage, setStage] = useState(0) // 0: Hero, 1: Input, 2: Script Review, 3: Voice, 4: Video
  const [showHero, setShowHero] = useState(true)
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
  const [error, setError] = useState(null)
  
  // Refs for smooth scrolling
  const inputSectionRef = useRef(null)
  const canvasRef = useRef(null)
  
  // Particle system
  const [particles, setParticles] = useState([])

  const handleScriptGeneration = async () => {
    if (!inputText.trim() || selectedPlatforms.length === 0 || !selectedTone) {
      setError('Please fill in all required fields')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: inputText,
          tone: selectedTone,
          platforms: selectedPlatforms,
          duration
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setGeneratedScript(data.script)
        setStage(2) // Skip to script review
      } else {
        setError('Failed to generate script: ' + data.error)
      }
    } catch (error) {
      console.error('Script generation error:', error)
      setError('Failed to generate script')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleVoiceGeneration = async () => {
    if (!selectedVoice || !generatedScript) {
      setError('Please select a voice and ensure script is generated')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptId: generatedScript.id,
          voiceId: selectedVoice.id,
          text: generatedScript.content,
          voiceInstruction: selectedVoice.instruction || null
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Store the generated voice data
        setSelectedVoice({
          ...selectedVoice,
          audioUrl: data.voice.audioUrl,
          duration: data.voice.duration
        })
        setStage(4) // Go to video assembly
      } else {
        setError('Failed to generate voice: ' + data.error)
      }
    } catch (error) {
      console.error('Voice generation error:', error)
      setError('Failed to generate voice')
    } finally {
      setIsGenerating(false)
    }
  }
  
  // Scroll to input section
  const scrollToInput = () => {
    setShowHero(false)
    setStage(1)
    setTimeout(() => {
      inputSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }
  
  // Particle system for background
  useEffect(() => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.opacity = Math.random() * 0.5 + 0.2
      }
      
      update() {
        this.x += this.speedX
        this.y += this.speedY
        
        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }
      
      draw() {
        ctx.fillStyle = `rgba(147, 51, 234, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    
    const initParticles = () => {
      const particleCount = Math.floor((canvas.width * canvas.height) / 10000)
      const newParticles = []
      for (let i = 0; i < particleCount; i++) {
        newParticles.push(new Particle())
      }
      setParticles(newParticles)
      return newParticles
    }
    
    const animate = (particleArray) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particleArray.forEach(particle => {
        particle.update()
        particle.draw()
      })
      
      // Draw connections
      particleArray.forEach((particle, i) => {
        particleArray.slice(i + 1).forEach(otherParticle => {
          const distance = Math.sqrt(
            Math.pow(particle.x - otherParticle.x, 2) +
            Math.pow(particle.y - otherParticle.y, 2)
          )
          
          if (distance < 150) {
            ctx.strokeStyle = `rgba(147, 51, 234, ${(1 - distance / 150) * 0.2})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
          }
        })
      })
      
      animationId = requestAnimationFrame(() => animate(particleArray))
    }
    
    const handleResize = () => {
      resizeCanvas()
      const newParticles = initParticles()
      animate(newParticles)
    }
    
    resizeCanvas()
    const initialParticles = initParticles()
    animate(initialParticles)
    
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  const stages = ['Hero', 'Input', 'Script Review', 'Voice Selection', 'Video Assembly']

  const togglePlatform = (platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative">
      {/* Animated Background Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-0"
        style={{ background: '#0a0a0a' }}
      />

      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-lg">
          <ErrorNotification message={error} onClose={() => setError(null)} />
        </div>
      )}

      {/* Hero Section */}
      <AnimatePresence>
        {showHero && (
          <motion.section 
            className="min-h-screen flex flex-col items-center justify-center relative z-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center px-4">
              <motion.h1 
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-8xl font-bold mb-6 tracking-tight"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.span 
                  className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundSize: '400% 400%',
                  }}
                >
                  Social Media Science
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Transform user inputs into viral-worthy video scripts using research-backed principles and AI intelligence
              </motion.p>
              
              <motion.div
                className="scroll-indicator cursor-pointer"
                onClick={scrollToInput}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="flex flex-col items-center text-purple-400"
                >
                  <span className="text-sm mb-2">Start Creating</span>
                  <ArrowDown className="w-6 h-6" />
                </motion.div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      
      {/* Main App Content */}
      <div className="relative z-10">
        {!showHero && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
            {/* Stage Indicator - Only show after hero */}
            {stage > 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center mb-8 sm:mb-12 lg:mb-16 px-4"
              >
                <div className="bg-gray-900/50 backdrop-blur-xl rounded-full p-1 sm:p-2 border border-white/10 inline-flex">
                  {stages.slice(1).map((stageName, index) => {
                    const actualIndex = index + 1 // Adjust for sliced array
                    return (
                      <motion.div
                        key={actualIndex}
                        className={`inline-flex items-center ${actualIndex < stages.length - 1 ? 'mr-1 sm:mr-2' : ''}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <motion.div 
                          className={`relative w-8 h-8 sm:w-10 md:w-12 sm:h-10 md:h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 text-xs sm:text-sm ${
                            actualIndex === stage ? 'scale-110' : ''
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className={`absolute inset-0 rounded-full ${
                            actualIndex === stage 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                              : actualIndex < stage 
                                ? 'bg-green-500' 
                                : 'bg-gray-800'
                          }`}></div>
                          
                          {actualIndex === stage && (
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
                            {actualIndex < stage ? '✓' : actualIndex}
                          </span>
                        </motion.div>
                        
                        <span className={`ml-2 hidden lg:inline text-xs md:text-sm font-medium ${
                          actualIndex === stage ? 'text-white' : 'text-gray-500'
                        }`}>
                          {stageName}
                        </span>
                        
                        {actualIndex < stages.length - 1 && (
                          <div className={`w-8 sm:w-12 md:w-16 lg:w-24 h-0.5 ml-1 sm:ml-2 lg:ml-3 transition-all duration-300 ${
                            actualIndex < stage ? 'bg-green-500' : 'bg-gray-800'
                          }`}></div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Input Section */}
            <div ref={inputSectionRef}>
              <AnimatePresence mode="wait">
                {/* Stage 1: Input */}
                {stage === 1 && (
                  <motion.div
                    key="stage1"
                    className="min-h-screen flex items-center justify-center px-4"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.8 }}
                  >
                    {/* Slim Input Box */}
                    <div className="w-full max-w-2xl">
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl"
                      >
                        <motion.div 
                          className="absolute -inset-[1px] bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-orange-500/30 rounded-3xl opacity-50 blur-sm"
                          animate={{
                            opacity: [0.3, 0.7, 0.3],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        
                        <div className="relative z-10 text-center">
                          <h2 className="text-3xl font-bold mb-8 text-white">
                            Describe Your Video Idea
                          </h2>
                          
                          {/* Slim Input Box */}
                          <div className="relative mb-6">
                            <motion.div 
                              className="absolute -inset-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl opacity-0"
                              animate={{
                                opacity: inputText.length > 0 ? [0.4, 0.8, 0.4] : 0,
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                            <div className="relative flex items-center">
                              <input
                                type="text"
                                value={inputText}
                                onChange={(e) => {
                                  setInputText(e.target.value)
                                  if (e.target.value.length > 0 && !showConfig) {
                                    setShowConfig(true)
                                  }
                                }}
                                placeholder="e.g., How to make perfect coffee at home"
                                className="w-full h-16 px-6 pr-20 bg-black/50 border-2 border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 text-lg"
                              />
                              
                              {/* Microphone Button */}
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsRecording(!isRecording)}
                                className={`absolute right-3 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-all ${
                                  isRecording 
                                    ? 'bg-red-500' 
                                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                                }`}
                              >
                                <Mic className="w-5 h-5" />
                                {isRecording && (
                                  <motion.div
                                    className="absolute inset-0 rounded-xl bg-red-500"
                                    animate={{
                                      scale: [1, 1.3, 1],
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
                          </div>

                          {/* Progressive Configuration */}
                          <AnimatePresence>
                            {showConfig && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="space-y-6 overflow-hidden mt-8"
                              >
                                {/* Tone Selection */}
                                <motion.div
                                  initial={{ y: 20, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  transition={{ delay: 0.1 }}
                                >
                                  <label className="block text-sm font-medium mb-3 text-gray-300 text-left">
                                    Tone
                                  </label>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {['Educational', 'Fun', 'Professional', 'Inspiring'].map((tone) => (
                                      <motion.button
                                        key={tone}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedTone(tone)}
                                        className={`py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${
                                          selectedTone === tone 
                                            ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border-2 border-purple-500/70' 
                                            : 'bg-gray-800/50 border border-white/10 hover:border-white/20 hover:bg-gray-800/70'
                                        }`}
                                      >
                                        {tone}
                                      </motion.button>
                                    ))}
                                  </div>
                                </motion.div>

                                {/* Platform Selection */}
                                <motion.div
                                  initial={{ y: 20, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  transition={{ delay: 0.2 }}
                                >
                                  <label className="block text-sm font-medium mb-3 text-gray-300 text-left">
                                    Platforms
                                  </label>
                                  <div className="grid grid-cols-3 gap-3">
                                    {[
                                      { 
                                        name: 'TikTok', 
                                        icon: <Video className="w-4 h-4" />,
                                        accent: 'from-pink-500/30 to-purple-500/30'
                                      },
                                      { 
                                        name: 'Instagram', 
                                        icon: <Camera className="w-4 h-4" />,
                                        accent: 'from-purple-500/30 to-orange-500/30'
                                      },
                                      { 
                                        name: 'YouTube', 
                                        icon: <Play className="w-4 h-4" />,
                                        accent: 'from-red-500/30 to-red-600/30'
                                      }
                                    ].map((platform) => (
                                      <motion.button
                                        key={platform.name}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => togglePlatform(platform.name)}
                                        className={`relative py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 overflow-hidden ${
                                          selectedPlatforms.includes(platform.name)
                                            ? 'bg-gray-800/70 text-white border-2 border-white/30' 
                                            : 'bg-gray-800/50 border border-white/10 hover:border-white/20'
                                        }`}
                                      >
                                        <span className="relative z-10 flex items-center justify-center">
                                          <span className="mr-2">{platform.icon}</span>
                                          <span>{platform.name}</span>
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
                                  initial={{ y: 20, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  transition={{ delay: 0.3 }}
                                >
                                  <label className="block text-sm font-medium mb-3 text-gray-300 text-left flex items-center justify-between">
                                    <span>Duration</span>
                                    <motion.span 
                                      key={duration}
                                      initial={{ scale: 1.2, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      className="text-purple-400 font-bold text-lg"
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
                                      className="w-full h-3 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <motion.div 
                                      className="absolute top-0 left-0 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg pointer-events-none"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${((duration - 10) / 110) * 100}%` }}
                                      transition={{ duration: 0.3 }}
                                    />
                                  </div>
                                  <div className="flex justify-between text-xs text-gray-500 mt-2">
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
                                  onClick={handleScriptGeneration}
                                  disabled={!inputText || !selectedTone || selectedPlatforms.length === 0 || isGenerating}
                                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-semibold text-white text-lg shadow-2xl relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
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
                                          <Sparkles className="w-5 h-5" />
                                        </motion.div>
                                      </>
                                    ) : (
                                      <>
                                        Generate Smart Script
                                        <Wand2 className="ml-3 w-5 h-5" />
                                      </>
                                    )}
                                  </span>
                                  <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-500"
                                    initial={{ x: '-100%' }}
                                    whileHover={{ x: 0 }}
                                    transition={{ duration: 0.3 }}
                                  />
                                </motion.button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Stage 2: Script Review */}
                {stage === 2 && generatedScript && (
                  <motion.div
                    key="stage2"
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
                                <Sparkles className="mr-2 sm:mr-3 text-purple-400 w-6 h-6 sm:w-8 sm:h-8" />
                              </motion.div>
                              Review Your Script
                            </h2>

                            {/* Script Info */}
                            <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-400">Tone</p>
                                <p className="text-sm font-semibold text-white">{generatedScript.tone}</p>
                              </div>
                              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-400">Duration</p>
                                <p className="text-sm font-semibold text-white">{generatedScript.duration}s</p>
                              </div>
                              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-400">Platforms</p>
                                <p className="text-sm font-semibold text-white">{generatedScript.platforms.join(', ')}</p>
                              </div>
                              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-400">Generated By</p>
                                <p className="text-sm font-semibold text-white capitalize">{generatedScript.generatedBy || 'AI'}</p>
                              </div>
                            </div>
                            
                            {/* Editable Script Content */}
                            <div className="mb-6">
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Script Content (Click to edit)
                              </label>
                              <textarea
                                value={generatedScript.content}
                                onChange={(e) => setGeneratedScript({
                                  ...generatedScript,
                                  content: e.target.value
                                })}
                                className="w-full h-64 p-4 bg-gray-800/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 resize-none font-mono text-sm"
                                placeholder="Your script content..."
                              />
                            </div>

                            {/* Hashtags */}
                            {generatedScript.hashtags && (
                              <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Suggested Hashtags
                                </label>
                                <div className="flex flex-wrap gap-2">
                                  {generatedScript.hashtags.map((tag, index) => (
                                    <motion.span
                                      key={index}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: index * 0.05 }}
                                      className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm"
                                    >
                                      {tag}
                                    </motion.span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* CTA */}
                            {generatedScript.cta && (
                              <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                                <p className="text-sm text-blue-400">
                                  <strong>Call to Action:</strong> {generatedScript.cta}
                                </p>
                              </div>
                            )}
                            
                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                  setGeneratedScript(null)
                                  setStage(1)
                                }}
                                className="flex-1 py-3 sm:py-4 bg-gray-700/50 rounded-xl font-semibold text-white hover:bg-gray-700/70 transition-all"
                              >
                                Start Over
                              </motion.button>
                              
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleScriptGeneration()}
                                className="flex-1 py-3 sm:py-4 bg-blue-500/20 border border-blue-500/30 rounded-xl font-semibold text-blue-400 hover:bg-blue-500/30 transition-all"
                              >
                                Regenerate Script
                              </motion.button>
                              
                              <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setStage(3)}
                                className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white shadow-xl relative overflow-hidden group"
                              >
                                <span className="relative z-10 flex items-center justify-center">
                                  Approve & Continue
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

                {/* Stage 3: Voice Selection */}
                {stage === 3 && (
                  <motion.div
                    key="stage3"
                    className="flex items-start justify-center px-4"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 80, damping: 20 }}
                  >
                    <VoiceSelector
                      selectedVoice={selectedVoice}
                      onVoiceSelect={setSelectedVoice}
                      onBack={() => setStage(2)}
                      onNext={() => {
                        if (selectedVoice) {
                          handleVoiceGeneration()
                        }
                      }}
                    />
                  </motion.div>
                )}

                {/* Stage 4: Video Assembly */}
                {stage === 4 && (
                  <motion.div
                    key="stage4"
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
                                onClick={() => setStage(3)}
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
        )}
      </div>
    </div>
  )
}

export default App