import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MfaPage from './pages/MfaPage';
import CadastroVideosPage from './pages/CadastroVideosPage';
import ListaVideosPage from './pages/ListaVideosPage';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
console.log(isAuthenticated);
  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? '/videos/cadastro' : '/login'} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/mfa" element={<MfaPage />} />
      <Route path="/videos" element={<ListaVideosPage />} />
      <Route path="/videos/cadastro" element={isAuthenticated ? <CadastroVideosPage /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
