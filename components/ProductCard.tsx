
import React from 'react';
import { ProductListing } from '../types';

interface ProductCardProps {
  listing: ProductListing;
  onViewDetails: (listing: ProductListing) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ listing, onViewDetails }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const sentimentScore = Math.round(listing.sentimentScore || 0);
  const popularityScore = Math.round(listing.popularityIndex || 0);

  return (
    <div className={`relative bg-white rounded-[2.5rem] p-8 shadow-sm border-2 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between ${listing.isWinner ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-slate-100'}`}>
      {listing.isWinner && (
        <div className="absolute -top-3 left-8 bg-indigo-600 text-white text-[10px] tracking-widest font-black px-5 py-2 rounded-full shadow-xl flex items-center gap-2 z-10">
          <i className="fas fa-crown text-[8px]"></i> TOP RECOMMENDATION
        </div>
      )}

      <div>
        <div className="flex justify-between items-start mb-8 mt-2">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
               <i className={`fas ${listing.merchant.toLowerCase().includes('amazon') ? 'fa-shopping-basket' : listing.merchant.toLowerCase().includes('flipkart') ? 'fa-bolt' : 'fa-shopping-cart'} text-indigo-500 text-2xl`}></i>
            </div>
            <div className="text-left">
              <h3 className="font-black text-slate-900 leading-none text-lg flex items-center gap-2">
                {listing.merchant}
                {listing.isOfficial && <i className="fas fa-check-circle text-blue-500 text-[10px]"></i>}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 font-medium">Seller: <span className="font-black text-slate-700">{listing.sellerName}</span></p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-slate-900 tracking-tighter">{formatCurrency(listing.price)}</div>
            <div className="text-[11px] text-slate-400 line-through font-bold">{formatCurrency(listing.originalPrice)}</div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 text-center">
            <p className="text-[9px] font-black text-indigo-400 uppercase mb-1">Sentiment Analysis</p>
            <p className="text-2xl font-black text-indigo-600">{sentimentScore}%</p>
          </div>
          <div className="flex-1 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Popularity Score</p>
            <p className="text-2xl font-black text-slate-700">{popularityScore}%</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button 
          onClick={() => onViewDetails(listing)}
          className="w-full py-4 px-6 rounded-2xl font-black text-[10px] tracking-widest transition-all bg-slate-100 text-slate-600 hover:bg-slate-200 uppercase"
        >
          View Analysis
        </button>
        <a 
          href={listing.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-5 px-6 rounded-2xl font-black text-xs tracking-widest transition-all flex items-center justify-center gap-3 bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-200"
        >
          <i className="fas fa-shopping-bag"></i>
          BUY ON {listing.merchant.toUpperCase()}
        </a>
      </div>
    </div>
  );
};

export default ProductCard;
