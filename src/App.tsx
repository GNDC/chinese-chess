import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainMenu from './pages/MainMenu'
import Rules from './pages/Rules'
import AIGame from './pages/AIGame'
import VsGame from './pages/VsGame'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/ai" element={<AIGame />} />
        <Route path="/vs" element={<VsGame />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
