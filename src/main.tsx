import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add error boundary
const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

const root = createRoot(rootElement)

// Wrap in try-catch for better error handling
try {
  root.render(<App />)
  console.log('App rendered successfully')
} catch (error) {
  console.error('Error rendering app:', error)
  root.render(
    <div style={{ padding: '20px', color: 'red' }}>
      <h1>Error Loading Application</h1>
      <p>{error instanceof Error ? error.message : 'Unknown error'}</p>
    </div>
  )
}
