import { Link } from 'react-router-dom';

const MarketCard = ({ market }) => {
  const probPercentage = Math.round(market.impliedProbability * 100);
  
  return (
    <Link to={`/markets/${market.id}`} className="block group">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider bg-zinc-800 px-2 py-1 rounded">{market.category}</span>
          <span className="text-xs text-zinc-500 font-mono">Ends: {new Date(market.closeTime).toLocaleDateString()}</span>
        </div>
        
        <h3 className="text-xl font-medium mb-6 text-zinc-100 group-hover:text-white transition-colors line-clamp-2 leading-snug">
          {market.title}
        </h3>
        
        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm text-zinc-500 mb-1">Implied YES</p>
            <p className="text-3xl font-mono tracking-tighter text-blue-400 font-bold">{probPercentage}%</p>
          </div>
          <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/10">
            Trade Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default MarketCard;
