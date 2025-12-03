import React, { useState } from 'react';
import { Order, Customer } from '../types';
import { analyzeStorePerformance } from '../services/geminiService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, ShoppingBag, Users, BrainCircuit, ArrowRight, Sparkles } from 'lucide-react';

interface DashboardProps {
  orders: Order[];
  customers: Customer[];
}

export const Dashboard: React.FC<DashboardProps> = ({ orders, customers }) => {
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Quick stats calculation
  const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);
  
  // Prepare chart data
  const chartData = orders.map(order => ({
    name: new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    amount: parseFloat(order.total_price)
  })).reverse();

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeStorePerformance(orders, customers);
      setAnalysis(result);
    } catch (e) {
      console.error(e);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Store Overview</h1>
          <p className="text-slate-500">Real-time metrics and AI insights</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live Connected
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-green-600 flex items-center">
              +12.5% <TrendingUp className="w-3 h-3 ml-1" />
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Total Revenue</h3>
          <p className="text-2xl font-bold text-slate-900">${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs font-semibold text-slate-400">Last 50 orders</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Orders Fetched</h3>
          <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-xs font-semibold text-slate-400">Total base</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Customers</h3>
          <p className="text-2xl font-bold text-slate-900">{customers.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Sales Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#1e293b' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights Card */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl p-6 text-white relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <BrainCircuit className="w-32 h-32" />
          </div>
          
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-indigo-300" />
              <h3 className="font-bold text-lg">Gemini Intelligence</h3>
            </div>
            
            {!analysis ? (
              <div className="flex flex-col h-full justify-between">
                <p className="text-indigo-200 text-sm leading-relaxed mb-6">
                  Unlock hidden patterns in your store data. Let Gemini analyze your orders and customer behavior to identify growth opportunities.
                </p>
                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full py-3 bg-white text-indigo-900 rounded-lg font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <div className="w-4 h-4 border-2 border-indigo-900/30 border-t-indigo-900 rounded-full animate-spin" />
                  ) : (
                    <>Analyze Store Data <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            ) : (
              <div className="animate-in fade-in duration-500">
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-indigo-300 uppercase mb-1">Summary</h4>
                  <p className="text-sm line-clamp-4">{analysis.summary}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-indigo-300 uppercase mb-2">Recommendations</h4>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1 shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
                <button 
                  onClick={() => setAnalysis(null)}
                  className="mt-6 text-xs text-indigo-300 hover:text-white underline"
                >
                  Clear Analysis
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};