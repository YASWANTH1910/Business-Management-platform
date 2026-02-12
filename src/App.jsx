import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CareOpsProvider } from './context/CareOpsContext';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';

import Staff from './pages/Staff';
import Settings from './pages/Settings';
import Inbox from './pages/Inbox';
import Bookings from './pages/Bookings';
import Forms from './pages/Forms';
import Inventory from './pages/Inventory';
import ActivateWorkspace from './pages/ActivateWorkspace';
import PublicContactForm from './pages/public/PublicContactForm';
import PublicBookingPage from './pages/public/PublicBookingPage';

function App() {
    return (
        <CareOpsProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/onboarding" replace />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/leads" element={<Leads />} />
                    <Route path="/staff" element={<Staff />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/inbox" element={<Inbox />} />
                    <Route path="/bookings" element={<Bookings />} />
                    <Route path="/forms" element={<Forms />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/activate" element={<ActivateWorkspace />} />
                    <Route path="/contact" element={<PublicContactForm />} />
                    <Route path="/book/:businessId?" element={<PublicBookingPage />} />
                </Routes>
            </Router>
        </CareOpsProvider>
    );
}

export default App;
