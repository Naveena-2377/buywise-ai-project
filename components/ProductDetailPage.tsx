
import React, { useEffect } from 'react';
import { ProductListing } from '../types';

interface ProductDetailPageProps {
  product: ProductListing;
  onClose: () => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onClose }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product.id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const merchantLower = product.merchant.toLowerCase();
  const isFlipkart = merchantLower.includes('flipkart');
  const isAmazon = merchantLower.includes('amazon');

  // Dynamic branding colors
  const brandColor = isFlipkart ? 'bg-[#2874f0]' : isAmazon ? 'bg-[#ff9900]' : 'bg-indigo-600';
  const brandHoverColor = isFlipkart ? 'hover:bg-[#1261e0]' : isAmazon ? 'hover:bg-[#e68a00]' : 'hover:bg-indigo-700';
  const brandTextColor = isFlipkart ? 'text-[#2874f0]' : isAmazon ? 'text-[#ff9900]' : 'text-indigo-600';
  const brandBgLight = isFlipkart ? 'bg-[#f0f5ff]' : isAmazon ? 'bg-[#fff9f0]' : 'bg-indigo-50';

  const sentimentVal = Math.round(product.sentimentScore || 0);
  const popularityVal = Math.round(product.popularityIndex || 0);
  const trustVal = Math.round(product.sellerTrustScore || 75);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors uppercase tracking-widest text-xs"
          >
            <i className="fas fa-arrow-left"></i>
            Back to Results
          </button>
          <div className="flex items-center gap-3">
             <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${brandBgLight} ${brandTextColor}`}>
               Verified {product.merchant} Listing
             </div>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
          <div className="md:w-5/12 bg-slate-50 p-8 md:p-16 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-slate-100">
            <div className="w-full aspect-square bg-white rounded-[2.5rem] shadow-inner mb-10 flex items-center justify-center overflow-hidden border border-slate-200 relative group">
                <i className={`fas ${isFlipkart ? 'fa-bolt' : isAmazon ? 'fa-shopping-basket' : 'fa-box-open'} text-9xl text-slate-100 group-hover:scale-110 transition-transform duration-500`}></i>
                {isFlipkart && <div className="absolute top-6 right-6 bg-[#fb641b] text-white p-2 rounded-lg font-black text-[10px] shadow-lg">FLIPKART CHOICE</div>}
            </div>
            
            <div className="text-center w-full">
              <h3 className="text-2xl font-black text-slate-900 mb-2">{product.merchant} Marketplace</h3>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6">Seller Identity: <span className="text-slate-700">{product.sellerName}</span></p>
              <div className="text-5xl font-black text-slate-900 tracking-tighter mb-2">{formatCurrency(product.price)}</div>
              <div className="text-lg text-slate-400 line-through font-bold mb-8">{formatCurrency(product.originalPrice)}</div>
              
              <a 
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex w-full ${brandColor} ${brandHoverColor} text-white py-6 px-10 rounded-[1.5rem] font-black text-sm tracking-widest uppercase transition-all shadow-xl items-center justify-center gap-4 active:scale-95`}
              >
                VISIT {product.merchant.toUpperCase()}
                <i className="fas fa-external-link-alt"></i>
              </a>
            </div>
          </div>

          <div className="md:w-7/12 p-8 md:p-16 bg-white">
            <div className="mb-12">
              <div className={`inline-block px-4 py-1.5 ${brandBgLight} ${brandTextColor} rounded-full text-[10px] font-black uppercase tracking-widest mb-4`}>
                AI Insights Engine
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-4 leading-tight">Product Analysis Report</h2>
              <p className="text-slate-500 text-lg leading-relaxed font-medium">
                Our deep-learning models analyzed <span className={brandTextColor + " font-black"}>{product.merchant}</span> customer data to provide these trust signals.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 group hover:border-indigo-200 transition-colors">
                  <p className="text-slate-400 text-[10px] uppercase font-black mb-2 flex items-center gap-2">
                    <i className="fas fa-smile text-indigo-400"></i> Sentiment Analysis
                  </p>
                  <p className={`text-5xl font-black ${brandTextColor}`}>{sentimentVal}%</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tight">User Satisfaction</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 group hover:border-slate-200 transition-colors">
                  <p className="text-slate-400 text-[10px] uppercase font-black mb-2 flex items-center gap-2">
                    <i className="fas fa-chart-line text-slate-400"></i> Popularity
                  </p>
                  <p className="text-5xl font-black text-slate-700">{popularityVal}%</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tight">Market Momentum</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${brandBgLight} rounded-xl flex items-center justify-center`}>
                    <i className={`fas fa-shield-alt ${brandTextColor}`}></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Seller Trust Score</p>
                    <p className="text-lg font-black text-slate-800">{trustVal}/100</p>
                  </div>
                </div>
                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full ${brandColor}`} style={{ width: `${trustVal}%` }}></div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                <div className={`w-12 h-12 ${brandBgLight} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <i className={`fas fa-shipping-fast ${brandTextColor}`}></i>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Logistics & Trends</p>
                  <p className="text-sm text-slate-600 leading-relaxed font-bold">
                    Price is currently <span className={brandTextColor}>{product.priceStability}</span> with an estimated delivery window of <span className="text-slate-900">{product.deliveryTime}</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
