import React from 'react'
import { motion } from 'framer-motion'
import { Video, Film, Music, Play, Sparkles } from 'lucide-react'

const VideoAssembly = ({ onBack }) => (
  <motion.div
    key="stage4"
    className="flex items-start justify-center px-4"
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -100, opacity: 0 }}
    transition={{ type: 'spring', stiffness: 80, damping: 20 }}
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
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-center flex items-center justify-center">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
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
                onClick={onBack}
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
)

export default VideoAssembly
