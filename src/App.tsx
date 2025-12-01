import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="text-xl font-bold text-gray-900">
                  WinMix TipsterHub
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </Link>
                <Link to="/about" className="text-gray-600 hover:text-gray-900">
                  About
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route
              path="/"
              element={
                <div className="px-4 py-6 sm:px-0">
                  <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Welcome to WinMix TipsterHub
                      </h1>
                      <p className="text-gray-600 mb-6">
                        Football analytics and prediction platform
                      </p>
                      <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Test Counter</h2>
                        <button
                          onClick={() => setCount((count) => count + 1)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          count is {count}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              }
            />
            <Route
              path="/about"
              element={
                <div className="px-4 py-6 sm:px-0">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">About</h1>
                  <p className="text-gray-600">
                    This is a modern React 18 + TypeScript + Vite application with
                    Tailwind CSS.
                  </p>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
