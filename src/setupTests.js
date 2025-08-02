import '@testing-library/jest-dom'
import mockReact from 'react'
import { TextEncoder, TextDecoder } from 'util'

// Add TextEncoder/TextDecoder for Node environment
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock scrollIntoView used in App component
HTMLElement.prototype.scrollIntoView = jest.fn()

// Minimal canvas mock for tests
HTMLCanvasElement.prototype.getContext = () => ({
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  fillStyle: '#000',
  strokeStyle: '#000',
  lineWidth: 1
})

// Mock framer-motion for tests with a generic element proxy
jest.mock('framer-motion', () => {
  const motionProxy = new Proxy(
    {},
    {
      get: (target, prop) => ({ children, ...props }) => {
        const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props
        return mockReact.createElement(prop, rest, children)
      }
    }
  )

  return {
    motion: motionProxy,
    AnimatePresence: ({ children }) => children,
    useMotionValue: () => ({ set: jest.fn() }),
    useTransform: () => 0,
  }
})

// Mock lucide-react icons to simple svg components
jest.mock('lucide-react', () => {
  const mockReactIcon = require('react')
  return new Proxy({}, {
    get: () => (props) => mockReactIcon.createElement('svg', props)
  })
})

// Mock environment variables
process.env = {
  ...process.env,
  NODE_ENV: 'test',
  VITE_API_URL: 'http://localhost:3003',
  JWT_SECRET: 'test-secret-key',
}

// Suppress console errors during tests unless explicitly testing error handling
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
