import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Coins } from 'lucide-react';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-[#0a0a0f]/80 backdrop-blur-md border-b border-[#ffffff10] sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Left */}
        <Link to="/" className="text-2xl font-black bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent tracking-tighter">
          BitBuzz ⚡
        </Link>
        
        {/* Center */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/markets" className="text-zinc-400 hover:text-white font-bold tracking-wide transition-colors">Markets</Link>
          <Link to="/portfolio" className="text-zinc-400 hover:text-white font-bold tracking-wide transition-colors">Portfolio</Link>
          <Link to="/leaderboard" className="text-zinc-400 hover:text-white font-bold tracking-wide transition-colors">Leaderboard</Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-2 bg-cyan-900/20 border border-cyan-500/30 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                <Coins size={16} className="text-cyan-400" />
                <span className="font-mono text-cyan-400 font-bold">{parseFloat(user.buzzCredits).toFixed(2)}</span>
              </div>
              <span className="hidden md:block text-white font-bold">{user.username}</span>
              <button onClick={handleLogout} className="text-zinc-500 hover:text-red-400 transition-colors p-2">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-zinc-300 hover:text-white font-bold px-4 py-2">
                Login
              </Link>
              <Link to="/register" className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-full shadow-lg shadow-purple-500/30 transition-all">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
