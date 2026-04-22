import { useEffect, useState } from 'react';
import api from '../services/api';
import { Trophy, RefreshCcw } from 'lucide-react';

const Leaderboard = ({ user }) => {
  const [traders, setTraders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await api.get('/leaderboard');
      setTraders(response.data);
    } catch (error) {
      // Handle silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  if (loading && traders.length === 0) return <div className="py-20 text-center text-zinc-500">Loading leaderboard...</div>;

  const getPodiumGlow = (index) => {
    if (index === 0) return 'shadow-[0_0_30px_rgba(250,204,21,0.2)] border-yellow-500/50 scale-105 z-10 bg-gradient-to-b from-[#12121f] to-yellow-900/20';
    if (index === 1) return 'shadow-[0_0_20px_rgba(161,161,170,0.1)] border-zinc-400/50 bg-gradient-to-b from-[#12121f] to-zinc-800/30';
    if (index === 2) return 'shadow-[0_0_20px_rgba(180,83,9,0.1)] border-amber-600/50 bg-gradient-to-b from-[#12121f] to-amber-900/20';
    return '';
  };

  const getTrophyColor = (index) => {
    if (index === 0) return 'text-yellow-400';
    if (index === 1) return 'text-zinc-300';
    if (index === 2) return 'text-amber-600';
    return '';
  };

  return (
    <div className="py-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">Top <span className="font-light text-zinc-500">Predictors</span></h1>
        </div>
        <button onClick={fetchLeaderboard} className="text-zinc-400 hover:text-white transition-colors bg-[#12121f] p-3 rounded-full border border-[#ffffff15] hover:border-purple-500">
           <RefreshCcw size={20} className={loading ? "animate-spin text-purple-400" : ""} />
        </button>
      </div>

      {/* Podium for top 3 */}
      {traders.length >= 3 && (
        <div className="flex flex-col md:flex-row justify-center items-end gap-4 mb-16 px-4">
          {[1, 0, 2].map((slotIndex) => {
            const trader = traders[slotIndex];
            if (!trader) return null;
            return (
              <div key={trader.id} className={`flex-1 rounded-2xl p-6 border text-center transition-all ${getPodiumGlow(slotIndex)} relative overflow-hidden`}>
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <Trophy size={slotIndex === 0 ? 48 : 32} className={`mx-auto mb-4 drop-shadow-xl ${getTrophyColor(slotIndex)}`} />
                <h3 className="text-xl font-bold text-white mb-1 tracking-tight">{trader.username}</h3>
                <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Rank {slotIndex + 1}</p>
                <p className="font-mono text-2xl font-black text-purple-400">{trader.totalValue.toFixed(2)} <span className="text-sm text-zinc-500">Bz</span></p>
              </div>
            );
          })}
        </div>
      )}

      {/* Ranked table for the rest */}
      <div className="bg-[#12121f] border border-[#ffffff15] rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-[#0a0a0f] border-b border-[#ffffff10]">
            <tr>
              <th className="p-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Rank</th>
              <th className="p-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Username</th>
              <th className="p-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Portfolio Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ffffff0a]">
            {traders.slice(3).map((trader, i) => {
              const isCurrentUser = user && trader.id === user.id;
              const rank = i + 4;
              return (
                <tr key={trader.id} className={`${isCurrentUser ? 'bg-purple-900/20 border-l-4 border-l-purple-500' : 'hover:bg-white/[0.02]'} transition-colors`}>
                  <td className="p-5">
                    <span className="text-zinc-500 font-bold font-mono text-lg pl-2">#{rank}</span>
                  </td>
                  <td className="p-5">
                    <span className={`font-bold text-lg ${isCurrentUser ? 'text-purple-400' : 'text-white'}`}>{trader.username}</span>
                  </td>
                  <td className="p-5 text-right font-mono text-white text-lg font-medium">
                    {trader.totalValue.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
