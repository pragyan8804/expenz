import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Landing } from './pages/Landing';
import { Signup } from './pages/Signup';
import { AuthProvider } from './context/AuthContext';
import TransactionPage from './pages/Transaction';
import { Toaster } from "@/components/ui/toaster";
import Settings from './pages/Settings';
import { ThemeProvider } from './components/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Split from './pages/Split';
import Group from './pages/Group';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/transactions" element={
              <ProtectedRoute>
                <TransactionPage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/split" element={
              <ProtectedRoute>
                <Split />
              </ProtectedRoute>
            } />
            <Route path="//groups/:groupId" element={
              <ProtectedRoute>
                <Group />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
