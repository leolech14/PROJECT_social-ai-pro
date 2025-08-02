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
    if (!userInput || loadingDemos) return
    
    try {
      setLoadingDemos(true)
      const response = await fetch('/api/generate-demos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInput)
      })
      
      const data = await response.json()
      
      if (data.success && data.demos) {
        setDemoSentences(data.demos.slice(0, 5)) // Use first 5 demos
      }
    } catch (err) {
      console.error('Error generating demos:', err)
    } finally {
      setLoadingDemos(false)
    }
  }

  const handleVoicePreview = async (voice) => {
    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
      setCurrentAudio(null)
      setPlayingVoiceId(null)
    }

    if (playingVoiceId === voice.id) {
      return // Already stopped
    }

    try {
      setPlayingVoiceId(voice.id)
      
      // Use contextual demo sentence if available, otherwise fallback
      const demoText = demoSentences.length > 0 
        ? demoSentences[Math.floor(Math.random() * demoSentences.length)]
        : `Hi there! This is ${voice.name}, bringing your content to life with ${voice.style?.toLowerCase() || 'amazing'} voice quality.`
      
      const response = await fetch('/api/voice-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voiceId: voice.id,
          demoText,
          voiceInstruction: voice.supportsInstructions ? voiceInstruction : undefined
        })
      })

      const data = await response.json()
      
      if (data.success && data.audioUrl) {
        const audio = new Audio(data.audioUrl)
        setCurrentAudio(audio)
        
        audio.onended = () => {
          setPlayingVoiceId(null)
          setCurrentAudio(null)
        }
        
        await audio.play()
      } else {
        throw new Error(data.error || 'Failed to generate preview')
      }
    } catch (err) {
      console.error('Failed to generate voice preview:', err)
      alert(`Failed to generate voice preview: ${err.message}`)
      setPlayingVoiceId(null)
      setCurrentAudio(null)
    }
  }

  const handleVoiceSelect = (voice) => {
    // Stop any playing audio
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
      setCurrentAudio(null)
      setPlayingVoiceId(null)
    }
    
    onVoiceSelect({
      ...voice,
      instruction: voice.supportsInstructions ? voiceInstruction : undefined
    })
  }

  const filteredVoices = voices.filter(voice => {
    const matchesProvider = activeProvider === 'all' || voice.provider.toLowerCase() === activeProvider
    const matchesSearch = !searchQuery || 
      voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.style?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesProvider && matchesSearch
  })

  const providers = [
    { id: 'all', name: 'All Providers', count: voices.length },
    { id: 'openai', name: 'OpenAI', icon: '🤖', count: voices.filter(v => v.provider === 'OpenAI').length },
    { id: 'elevenlabs', name: 'ElevenLabs', icon: '🎙️', count: voices.filter(v => v.provider === 'ElevenLabs').length },
    { id: 'google', name: 'Google AI', icon: '🌐', count: voices.filter(v => v.provider === 'Google').length }
  ]

  const groupedVoices = filteredVoices.reduce((acc, voice) => {
    const provider = voice.provider
    if (!acc[provider]) {
      acc[provider] = []
    }
    acc[provider].push(voice)
    return acc
  }, {})

  return (
    <motion.div
      key="voice-selection"
      className="min-h-screen flex items-center justify-center px-2"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8 }}
    >
      <div className="w-full max-w-5xl">
        <div className="relative bg-gray-900/60 backdrop-blur-xl rounded-lg p-3 border border-white/10 shadow-xl">
          <motion.div
            className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-lg opacity-50 blur-sm"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <div className="relative z-10">
            <h2 className="text-base font-bold mb-2 text-center flex items-center justify-center">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Mic className="mr-1 text-blue-400 w-4 h-4" />
              </motion.div>
              Select Your AI Voice
            </h2>

            {/* Search and Filter */}
            <div className="mb-2 space-y-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search voices by name, style, or description..."
                    className="w-full pl-6 pr-2 py-1 bg-gray-800/50 border border-white/10 rounded text-xs text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                {voices.some(v => v.supportsInstructions) && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowInstructionModal(true)}
                    className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-400 font-medium hover:bg-blue-500/30 transition-all flex items-center"
                  >
                    <Info className="w-3 h-3 mr-1" />
                    Voice Instructions
                  </motion.button>
                )}
              </div>
              
              {/* Provider Filters */}
              <div className="flex flex-wrap gap-1">
                {providers.map((provider) => (
                  <motion.button
                    key={provider.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveProvider(provider.id)}
                    className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
                      activeProvider === provider.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      {provider.icon && <span>{provider.icon}</span>}
                      {provider.name}
                      <span className="text-xs opacity-70">({provider.count})</span>
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="mb-2 p-2 bg-red-500/20 border border-red-500/30 rounded text-xs text-red-400">
                {error}
              </div>
            )}

            {/* Demo Sentences Status */}
            {userInput && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-2 p-2 bg-blue-500/10 border border-blue-500/30 rounded"
              >
                <h4 className="text-xs text-blue-400 font-semibold mb-1">🎯 Voice Demos Generated For:</h4>
                <div className="text-xs text-gray-300 space-y-0.5">
                  <p><strong>Topic:</strong> {userInput.description}</p>
                  <p><strong>Tone:</strong> {userInput.tone}</p>
                  <p><strong>Platforms:</strong> {userInput.platforms?.join(', ')}</p>
                  {loadingDemos ? (
                    <p className="text-blue-400 flex items-center">
                      <Sparkles className="w-3 h-3 mr-1 animate-spin" />
                      Generating contextual demos...
                    </p>
                  ) : demoSentences.length > 0 ? (
                    <p className="text-green-400">✅ {demoSentences.length} contextual demos ready!</p>
                  ) : null}
                </div>
              </motion.div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-8">
                <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-2 animate-spin" />
                <p className="text-gray-400 text-xs">Loading voices...</p>
              </div>
            ) : (
              /* Voice List */
              <div className="max-h-[50vh] overflow-y-auto space-y-3">
                {Object.entries(groupedVoices).map(([provider, providerVoices]) => (
                  <div key={provider}>
                    <h3 className="text-sm font-semibold mb-1 flex items-center gap-1 text-gray-300">
                      {providers.find(p => p.name === provider)?.icon}
                      {provider}
                      <span className="text-xs text-gray-500">({providerVoices.length} voices)</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {providerVoices.map((voice) => (
                        <motion.div
                          key={voice.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => handleVoiceSelect(voice)}
                          className={`relative bg-gray-800/50 border rounded p-2 cursor-pointer transition-all duration-300 ${
                            selectedVoice?.id === voice.id
                              ? 'border-purple-500 bg-purple-500/10'
                              : 'border-white/10 hover:border-purple-500/50'
                          }`}
                        >
                          <div className="flex flex-col h-full">
                            <div className="flex items-start justify-between mb-1">
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-white flex items-center gap-1">
                                  {voice.name}
                                  {voice.supportsInstructions && (
                                    <Zap className="w-3 h-3 text-yellow-400" title="Supports voice instructions" />
                                  )}
                                </h4>
                                <p className="text-xs text-gray-400">
                                  {voice.style} • {voice.description || voice.gender}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-auto">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleVoicePreview(voice)
                                }}
                                className={`flex items-center px-2 py-0.5 rounded text-xs font-medium transition-all ${
                                  playingVoiceId === voice.id
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                                }`}
                              >
                                {playingVoiceId === voice.id ? (
                                  <>
                                    <Pause className="w-3 h-3 mr-1" />
                                    Stop
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-3 h-3 mr-1" />
                                    Preview
                                  </>
                                )}
                              </motion.button>
                              
                              {selectedVoice?.id === voice.id && (
                                <span className="ml-auto px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-medium">
                                  Selected
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 mt-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBack}
                className="px-3 py-1.5 bg-gray-700/50 text-gray-300 rounded text-sm font-medium hover:bg-gray-700 transition-all"
              >
                Back to Script
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onNext}
                disabled={!selectedVoice}
                className={`flex-1 px-3 py-1.5 rounded text-sm font-semibold transition-all relative overflow-hidden ${
                  selectedVoice
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span className="relative z-10 flex items-center justify-center">
                  Generate Voice
                  <ChevronDown className="ml-1 w-4 h-4 rotate-[-90deg]" />
                </span>
                {selectedVoice && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-500"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Instruction Modal */}
      <AnimatePresence>
        {showInstructionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 z-50"
            onClick={() => setShowInstructionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-lg p-3 max-w-sm w-full border border-white/10"
            >
              <h3 className="text-sm font-bold mb-2 flex items-center">
                <Zap className="w-4 h-4 mr-1 text-yellow-400" />
                Voice Instructions (2025 Feature)
              </h3>
              
              <p className="text-xs text-gray-400 mb-2">
                Some voices support natural language instructions to control style, emotion, and delivery.
              </p>
              
              <textarea
                value={voiceInstruction}
                onChange={(e) => setVoiceInstruction(e.target.value)}
                placeholder="e.g., Speak with enthusiasm and energy, emphasize key points..."
                className="w-full h-20 p-2 bg-gray-800 border border-white/10 rounded text-xs text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 resize-none"
              />
              
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Examples:</p>
                <div className="space-y-1">
                  {[
                    "Speak slowly and clearly with pauses",
                    "Use an excited, energetic tone",
                    "Sound professional and authoritative"
                  ].map((example, idx) => (
                    <button
                      key={idx}
                      onClick={() => setVoiceInstruction(example)}
                      className="block w-full text-left px-2 py-1 bg-gray-800/50 rounded text-xs text-gray-300 hover:bg-gray-700/50 transition-all"
                    >
                      "{example}"
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setShowInstructionModal(false)}
                  className="flex-1 px-3 py-1 bg-gray-700 text-white rounded text-xs font-medium hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowInstructionModal(false)}
                  className="flex-1 px-3 py-1 bg-blue-500 text-white rounded text-xs font-medium hover:bg-blue-600 transition-all"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default VoiceSelection