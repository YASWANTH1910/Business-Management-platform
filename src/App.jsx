import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CareOpsProvider } from './context/CareOpsContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';

import Staff from './pages/Staff';
import Settings from './pages/Settings';
import Inbox from './pages/Inbox';
import Bookings from './pages/Bookings';
import StaffBookings from './pages/StaffBookings';
import Forms from './pages/Forms';
import Inventory from './pages/Inventory';
import ActivateWorkspace from './pages/ActivateWorkspace';
import Integrations from './pages/Integrations';
import PublicContactForm from './pages/public/PublicContactForm';
import PublicBookingPage from './pages/public/PublicBookingPage';
import TokenSetup from './pages/TokenSetup';

function App() {
    return (
        <CareOpsProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/onboarding" replace />} />
                    <Route path="/token-setup" element={<TokenSetup />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/activate" element={<ActivateWorkspace />} />

                    {/* Public Routes */}
                    <Route path="/contact" element={<PublicContactForm />} />
                    <Route path="/book/:businessId?" element={<PublicBookingPage />} />

                    {/* Protected Dashboard Routes */}
                    <Route element={<DashboardLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/leads" element={<Leads />} />
                        <Route path="/staff" element={<Staff />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/inbox" element={<Inbox />} />
                        <Route path="/bookings" element={<Bookings />} />
                        <Route path="/staff-bookings" element={<StaffBookings />} />
                        <Route path="/forms" element={<Forms />} />
                        <Route path="/inventory" element={<Inventory />} />
                        <Route path="/integrations" element={<Integrations />} />
                    </Route>
                </Routes>
            </Router>
        </CareOpsProvider>
    );
}

export default App;
