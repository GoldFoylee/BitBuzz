import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, Coins, Trophy } from 'lucide-react';
import api from '../services/api';

const Landing = () => {
  const [liveMarkets, setLiveMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await api.get('/markets');
        setLiveMarkets(response.data.slice(0, 3));
      } catch (error) {
        // Suppress specific rendering errors natively
      } finally {
        setLoading(false);
      }
    };
    fetchMarkets();
  }, []);

  return (
    <div className="bg-[#0a0a0f] min-h-screen flex flex-col font-sans">
      <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
        <div className="absolute inset-0 animate-gradient-bg opacity-30"></div>
        <div className="z-10 text-center px-4">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl tracking-tighter">
            Predict the Culture.
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 mb-10 max-w-2xl mx-auto font-light">
            Trade on outcomes. Win with your instincts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-8 rounded-full transition-all text-lg shadow-lg shadow-purple-500/30">
              Start Predicting &rarr;
            </Link>
            <Link to="/markets" className="bg-zinc-800/50 hover:bg-zinc-800 text-white border border-zinc-700 font-bold py-4 px-8 rounded-full transition-all text-lg">
              Browse Markets
            </Link>
          </div>
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-1/4 left-10 md:left-32 w-48 h-32 bg-[#12121f] border border-white/10 rounded-xl p-4 opacity-50 transform -rotate-12 animate-pulse hidden md:block">
           <div className="h-3 w-1/2 bg-purple-500 rounded mb-4"></div>
           <div className="flex justify-between"><div className="w-10 h-8 bg-green-500/20 rounded"></div><div className="w-10 h-8 bg-red-500/20 rounded"></div></div>
        </div>
        <div className="absolute bottom-1/4 right-10 md:right-32 w-56 h-36 bg-[#12121f] border border-white/10 rounded-xl p-4 opacity-40 transform rotate-6 animate-bounce hidden md:block" style={{animationDuration: '4s'}}>
           <div className="h-3 w-3/4 bg-cyan-500 rounded mb-4"></div>
           <div className="flex justify-between"><div className="w-12 h-10 bg-green-500/20 rounded"></div><div className="w-12 h-10 bg-red-500/20 rounded"></div></div>
        </div>
      </section>

      <section className="py-24 bg-[#0a0a0f] border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#12121f] border border-white/5 rounded-2xl p-8 hover:border-purple-500/50 transition-colors group">
              <Target size={40} className="text-cyan-400 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-white mb-3">1. Pick a Market</h3>
              <p className="text-zinc-400">Browse pop culture predictions.</p>
            </div>
            <div className="bg-[#12121f] border border-white/5 rounded-2xl p-8 hover:border-purple-500/50 transition-colors group">
              <Coins size={40} className="text-purple-400 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-white mb-3">2. Trade Shares</h3>
              <p className="text-zinc-400">Buy YES or NO with Buzz Credits.</p>
            </div>
            <div className="bg-[#12121f] border border-white/5 rounded-2xl p-8 hover:border-purple-500/50 transition-colors group">
              <Trophy size={40} className="text-green-400 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-white mb-3">3. Collect Winnings</h3>
              <p className="text-zinc-400">Get paid when you are right.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#12121f]/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-4xl font-black text-white">What's Buzzing Right Now</h2>
            <Link to="/markets" className="text-purple-400 hover:text-purple-300 font-bold hidden sm:block">
              See All Markets &rarr;
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              [1,2,3].map(i => (
                <div key={i} className="animate-pulse bg-[#12121f] border border-white/5 h-48 rounded-xl"></div>
              ))
            ) : liveMarkets.map((market) => (
              <div key={market.id} className="bg-[#12121f] border border-white/10 rounded-xl p-6 relative overflow-hidden">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{market.title}</h3>
                <span className="text-xs font-bold text-cyan-400 uppercase">{market.category}</span>
                <div className="absolute bottom-6 right-6 font-mono text-xl text-green-400">
                  {Math.round(market.impliedProbability * 100)}% YES
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/markets" className="text-purple-400 font-bold">See All Markets &rarr;</Link>
          </div>
        </div>
      </section>

      <footer className="py-8 bg-[#0a0a0f] border-t border-white/10 text-center">
        <p className="text-zinc-600 font-medium">BitBuzz &copy; 2025 — Predict Everything</p>
      </footer>
    </div>
  );
};

export default Landing;
