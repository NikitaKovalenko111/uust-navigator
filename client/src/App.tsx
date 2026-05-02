import { Navigator } from './pages/Navigator'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PointsPage } from './pages/Points'
import './styles/scss/styles.scss'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigator />} />
        <Route path="/points" element={<PointsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
