import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic, Play, Pause, ChevronDown, Volume2, Sparkles,
  Globe, Zap, Star, Info, Search, Filter
} from 'lucide-react'

const VoiceSelection = ({ onVoiceSelect, selectedVoice, onBack, onNext, userInput }) => {
  const [voices, setVoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeProvider, setActiveProvider] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [playingVoiceId, setPlayingVoiceId] = useState(null)
  const [voiceInstruction, setVoiceInstruction] = useState('')
  const [showInstructionModal, setShowInstructionModal] = useState(false)
  const [demoSentences, setDemoSentences] = useState([])
  const [loadingDemos, setLoadingDemos] = useState(false)
  const [currentAudio, setCurrentAudio] = useState(null)

  // Fetch all available voices
  useEffect(() => {
    fetchVoices()
  }, [])

  // Generate contextual demo sentences when component loads
  useEffect(() => {
    if (userInput) {
      generateDemoSentences()
    }
  }, [userInput])

  const fetchVoices = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/voices')
      const data = await response.json()
      
      if (data.success) {
        setVoices(data.voices)
      } else {
        setError('Failed to load voices')
      }
    } catch (err) {
      console.error('Error fetching voices:', err)
      setError('Failed to connect to voice service')
    } finally {
      setLoading(false)
    }
  }

  const generateDemoSentences = async () => {
    if (!userInput?.description || !userInput?.tone || !userInput?.platforms) {
      return
    }

    try {
      setLoadingDemos(true)
      const response = await fetch('/api/generate-demos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: userInput.description,
          tone: userInput.tone,
          platforms: userInput.platforms,
          duration: userInput.duration || 30
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setDemoSentences(data.sentences || [])
      } else {
        console.error('Failed to generate demo sentences:', data.error)
        // Use fallback demos
        setDemoSentences([
          `Learn about ${userInput.description.split(' ').slice(0, 3).join(' ')} today!`,
          `This ${userInput.tone.toLowerCase()} guide will change everything!`,
          `Perfect for ${userInput.platforms.join(' and ')} creators!`,
          `Ready to master this in ${userInput.duration} seconds?`,
          `Don't miss this incredible transformation!`
        ])
      }
    } catch (err) {
      console.error('Error generating demos:', err)
      // Use simple fallback
      setDemoSentences([
        `Discover amazing ${userInput.description.split(' ')[0]} secrets!`,
        `This ${userInput.tone.toLowerCase()} approach works perfectly!`,
        `Get ready for an incredible journey!`,
        `You won't believe these results!`,
        `Transform your knowledge in minutes!`
      ])
    } finally {
      setLoadingDemos(false)
    }
  }

  // Filter voices based on provider and search
  const filteredVoices = voices.filter(voice => {
    const matchesProvider = activeProvider === 'all' || voice.provider?.toLowerCase() === activeProvider
    const matchesSearch = searchQuery === '' || 
      voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.style?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesProvider && matchesSearch
  })

  // Group voices by provider
  const groupedVoices = filteredVoices.reduce((acc, voice) => {
    const provider = voice.provider || 'Other'
    if (!acc[provider]) acc[provider] = []
    acc[provider].push(voice)
    return acc
  }, {})

  const handleVoiceSelect = (voice) => {
    onVoiceSelect({
      ...voice,
      instruction: voice.supportsInstructions ? voiceInstruction : null
    })
  }

  const playVoicePreview = async (voiceId) => {
    if (playingVoiceId === voiceId) {
      // Stop current audio
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.currentTime = 0
        setCurrentAudio(null)
      }
      setPlayingVoiceId(null)
      return
    }
    
    // Stop any existing audio
    if (currentAudio) {
      currentAudio.pause()
      setCurrentAudio(null)
    }
    
    setPlayingVoiceId(voiceId)
    
    try {
      // Get a random demo sentence
      const randomDemo = demoSentences.length > 0 
        ? demoSentences[Math.floor(Math.random() * demoSentences.length)]
        : `Here's a quick preview of this voice for your ${userInput?.description || 'amazing'} video!`
      
      // Find the voice to get instruction support
      const voice = voices.find(v => v.id === voiceId)
      
      const response = await fetch('/api/voice-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voiceId,
          demoText: randomDemo,
          voiceInstruction: voice?.supportsInstructions ? voiceInstruction : null
        })
      })
      
      const data = await response.json()
      
      if (data.success && data.voice?.audioUrl) {
        const audio = new Audio(data.voice.audioUrl)
        setCurrentAudio(audio)
        
        audio.onended = () => {
          setPlayingVoiceId(null)
          setCurrentAudio(null)
        }
        
        audio.onerror = () => {
          console.error('Audio playback failed')
          setPlayingVoiceId(null)
          setCurrentAudio(null)
        }
        
        await audio.play()
      } else {
        console.error('Failed to generate voice preview:', data.error)
        setPlayingVoiceId(null)
        // Fallback to simulated preview
        setTimeout(() => setPlayingVoiceId(null), 2000)
      }
    } catch (error) {
      console.error('Voice preview error:', error)
      setPlayingVoiceId(null)
      // Fallback to simulated preview
      setTimeout(() => setPlayingVoiceId(null), 2000)
    }
  }

  const getProviderIcon = (provider) => {
    switch (provider?.toLowerCase()) {
      case 'openai':
        return <Sparkles className="w-4 h-4" />
      case 'elevenlabs':
        return <Volume2 className="w-4 h-4" />
      case 'google':
        return <Globe className="w-4 h-4" />
      default:
        return <Mic className="w-4 h-4" />
    }
  }

  const getProviderColor = (provider) => {
    switch (provider?.toLowerCase()) {
      case 'openai':
        return 'from-blue-500 to-cyan-500'
      case 'elevenlabs':
        return 'from-purple-500 to-pink-500'
      case 'google':
        return 'from-green-500 to-emerald-500'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const providers = [
    { id: 'all', name: 'All Providers', count: voices.length },
    { id: 'openai', name: 'OpenAI', count: voices.filter(v => v.provider?.toLowerCase() === 'openai').length },
    { id: 'elevenlabs', name: 'ElevenLabs', count: voices.filter(v => v.provider?.toLowerCase() === 'elevenlabs').length },
    { id: 'google', name: 'Google AI', count: voices.filter(v => v.provider?.toLowerCase() === 'google').length }
  ]

  const instructionExamples = [
    "Speak like a friendly podcast host",
    "Use an authoritative news anchor voice",
    "Talk with excitement and high energy",
    "Narrate calmly like a meditation guide",
    "Sound professional like a business presenter"
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Mic className="w-8 h-8 text-purple-500" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
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
              Select Your AI Voice
            </h2>

            {/* Search and Filter Bar */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search voices by name, style, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                
                {/* Voice Instruction Input for OpenAI */}
                {activeProvider === 'openai' && (
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowInstructionModal(true)}
                    className="px-4 py-3 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-400 font-medium hover:bg-blue-500/30 transition-all flex items-center"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Add Voice Style
                  </motion.button>
                )}
              </div>

              {/* Provider Tabs */}
              <div className="flex flex-wrap gap-2">
                {providers.map((provider) => (
                  <motion.button
                    key={provider.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveProvider(provider.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeProvider === provider.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {provider.id !== 'all' && getProviderIcon(provider.id)}
                      {provider.name}
                      <span className="text-xs opacity-70">({provider.count})</span>
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
                {error}
              </div>
            )}

            {/* Demo Context Display */}
            {userInput && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl"
              >
                <h4 className="text-blue-400 font-semibold mb-2">🎯 Voice Demos Generated For:</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <p><strong>Topic:</strong> {userInput.description}</p>
                  <p><strong>Tone:</strong> {userInput.tone}</p>
                  <p><strong>Platforms:</strong> {userInput.platforms?.join(', ')}</p>
                  {loadingDemos && (
                    <p className="text-blue-400 flex items-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        <Sparkles className="w-4 h-4" />
                      </motion.div>
                      Generating contextual demos...
                    </p>
                  )}
                  {demoSentences.length > 0 && !loadingDemos && (
                    <p className="text-green-400">✅ {demoSentences.length} contextual demos ready!</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Voice Instruction Display */}
            {voiceInstruction && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg"
              >
                <p className="text-sm text-blue-400">
                  <strong>Voice Style:</strong> {voiceInstruction}
                </p>
              </motion.div>
            )}

            {/* Voices Grid */}
            <div className="space-y-8 mb-8 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {Object.entries(groupedVoices).map(([provider, providerVoices]) => (
                <div key={provider}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-300">
                    {getProviderIcon(provider)}
                    {provider}
                    <span className="text-sm text-gray-500">({providerVoices.length} voices)</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {providerVoices.map((voice, index) => (
                      <motion.div
                        key={voice.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.03, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleVoiceSelect(voice)}
                        className={`relative bg-gray-800/50 border rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                          selectedVoice?.id === voice.id
                            ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                            : 'border-white/10 hover:border-purple-500/50'
                        }`}
                      >
                        {/* Premium Badge */}
                        {voice.premium && (
                          <div className="absolute top-2 right-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                          </div>
                        )}

                        {/* Voice Info */}
                        <div className="mb-3">
                          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                            {voice.name}
                            {voice.supportsInstructions && (
                              <Sparkles className="w-4 h-4 text-blue-400" title="Supports voice instructions" />
                            )}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {voice.style || voice.gender} 
                            {voice.description && ` • ${voice.description}`}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              playVoicePreview(voice.id)
                            }}
                            className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                              playingVoiceId === voice.id
                                ? 'bg-purple-500 text-white'
                                : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                            }`}
                          >
                            {playingVoiceId === voice.id ? (
                              <Pause className="w-3 h-3 mr-1.5" />
                            ) : (
                              <Play className="w-3 h-3 mr-1.5" />
                            )}
                            Preview
                          </motion.button>

                          {selectedVoice?.id === voice.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-auto px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium"
                            >
                              Selected
                            </motion.div>
                          )}
                        </div>

                        {/* Provider Badge */}
                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getProviderColor(provider)} rounded-b-xl`} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBack}
                className="flex-1 py-3 sm:py-4 bg-gray-700/50 rounded-xl font-semibold text-white hover:bg-gray-700/70 transition-all"
              >
                Back to Script
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onNext}
                disabled={!selectedVoice}
                className={`flex-1 py-3 sm:py-4 rounded-xl font-semibold text-white shadow-xl relative overflow-hidden group ${
                  selectedVoice
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : 'bg-gray-600 cursor-not-allowed opacity-50'
                }`}
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
                {selectedVoice && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Voice Instruction Modal */}
      <AnimatePresence>
        {showInstructionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInstructionModal(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-2xl p-6 max-w-lg w-full border border-white/10"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-blue-400" />
                Voice Style Instructions
              </h3>
              
              <p className="text-gray-400 mb-4">
                Customize how the AI voice speaks your script. This feature is available for OpenAI voices.
              </p>

              <textarea
                value={voiceInstruction}
                onChange={(e) => setVoiceInstruction(e.target.value)}
                placeholder="e.g., Speak like an excited sports commentator..."
                className="w-full h-32 p-4 bg-gray-800 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 resize-none"
              />

              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Examples:</p>
                <div className="space-y-2">
                  {instructionExamples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setVoiceInstruction(example)}
                      className="block w-full text-left px-3 py-2 bg-gray-800/50 rounded-lg text-sm text-gray-300 hover:bg-gray-700/50 transition-all"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowInstructionModal(false)}
                  className="flex-1 py-2 bg-gray-700 rounded-lg font-medium hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowInstructionModal(false)
                  }}
                  className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Apply Style
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VoiceSelection
