import { useState } from 'react';
import api from '../services/api';
import { Minus, Plus, LoaderCircle } from 'lucide-react';

const TradePanel = ({ market }) => {
  const [outcome, setOutcome] = useState('YES');
  const [amount, setAmount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  /**
   * LMSR Cost Calculation (simplified internally for preview purposes)
   * Real cost executes natively inside the processor.
   * cost = b * ln(e^(x/b) + e^(y/b))
   */
  const calculateSimulatedCost = () => {
    const b = 100; // matching backend liquidityConstant
    const yesShares = parseFloat(market.pool?.yesShares || 50);
    const noShares = parseFloat(market.pool?.noShares || 50);
    
    const currentMax = Math.max(yesShares, noShares);
    const currentSum = Math.exp((yesShares - currentMax) / b) + Math.exp((noShares - currentMax) / b);
    const currentCost = b * (currentMax / b + Math.log(currentSum));

    const newYes = outcome === 'YES' ? yesShares + amount : yesShares;
    const newNo = outcome === 'NO' ? noShares + amount : noShares;
    
    const newMax = Math.max(newYes, newNo);
    const newSum = Math.exp((newYes - newMax) / b) + Math.exp((newNo - newMax) / b);
    const newCost = b * (newMax / b + Math.log(newSum));
    
    return newCost - currentCost;
  };

  const calculateImpliedShift = () => {
    const b = 100;
    const currentYesProb = Math.round(market.impliedProbability * 100);
    const probSelector = outcome === 'YES' ? currentYesProb : 100 - currentYesProb;
    
    const yesShares = parseFloat(market.pool?.yesShares || 50);
    const noShares = parseFloat(market.pool?.noShares || 50);
    const newYes = outcome === 'YES' ? yesShares + amount : yesShares;
    const newNo = outcome === 'NO' ? noShares + amount : noShares;
    
    const expYes = Math.exp(newYes / b);
    const expNo = Math.exp(newNo / b);
    const newProbYesRaw = expYes / (expNo + expYes);
    const newProbYes = Math.round(newProbYesRaw * 100);
    
    const shiftResult = outcome === 'YES' ? newProbYes : 100 - newProbYes;
    return `${probSelector}% → ${shiftResult}%`;
  };

  const costRaw = calculateSimulatedCost();

  const handleTrade = async () => {
    if (amount <= 0) return;
    setLoading(true);
    setToast(null);
    try {
      await api.post('/trades', { marketId: market.id, outcome, amount });
      setToast({ type: 'success', text: 'Trade placed! 🎯' });
      setAmount(10);
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      setToast({ type: 'error', text: error.response?.data?.error || 'Trade failed' });
      setTimeout(() => setToast(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#12121f] border border-[#ffffff10] rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-[#ffffff10]">
        <h3 className="text-xl text-white font-black">Place Your Trade</h3>
      </div>
      
      <div className="p-6">
        <div className="flex gap-3 mb-8">
          <button 
            onClick={() => setOutcome('YES')} 
            className={`flex-1 py-4 px-2 rounded-xl font-black text-lg transition-all ${
              outcome === 'YES' 
                ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)] border-2 border-green-400' 
                : 'bg-[#0a0a0f] text-zinc-500 border border-[#ffffff10] hover:text-green-500/70 hover:border-green-500/30'
            }`}
          >YES</button>
          <button 
            onClick={() => setOutcome('NO')} 
            className={`flex-1 py-4 px-2 rounded-xl font-black text-lg transition-all ${
              outcome === 'NO' 
                ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] border-2 border-red-400' 
                : 'bg-[#0a0a0f] text-zinc-500 border border-[#ffffff10] hover:text-red-500/70 hover:border-red-500/30'
            }`}
          >NO</button>
        </div>

        <div className="mb-8">
          <label className="block text-zinc-400 text-xs uppercase tracking-widest font-bold mb-3">Amount (Shares)</label>
          <div className="flex items-center bg-[#0a0a0f] border border-[#ffffff20] rounded-xl overflow-hidden focus-within:border-purple-500 transition-colors">
            <button 
              onClick={() => setAmount(Math.max(1, amount - 1))}
              className="p-4 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Minus size={20} />
            </button>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(Number(e.target.value))} 
              className="w-full bg-transparent text-white text-center font-mono text-2xl font-bold focus:outline-none"
              min="1"
            />
            <button 
              onClick={() => setAmount(amount + 1)}
              className="p-4 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-400 font-medium tracking-wide">Cost</span>
            <span className="text-white font-mono font-bold tracking-tight">{isNaN(costRaw) ? '0.00' : costRaw.toFixed(2)} Bz</span>
          </div>
          <div className="flex justify-between items-center text-sm">
             <span className="text-zinc-400 font-medium tracking-wide">Implied Shift ({outcome})</span>
             <span className="text-purple-400 font-mono font-bold tracking-tight">{calculateImpliedShift()}</span>
          </div>
        </div>

        <button 
          onClick={handleTrade} 
          disabled={loading || amount <= 0}
          className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-black tracking-wide py-4 px-6 rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2 transform active:scale-[0.98]"
        >
          {loading ? <><LoaderCircle className="animate-spin" size={20}/> Executing</> : 'Confirm Trade'}
        </button>

        {toast && (
          <div className={`mt-6 p-4 rounded-xl text-center text-sm font-bold border animate-in slide-in-from-bottom-2 ${
            toast.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-red-500/10 border-red-500/50 text-red-400'
          }`}>
            {toast.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default TradePanel;
