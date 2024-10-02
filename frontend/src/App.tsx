import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Landing } from './pages/Landing';
import { Signup } from './pages/Signup';
import { AuthProvider } from './context/AuthContext';
import TransactionPage from './pages/Transaction';
import { Toaster } from "@/components/ui/toaster";
// import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
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
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
