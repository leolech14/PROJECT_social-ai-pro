import '@testing-library/jest-dom'
import React from 'react'
import { TextEncoder, TextDecoder } from 'util'

// Add TextEncoder/TextDecoder for Node environment
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock framer-motion for tests
jest.mock('framer-motion', () => {
  const React = require('react')
  return {
    motion: {
      div: ({ children, ...props }) => {
        const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props
        return React.createElement('div', rest, children)
      },
      button: ({ children, ...props }) => {
        const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props
        return React.createElement('button', rest, children)
      },
      header: ({ children, ...props }) => {
        const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props
        return React.createElement('header', rest, children)
      },
      span: ({ children, ...props }) => {
        const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props
        return React.createElement('span', rest, children)
      }
    },
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
