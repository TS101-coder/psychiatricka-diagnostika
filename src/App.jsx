import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import DiagnozaDetail from './pages/DiagnozaDetail'
import DifferentialPage from './pages/DifferentialPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="diagnoza/:id" element={<DiagnozaDetail />} />
          <Route path="diferencialni" element={<DifferentialPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
