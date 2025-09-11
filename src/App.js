import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './adminDashboard';  // ya ./Dashboard agar naam change karo
import MyEvents from './Pages/MyEvents';
import Analytics from './Pages/Analytics';
import CreateEvent from './Pages/CreateEvent';
import Registrations from './Pages/Registrations';
import ExportData from './Pages/ExportData';
import AuthForm from './AuthForm';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route → Login/Register */}
        <Route path="/" element={<AuthForm />} />

        {/* Main Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/my-events" element={<MyEvents />} />
        <Route path="/dashboard/analytics" element={<Analytics />} />
        <Route path="/dashboard/create-event" element={<CreateEvent />} />
        <Route path="/dashboard/registrations" element={<Registrations />} />
        <Route path="/dashboard/export" element={<ExportData />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
