import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic,
  Sparkles,
  Wand2,
  Play,
  Film,
  Palette,
  Clock,
  Camera,
  Music,
  Share2
} from 'lucide-react'

const ScriptForm = ({
  inputText,
  setInputText,
  showConfig,
  setShowConfig,
  selectedTone,
  setSelectedTone,
  selectedPlatforms,
  togglePlatform,
  duration,
  setDuration,
  isRecording,
  setIsRecording,
  handleScriptGeneration,
  isGenerating
}) => (
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
            ease: 'easeInOut',
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
                ease: 'easeInOut',
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
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                )}
              </motion.button>
            </div>
          </div>

          {/* Configuration Options */}
          <AnimatePresence>
            {showConfig && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Tone Selection */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mb-6"
                >
                  <label className="block text-sm font-medium mb-3 text-gray-300 text-left">
                    Tone
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Professional', 'Educational', 'Fun', 'Inspiring'].map((tone) => (
                      <motion.button
                        key={tone}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedTone(tone)}
                        className={`py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                          selectedTone === tone
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                            : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800/70'
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
                  className="mb-6"
                >
                  <label className="block text-sm font-medium mb-3 text-gray-300 text-left">
                    Platforms
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { name: 'TikTok', icon: <Play className="w-4 h-4" />, accent: 'from-pink-500/30 to-purple-500/30' },
                      { name: 'Instagram', icon: <Camera className="w-4 h-4" />, accent: 'from-purple-500/30 to-orange-500/30' },
                      { name: 'YouTube', icon: <Play className="w-4 h-4" />, accent: 'from-red-500/30 to-red-600/30' }
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
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
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
)

export default ScriptForm
