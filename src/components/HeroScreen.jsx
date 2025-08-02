import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

const HeroScreen = ({ onStart }) => (
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
            ease: 'linear',
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
        onClick={onStart}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center text-purple-400"
        >
          <span className="text-sm mb-2">Start Creating</span>
          <ArrowDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </div>
  </motion.section>
)

export default HeroScreen
