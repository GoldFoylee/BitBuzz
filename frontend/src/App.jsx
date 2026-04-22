import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Markets from './pages/Markets';
import MarketDetail from './pages/MarketDetail';
import Portfolio from './pages/Portfolio';
import Leaderboard from './pages/Leaderboard';
import Navbar from './components/Navbar';
import { socket } from './services/socket';
import api from './services/api';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      if (localStorage.getItem('token')) {
        const response = await api.get('/auth/me');
        setUser(response.data);
      }
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center text-white">Loading...</div>;

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/*" element={
            <>
              <Navbar user={user} setUser={setUser} />
              <main className="flex-1 container mx-auto p-4">
                <Routes>
                  <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/markets" />} />
                  <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/markets" />} />
                  <Route path="/markets" element={<Markets />} />
                  <Route path="/markets/:id" element={user ? <MarketDetail /> : <Navigate to="/login" />} />
                  <Route path="/portfolio" element={user ? <Portfolio /> : <Navigate to="/login" />} />
                  <Route path="/leaderboard" element={<Leaderboard user={user} />} />
                </Routes>
              </main>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
