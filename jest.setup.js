// Jest setup file for global test configuration

// Mock fetch globally
global.fetch = jest.fn()

// Mock AbortController
global.AbortController = class AbortController {
  constructor() {
    this.signal = {
      aborted: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }
  }

  abort() {
    this.signal.aborted = true
  }
}

// Mock FormData
global.FormData = class FormData {
  constructor() {
    this.data = new Map()
  }

  append(key, value) {
    if (this.data.has(key)) {
      const existing = this.data.get(key)
      if (Array.isArray(existing)) {
        existing.push(value)
      } else {
        this.data.set(key, [existing, value])
      }
    } else {
      this.data.set(key, value)
    }
  }

  get(key) {
    const value = this.data.get(key)
    return Array.isArray(value) ? value[0] : value
  }

  getAll(key) {
    const value = this.data.get(key)
    return Array.isArray(value) ? value : value ? [value] : []
  }

  has(key) {
    return this.data.has(key)
  }

  delete(key) {
    this.data.delete(key)
  }

  entries() {
    return this.data.entries()
  }

  keys() {
    return this.data.keys()
  }

  values() {
    return this.data.values()
  }
}

// Mock File
global.File = class File {
  constructor(chunks, filename, options = {}) {
    this.name = filename
    this.size = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
    this.type = options.type || ''
    this.lastModified = options.lastModified || Date.now()
  }
}

// Mock Headers
global.Headers = class Headers {
  constructor(init = {}) {
    this.map = new Map()
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this.map.set(key.toLowerCase(), value)
      })
    }
  }

  get(key) {
    return this.map.get(key.toLowerCase()) || null
  }

  set(key, value) {
    this.map.set(key.toLowerCase(), value)
  }

  has(key) {
    return this.map.has(key.toLowerCase())
  }

  delete(key) {
    this.map.delete(key.toLowerCase())
  }

  forEach(callback) {
    this.map.forEach((value, key) => callback(value, key))
  }

  entries() {
    return this.map.entries()
  }

  keys() {
    return this.map.keys()
  }

  values() {
    return this.map.values()
  }
}

// Mock console methods to avoid noise in tests
const originalConsole = global.console
global.console = {
  ...originalConsole,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
}

// Restore console for specific tests that need it
global.restoreConsole = () => {
  global.console = originalConsole
}

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks()
})
