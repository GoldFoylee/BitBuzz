import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { socket } from '../services/socket';
import TradePanel from '../components/TradePanel';
import { ArrowLeft } from 'lucide-react';

const getCategoryColor = (category) => {
  switch (category) {
    case 'Movies': return 'bg-purple-600';
    case 'Music': return 'bg-pink-600';
    case 'Tech': return 'bg-cyan-600';
    case 'Sports': return 'bg-green-600';
    default: return 'bg-zinc-600';
  }
};

const MarketDetail = () => {
  const { id } = useParams();
  const [market, setMarket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const response = await api.get(`/markets/${id}`);
        setMarket(response.data);
      } catch (error) {
        // Handle silently
      } finally {
        setLoading(false);
      }
    };
    fetchMarket();

    socket.emit('join_market', id);

    const handlePriceUpdate = (updateInfo) => {
      setMarket(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          impliedProbability: updateInfo.impliedProbability,
          pool: {
            ...prev.pool,
            yesShares: updateInfo.newYesShares || prev.pool.yesShares,
            noShares: updateInfo.newNoShares || prev.pool.noShares
          }
        };
      });
    };

    const handleMarketSettled = (settleInfo) => {
      setMarket(prev => {
        if (!prev) return prev;
        return { ...prev, status: 'RESOLVED', outcome: settleInfo.outcome };
      });
    };

    socket.on('PRICE_UPDATE', handlePriceUpdate);
    socket.on('MARKET_SETTLED', handleMarketSettled);

    return () => {
      socket.emit('leave_market', id);
      socket.off('PRICE_UPDATE', handlePriceUpdate);
      socket.off('MARKET_SETTLED', handleMarketSettled);
    };
  }, [id]);

  if (loading) return <div className="py-20 text-center text-zinc-500">Loading market...</div>;
  if (!market) return <div className="py-20 text-center text-red-500">Market not found.</div>;

  const probYes = Math.round(market.impliedProbability * 100);
  const probNo = 100 - probYes;

  return (
    <div className="py-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <Link to="/markets" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 text-sm font-bold uppercase tracking-wider">
        <ArrowLeft size={16} /> Back to Markets
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="mb-8">
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md mb-6 inline-block text-white shadow-lg ${getCategoryColor(market.category)}`}>
              {market.category}
            </span>
            
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
              {market.title}
            </h1>
            
            <p className="text-zinc-500 font-medium">
              Closes: {new Date(market.closeTime).toLocaleDateString()}
            </p>
          </div>

          <div className="bg-[#12121f] border border-[#ffffff10] rounded-2xl p-8 mb-8">
            <div className="flex justify-between items-end mb-4">
              <div className="text-left">
                <p className="text-green-500 text-6xl font-black tracking-tighter mb-1">{probYes}%</p>
                <p className="text-green-500/70 font-bold text-sm tracking-widest uppercase">YES</p>
              </div>
              <div className="text-right">
                <p className="text-red-500 text-6xl font-black tracking-tighter mb-1">{probNo}%</p>
                <p className="text-red-500/70 font-bold text-sm tracking-widest uppercase">NO</p>
              </div>
            </div>
            
            <div className="w-full h-4 rounded-full flex overflow-hidden shadow-inner">
              <div className="bg-green-500 h-full transition-all duration-700 ease-in-out" style={{ width: `${probYes}%` }}></div>
              <div className="bg-red-500 h-full transition-all duration-700 ease-in-out" style={{ width: `${probNo}%` }}></div>
            </div>
          </div>
          
          <div className="bg-[#12121f] border border-[#ffffff10] rounded-2xl p-6">
             <h3 className="text-white font-bold mb-4">Recent Activity</h3>
             <p className="text-zinc-500 text-sm italic">Activity feed populates here...</p>
          </div>
        </div>

        <div className="lg:w-1/3">
          {market.status === 'OPEN' ? (
            <TradePanel market={market} />
          ) : (
            <div className="bg-[#12121f] border border-[#ffffff10] rounded-2xl p-8 text-center shadow-2xl">
              <p className="text-zinc-500 mb-2 font-bold uppercase tracking-wider">Market Resolved</p>
              <p className="text-3xl font-black text-white">Winning Outcome:</p>
              <p className={`text-4xl font-black mt-4 ${market.outcome === 'YES' ? 'text-green-400' : 'text-red-400'}`}>
                {market.outcome}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketDetail;
