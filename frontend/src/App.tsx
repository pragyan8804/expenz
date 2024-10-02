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
// import { ProtectedRoute } from './components/ProtectedRoute';

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
              // <ProtectedRoute>
                <Dashboard />
              // </ProtectedRoute>
            } />
            <Route path="/transactions" element={<TransactionPage />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
