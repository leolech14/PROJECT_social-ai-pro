import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import HeroScreen from './components/HeroScreen'
import ScriptForm from './components/ScriptForm'
import ScriptReview from './components/ScriptReview'
import VoiceSelection from './components/VoiceSelection'
import VideoAssembly from './components/VideoAssembly'
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

  // Refs for smooth scrolling
  const inputSectionRef = useRef(null)
  const canvasRef = useRef(null)

  // Particle system
  const [particles, setParticles] = useState([])

  const handleScriptGeneration = async () => {
    if (!inputText.trim() || selectedPlatforms.length === 0 || !selectedTone) {
      alert('Please fill in all required fields')
      return
    }

    setIsGenerating(true)

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
        alert('Failed to generate script: ' + data.error)
      }
    } catch (error) {
      console.error('Script generation error:', error)
      alert('Failed to generate script')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleVoiceGeneration = async () => {
    if (!selectedVoice || !generatedScript) {
      alert('Please select a voice and ensure script is generated')
      return
    }

    setIsGenerating(true)

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
        setSelectedVoice({
          ...selectedVoice,
          audioUrl: data.voice.audioUrl,
          duration: data.voice.duration
        })
        setStage(4) // Go to video assembly
      } else {
        alert('Failed to generate voice: ' + data.error)
      }
    } catch (error) {
      console.error('Voice generation error:', error)
      alert('Failed to generate voice')
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
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-0"
        style={{ background: '#0a0a0a' }}
      />

      <AnimatePresence>
        {showHero && <HeroScreen onStart={scrollToInput} />}
      </AnimatePresence>

      <div className="relative z-10">
        {!showHero && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
            {stage > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center mb-8 sm:mb-12 lg:mb-16 px-4"
              >
                <div className="bg-gray-900/50 backdrop-blur-xl rounded-full p-1 sm:p-2 border border-white/10 inline-flex">
                  {stages.slice(1).map((stageName, index) => {
                    const actualIndex = index + 1
                    return (
                      <motion.div
                        key={stageName}
                        className={`flex items-center relative ${index > 0 ? 'ml-2 sm:ml-4' : ''}`}
                      >
                        <motion.div
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-colors duration-300 ${
                            actualIndex <= stage ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400'
                          }`}
                        >
                          {actualIndex < stage ? '✓' : actualIndex}
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

            <div ref={inputSectionRef}>
              <AnimatePresence mode="wait">
                {stage === 1 && (
                  <ScriptForm
                    inputText={inputText}
                    setInputText={setInputText}
                    showConfig={showConfig}
                    setShowConfig={setShowConfig}
                    selectedTone={selectedTone}
                    setSelectedTone={setSelectedTone}
                    selectedPlatforms={selectedPlatforms}
                    togglePlatform={togglePlatform}
                    duration={duration}
                    setDuration={setDuration}
                    isRecording={isRecording}
                    setIsRecording={setIsRecording}
                    handleScriptGeneration={handleScriptGeneration}
                    isGenerating={isGenerating}
                  />
                )}

                {stage === 2 && generatedScript && (
                  <ScriptReview
                    generatedScript={generatedScript}
                    setGeneratedScript={setGeneratedScript}
                    onStartOver={() => {
                      setGeneratedScript(null)
                      setStage(1)
                    }}
                    onRegenerate={handleScriptGeneration}
                    onApprove={() => setStage(3)}
                  />
                )}

                {stage === 3 && (
                  <VoiceSelection
                    selectedVoice={selectedVoice}
                    onVoiceSelect={setSelectedVoice}
                    onBack={() => setStage(2)}
                    onNext={() => {
                      if (selectedVoice) {
                        handleVoiceGeneration()
                      }
                    }}
                    userInput={{
                      description: inputText,
                      tone: selectedTone,
                      platforms: selectedPlatforms,
                      duration: duration
                    }}
                  />
                )}

                {stage === 4 && (
                  <VideoAssembly onBack={() => setStage(3)} />
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
