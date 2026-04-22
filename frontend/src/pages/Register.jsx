import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorStatus, setErrorStatus] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/auth/register', { username, email, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      navigate('/markets');
    } catch (error) {
      setErrorStatus(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] relative">
      <div className="absolute inset-0 animate-gradient-bg opacity-10 pointer-events-none rounded-full blur-3xl w-3/4 h-3/4 mx-auto top-10"></div>
      
      <div className="bg-[#12121f] border border-[#ffffff15] p-10 rounded-2xl w-full max-w-md shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white tracking-tighter">Create Account</h2>
          <p className="text-zinc-500 font-medium">Join the BitBuzz prediction market.</p>
        </div>
        
        {errorStatus && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-sm font-bold shadow-[0_0_15px_rgba(239,68,68,0.1)]">{errorStatus}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2 font-bold">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              className="w-full bg-[#0a0a0f] border border-[#ffffff10] text-white p-4 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium"
              required 
            />
          </div>
          <div className="mb-5">
            <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2 font-bold">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full bg-[#0a0a0f] border border-[#ffffff10] text-white p-4 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium"
              required 
            />
          </div>
          <div className="mb-8">
            <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2 font-bold">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full bg-[#0a0a0f] border border-[#ffffff10] text-white p-4 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium"
              required 
            />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-black tracking-wide p-4 rounded-xl shadow-lg shadow-cyan-500/20 transition-all transform active:scale-95">
            Register &mdash; Let's Go
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-[#ffffff10] text-center">
          <p className="text-zinc-500 text-sm font-medium">
            Already have an account? <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
