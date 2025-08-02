import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Add TextEncoder/TextDecoder for Node environment
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock canvas context for tests
HTMLCanvasElement.prototype.getContext = () => ({
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  stroke: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
})

// Mock scrollIntoView for jsdom
Element.prototype.scrollIntoView = jest.fn()

// Mock framer-motion for tests
jest.mock('framer-motion', () => {
  const React = require('react')
  const motion = new Proxy(
    {},
    {
      get: (_, tag) => ({ children, ...props }) => {
        const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props
        return React.createElement(tag, rest, children)
      }
    }
  )
  return {
    motion,
    AnimatePresence: ({ children }) => children,
    useMotionValue: () => ({ set: jest.fn() }),
    useTransform: () => 0,
  }
})

// Mock environment variables
process.env = {
  ...process.env,
  NODE_ENV: 'test',
  VITE_API_URL: 'http://localhost:3003',
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