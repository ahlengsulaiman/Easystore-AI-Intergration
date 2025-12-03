import React, { useState } from 'react';
import { Product } from '../types';
import { Package, Sparkles, Tag, ChevronRight, X } from 'lucide-react';
import { generateProductDescription } from '../services/geminiService';

interface ProductListProps {
  products: Product[];
}

export const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<any | null>(null);

  const handleGenerate = async (product: Product) => {
    setIsGenerating(true);
    setAiResult(null);
    try {
      const result = await generateProductDescription(
        product.title,
        `${product.product_type}, ${product.tags}`,
        'enthusiastic'
      );
      setAiResult(result);
    } catch (e) {
      console.error(e);
      alert("Failed to generate description. Please check your AI quota.");
    } finally {
      setIsGenerating(false);
    }
  };

  const closeOverlay = () => {
    setSelectedProduct(null);
    setAiResult(null);
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Products</h2>
          <p className="text-slate-500">Manage and enhance your catalog</p>
        </div>
        <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">
          Sync Products
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Inventory</th>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.images[0] ? (
                        <img 
                          src={product.images[0].src} 
                          alt={product.title} 
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Package className="w-5 h-5 text-slate-400" />
                        </div>
                      )}
                      <span className="font-medium text-slate-900">{product.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {product.variants.reduce((acc, v) => acc + v.inventory_quantity, 0)} in stock
                  </td>
                  <td className="px-6 py-4">{product.vendor}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setSelectedProduct(product)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-xs flex items-center gap-1"
                    >
                      Enhance <Sparkles className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Enhancement Overlay */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900">AI Product Assistant</h3>
              <button onClick={closeOverlay} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex gap-4">
                  {selectedProduct.images[0] && (
                    <img 
                      src={selectedProduct.images[0].src} 
                      alt={selectedProduct.title} 
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900">{selectedProduct.title}</h4>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2" dangerouslySetInnerHTML={{ __html: selectedProduct.body_html }} />
                  </div>
                </div>
              </div>

              {!aiResult ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Enhance Content</h4>
                  <p className="text-sm text-slate-500 mb-6">
                    Use Gemini AI to generate SEO-optimized titles, persuasive descriptions, and relevant tags.
                  </p>
                  <button
                    onClick={() => handleGenerate(selectedProduct)}
                    disabled={isGenerating}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating Magic...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate with Gemini
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Suggested Title
                    </label>
                    <div className="p-3 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium">
                      {aiResult.title}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Description HTML
                    </label>
                    <div className="p-4 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: aiResult.description }} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      SEO Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {aiResult.tags.split(',').map((tag: string, i: number) => (
                        <span key={i} className="flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                          <Tag className="w-3 h-3" />
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setAiResult(null)} className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50">
                      Discard
                    </button>
                    <button className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                      Apply Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};