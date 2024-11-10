import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Orders from './pages/Admin/Orders';
import Reports from './pages/Admin/Reports';
import Manage from './pages/Admin/Manage';
import Profile from './pages/Admin/Profile';
import NewOrder from './pages/Customer/NewOrder';
import AdminLayout from './layouts/AdminLayout';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to ="/Orders" replace />} />
        <Route element={<AdminLayout />}>
          <Route path="/Orders" element={<Orders />} />
          <Route path="/Reports" element={<Reports />} />
          <Route path="/Manage" element={<Manage />} />
          <Route path="/Profile" element={<Profile />} />
        </Route>
        {/* Ruta para clientes a través del enlace proporcionado */}
        <Route path="/customer/NewOrder" element={<NewOrder />} />
      </Routes>
    </Router>
  )
}

export default App
