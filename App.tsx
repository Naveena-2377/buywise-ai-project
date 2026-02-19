
import React, { useState, useEffect } from 'react';
import Logo from './components/Logo';
import ProductCard from './components/ProductCard';
import ProductDetailPage from './components/ProductDetailPage';
import { analyzeProductSearch } from './services/geminiService';
import { ProductListing, AnalysisSummary } from './types';

const platforms = ['All', 'Amazon', 'Flipkart', 'Reliance Digital', 'Croma', 'Tata CLiQ'];

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [platform, setPlatform] = useState('All');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<ProductListing[] | null>(null);
  const [summary, setSummary] = useState<AnalysisSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductListing | null>(null);

  useEffect(() => {
    const cachedData = sessionStorage.getItem('last_search_results');
    const cachedSummary = sessionStorage.getItem('last_search_summary');
    if (cachedData && cachedSummary) {
      try {
        setResults(JSON.parse(cachedData));
        setSummary(JSON.parse(cachedSummary));
      } catch (e) {
        sessionStorage.clear();
      }
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
      setError("Please enter a product name to find the best deals.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResults(null);
    setSummary(null);
    setSelectedProduct(null);
    
    try {
      const { listings, summary: analysisSummary } = await analyzeProductSearch(trimmed, platform);
      
      setResults(listings);
      setSummary(analysisSummary);
      
      sessionStorage.setItem('last_search_results', JSON.stringify(listings));
      sessionStorage.setItem('last_search_summary', JSON.stringify(analysisSummary));
    } catch (err: any) {
      setError(err.message || "We couldn't analyze the deals right now. Try a different search.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getUniversalSearchUrl = () => {
    return `https://www.google.com/search?q=${encodeURIComponent(query)}+price+in+india&tbm=shop`;
  };

  if (selectedProduct) {
    return <ProductDetailPage product={selectedProduct} onClose={() => setSelectedProduct(null)} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-screen">
      <header className="flex justify-center items-center mb-12">
        <Logo size="md" />
      </header>

      <div className="text-center mb-16 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-3/4 bg-indigo-50 rounded-full blur-[120px] -z-10 opacity-60"></div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
          Find the <span className="text-indigo-600">Best Seller</span><br />
          Across Indian Stores.
        </h1>
        <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto font-medium">
          BuyWise AI scans the entire market to bring you the most trusted sellers and the most relevant products correctly.
        </p>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSearch} className="bg-slate-900 p-2 rounded-[2rem] shadow-2xl border border-slate-800 flex flex-col md:flex-row gap-2 relative z-20">
            <div className="flex-1 relative flex items-center">
              <div className="absolute left-6 text-slate-500">
                <i className="fas fa-search"></i>
              </div>
              <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for any product..."
                className="w-full pl-14 pr-6 py-5 rounded-2xl border-none outline-none bg-transparent text-white placeholder:text-slate-500 font-bold"
              />
            </div>
            
            <div className="relative px-4 flex items-center border-l border-slate-800">
              <select 
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="appearance-none bg-transparent py-4 px-6 pr-10 font-black text-slate-300 outline-none cursor-pointer text-xs tracking-widest uppercase border-none ring-0"
              >
                {platforms.map(p => <option key={p} value={p} className="bg-slate-900 text-white">{p}</option>)}
              </select>
              <div className="absolute right-6 pointer-events-none text-slate-500">
                <i className="fas fa-chevron-down text-[10px]"></i>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isAnalyzing}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-[1.5rem] font-black text-xs tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
            >
              {isAnalyzing ? "ANALYZING..." : "FIND DEALS"}
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div className="mb-12 max-w-xl mx-auto p-5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800 text-sm font-bold flex items-center gap-3">
          <i className="fas fa-circle-info"></i>
          {error}
        </div>
      )}

      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center py-20">
           <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
           <p className="text-slate-400 font-black tracking-widest text-[10px] uppercase">BuyWise AI Scanning All Marketplaces...</p>
        </div>
      )}

      {summary && results && !isAnalyzing && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 pb-20">
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
            <h2 className="text-3xl font-black mb-4">Results for <span className="text-indigo-400">"{summary.productName}"</span></h2>
            <p className="text-slate-400 font-medium mb-0">{summary.aiVerdict}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((listing) => (
              <ProductCard 
                key={listing.id} 
                listing={listing}
                onViewDetails={(prod) => setSelectedProduct(prod)}
              />
            ))}
          </div>

          <div className="flex flex-col items-center pt-8 border-t border-slate-200">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Want to see even more?</p>
            <a 
              href={getUniversalSearchUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-white border-2 border-slate-200 rounded-2xl text-slate-600 font-black text-xs tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center gap-3 active:scale-95"
            >
              <i className="fab fa-google"></i>
              SEARCH ALL PRODUCTS IN INDIA
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
