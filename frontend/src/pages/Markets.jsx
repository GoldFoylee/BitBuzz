import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const getCategoryColor = (category) => {
  switch (category) {
    case 'Movies': return 'bg-purple-600 text-white';
    case 'Music': return 'bg-pink-600 text-white';
    case 'Tech': return 'bg-cyan-600 text-white';
    case 'Sports': return 'bg-green-600 text-white';
    default: return 'bg-zinc-600 text-white';
  }
};

const getGlowClass = (category) => {
  switch (category) {
    case 'Movies': return 'group-hover:glow-movies group-hover:border-purple-500/50';
    case 'Music': return 'group-hover:glow-music group-hover:border-pink-500/50';
    case 'Tech': return 'group-hover:glow-tech group-hover:border-cyan-500/50';
    case 'Sports': return 'group-hover:glow-sports group-hover:border-green-500/50';
    default: return '';
  }
};

const Markets = () => {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await api.get('/markets');
        setMarkets(response.data);
      } catch (error) {
        // Handle silently
      } finally {
        setLoading(false);
      }
    };
    fetchMarkets();
  }, []);

  const filteredMarkets = filter === 'All' ? markets : markets.filter(m => m.category === filter);

  if (loading) return <div className="py-20 text-center text-zinc-500">Loading markets...</div>;

  return (
    <div className="py-8 animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-4xl text-white font-black tracking-tight mb-6">Markets</h1>
        
        <div className="flex flex-wrap gap-2">
          {['All', 'Movies', 'Music', 'Tech', 'Sports'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
                filter === cat 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20 border border-purple-500' 
                  : 'bg-[#12121f] text-zinc-400 border border-[#ffffff15] hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredMarkets.length === 0 ? (
        <div className="text-zinc-600 text-center py-20 border border-dashed border-[#ffffff15] rounded-2xl bg-[#12121f]">
          No markets available for this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMarkets.map(market => {
            const probYes = Math.round(market.impliedProbability * 100);
            const probNo = 100 - probYes;
            
            return (
              <Link to={`/markets/${market.id}`} key={market.id} className="block group transition-transform duration-300 hover:-translate-y-1">
                <div className={`bg-[#12121f] border border-[#ffffff15] rounded-xl p-6 h-full flex flex-col justify-between transition-all duration-300 ${getGlowClass(market.category)}`}>
                  
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md mb-4 inline-block ${getCategoryColor(market.category)}`}>
                      {market.category}
                    </span>
                    
                    <h3 className="text-lg font-semibold mb-6 text-white line-clamp-2 leading-snug">
                      {market.title}
                    </h3>
                  </div>
                  
                  <div>
                    <div className="w-full h-2 rounded-full flex overflow-hidden mb-2">
                      <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${probYes}%` }}></div>
                      <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${probNo}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs font-bold font-mono mb-6">
                      <span className="text-green-500">{probYes}% YES</span>
                      <span className="text-red-500">{probNo}% NO</span>
                    </div>
                    
                    <div className="flex justify-between items-end border-t border-[#ffffff10] pt-4">
                      <span className="text-xs text-zinc-500 font-medium">Ends: {new Date(market.closeTime).toLocaleDateString()}</span>
                      <span className="text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Trade Now &rarr;</span>
                    </div>
                  </div>
                  
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Markets;
