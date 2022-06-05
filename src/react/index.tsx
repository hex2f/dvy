import { createRoot } from 'react-dom/client'

import './index.css'
import { PoolsProvider } from './providers/PoolsProvider'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import SavedChannels from './views/SavedChannels'
import Sidebar from './components/sidebar'
import SavedPool from './views/SavedPool'
import ContentGroup from './views/ContentGroup'

const rootElement = document.getElementById('app')

if (!rootElement) {
  const error = new Error('Root element not found. Was this script loaded in the correct HTML context?')
  document.body.innerText = 'React Error: ' + error.message
  throw error
}

const root = createRoot(rootElement)

root.render(
  <PoolsProvider>
    <BrowserRouter>
      <Sidebar />
      <Routes>
        <Route path="/" element={<SavedChannels />}>
          <Route path="/pool/:address" element={<SavedPool />}>
            <Route path="/pool/:address/cg/:groupAddress" element={<ContentGroup />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </PoolsProvider>
)
