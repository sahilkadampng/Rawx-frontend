import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Solutions from './pages/Solutions'
import Docs from './pages/Docs'
import Infrastructure from './pages/Infrastructure'
import Donate from './components/Donate'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import { useVisitorTracker } from './hooks/useVisitorTracker'
import { FeatureFlagProvider } from './context/FeatureFlagContext'

function AppRoutes() {
    useVisitorTracker();

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/infrastructure" element={<Infrastructure />} />
            <Route path="/Donate" element={<Donate />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
    );
}

import { NotificationProvider } from './context/NotificationContext'

export default function App() {
    return (
        <BrowserRouter>
            <NotificationProvider>
                <FeatureFlagProvider>
                    <AppRoutes />
                </FeatureFlagProvider>
            </NotificationProvider>
        </BrowserRouter>
    );
}
