import { createRoot } from 'react-dom/client'

const rootElement = document.getElementById('app')

if (!rootElement) {
  const error = new Error('Root element not found. Was this script loaded in the correct HTML context?')
  document.body.innerText = 'React Error: ' + error.message
  throw error
}

const root = createRoot(rootElement)

root.render(<p>Hello Electron!</p>)
