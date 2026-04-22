import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Coins, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Portfolio = () => {
  const [positions, setPositions] = useState([]);
  const [userProfile, setUserProfile] = useState({ username: '', buzzCredits: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const portRes = await api.get('/trades/portfolio');
        setPositions(portRes.data);
        const meRes = await api.get('/auth/me');
        setUserProfile(meRes.data);
      } catch (error) {
        // Handle silently
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  if (loading) return <div className="py-20 text-center text-zinc-500">Loading portfolio...</div>;

  const totalUnrealizedPnL = positions.reduce((acc, p) => acc + p.pnl, 0);
  const totalPositionsValue = positions.reduce((acc, p) => acc + p.currentValue, 0);
  const totalPortfolioValue = parseFloat(userProfile.buzzCredits) + totalPositionsValue;

  return (
    <div className="py-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl text-white font-black tracking-tight mb-2">
            {userProfile.username}'s <span className="font-light text-zinc-500">Portfolio</span>
          </h1>
          <p className="text-zinc-400 text-lg">Total Value: <span className="text-white font-mono font-bold">{totalPortfolioValue.toFixed(2)} Bz</span></p>
        </div>
        
        <div className="flex items-center gap-3 bg-cyan-900/20 border border-cyan-500/30 px-6 py-3 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.15)]">
           <Coins className="text-cyan-400" size={24} />
           <div>
             <p className="text-xs text-cyan-400/80 font-bold uppercase tracking-wider">Available Balance</p>
             <p className="font-mono text-2xl text-cyan-400 font-black">{parseFloat(userProfile.buzzCredits).toFixed(2)}</p>
           </div>
        </div>
      </div>

      <div className="bg-[#12121f] border border-[#ffffff15] rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0a0a0f] border-b border-[#ffffff10]">
              <tr>
                <th className="p-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Market</th>
                <th className="p-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-center">Outcome</th>
                <th className="p-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Shares</th>
                <th className="p-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Avg Entry</th>
                <th className="p-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Current Value</th>
                <th className="p-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">P&L</th>
                <th className="p-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffffff0a]">
              {positions.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-5">
                    <p className="text-white font-semibold line-clamp-1">{p.market.title}</p>
                    {p.market.status === 'RESOLVED' && <span className="text-[10px] text-red-400 tracking-wider font-bold">SETTLED</span>}
                  </td>
                  <td className="p-5 text-center">
                    <span className={`px-3 py-1 rounded-md text-xs font-black tracking-widest ${p.outcome === 'YES' ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-red-500/20 text-red-400 border border-red-500/20'}`}>
                      {p.outcome}
                    </span>
                  </td>
                  <td className="p-5 font-mono text-right text-zinc-300 font-medium">{parseFloat(p.sharesOwned).toFixed(2)}</td>
                  <td className="p-5 font-mono text-right text-zinc-500 font-medium">{parseFloat(p.avgEntryPrice).toFixed(2)}</td>
                  <td className="p-5 font-mono text-right text-white font-bold">{parseFloat(p.currentValue).toFixed(2)}</td>
                  <td className="p-5 font-mono text-right">
                    <span className={`flex items-center justify-end gap-1 font-bold ${p.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {p.pnl >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {Math.abs(p.pnl).toFixed(2)}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    <Link to={`/markets/${p.marketId}`} className="text-purple-400 hover:text-purple-300 font-bold text-sm tracking-wide">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {positions.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-16 text-center text-zinc-500">
                    <p className="mb-4">No positions yet.</p>
                    <Link to="/markets" className="text-purple-400 hover:text-purple-300 font-bold">Start trading &rarr;</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {positions.length > 0 && (
          <div className="p-6 bg-[#0a0a0f] border-t border-[#ffffff10] flex justify-end items-center gap-4">
            <span className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Total Unrealized P&L:</span>
            <span className={`text-xl font-mono font-black ${totalUnrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalUnrealizedPnL >= 0 ? '+' : ''}{totalUnrealizedPnL.toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
