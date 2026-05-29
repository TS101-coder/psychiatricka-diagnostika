import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import DiagnozaDetail from './pages/DiagnozaDetail'
import DifferentialPage from './pages/DifferentialPage'
import Mkn11Detail from './pages/Mkn11Detail'
import Mkn11Home from './pages/Mkn11Home'
import Dsm5Home from './pages/Dsm5Home'
import Dsm5Detail from './pages/Dsm5Detail'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="diagnoza/:id" element={<DiagnozaDetail />} />
          <Route path="diferencialni" element={<DifferentialPage />} />
          <Route path="mkn11" element={<Mkn11Home />} />
          <Route path="mkn11/:id" element={<Mkn11Detail />} />
          <Route path="dsm5" element={<Dsm5Home />} />
          <Route path="dsm5/:id" element={<Dsm5Detail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
