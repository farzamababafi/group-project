'use client';

import * as React from 'react';
import { Check, Plus, TrendingUp, Star } from "lucide-react";

interface Stock {
  id: string;
  symbol: string;
  name: string;
}

const topStocks: Stock[] = [
  { id: '1', symbol: 'AAPL', name: 'Apple Inc.' },
  { id: '2', symbol: 'MSFT', name: 'Microsoft Corporation' },
  { id: '3', symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { id: '4', symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { id: '5', symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { id: '6', symbol: 'TSLA', name: 'Tesla Inc.' },
  { id: '7', symbol: 'META', name: 'Meta Platforms Inc.' },
];

interface TopStocksSelectorProps {
  selectedStocks?: string[];
  onSelect?: (stockIds: string[]) => void;
}

export function TopStocksSelector({ selectedStocks = [], onSelect }: TopStocksSelectorProps) {
  const [internalSelected, setInternalSelected] = React.useState<string[]>([]);
  
  // Use external state if provided, otherwise use internal
  const currentSelection = selectedStocks.length > 0 || onSelect ? selectedStocks : internalSelected;

  const toggleStock = (stockId: string) => {
    const newSelection = currentSelection.includes(stockId) 
      ? currentSelection.filter(id => id !== stockId)
      : [...currentSelection, stockId];
    
    // Update parent if callback provided
    if (onSelect) {
      onSelect(newSelection);
    } else {
      setInternalSelected(newSelection);
    }
  };

  const selectAll = () => {
    const allIds = topStocks.map(s => s.id);
    if (onSelect) {
      onSelect(allIds);
    } else {
      setInternalSelected(allIds);
    }
  };

  const clearSelection = () => {
    if (onSelect) {
      onSelect([]);
    } else {
      setInternalSelected([]);
    }
  };

  const isSelected = (stockId: string) => currentSelection.includes(stockId);

  return (
    <div className="w-full">
      {/* Header Section with Actions */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 
            className="text-2xl font-semibold mb-2"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              color: 'rgb(28, 28, 30)',
              letterSpacing: '-0.02em'
            }}
          >
            Select Stocks to Analyze
          </h2>
          <div className="flex items-center gap-2">
            <p 
              className="text-sm"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                color: 'rgb(142, 142, 147)'
              }}
            >
              Click to select • {currentSelection.length} of {topStocks.length} selected
            </p>
            {currentSelection.length > 0 && (
              <div
                className="px-2 py-1 rounded-[8px] text-xs font-bold"
                style={{
                  background: 'rgba(0, 122, 255, 0.12)',
                  color: 'rgb(0, 122, 255)',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                }}
              >
                {currentSelection.length === 1 ? 'Single' : 'Multiple'}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            disabled={currentSelection.length === topStocks.length}
            className="px-4 py-2 rounded-[12px] text-sm font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'rgba(0, 122, 255, 0.1)',
              color: 'rgb(0, 122, 255)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              border: '1.5px solid rgba(0, 122, 255, 0.2)',
            }}
          >
            <Star size={14} style={{ display: 'inline', marginRight: '6px' }} />
            Select All
          </button>
        </div>
      </div>

      {/* Instruction Card */}
      <div 
        className="mb-4 p-4 rounded-[16px] flex items-start gap-3"
        style={{
          background: 'rgba(0, 122, 255, 0.05)',
          border: '1.5px solid rgba(0, 122, 255, 0.15)',
        }}
      >
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{
            background: 'rgba(0, 122, 255, 0.15)',
          }}
        >
          <TrendingUp size={16} color="rgb(0, 122, 255)" />
        </div>
        <div>
          <p 
            className="text-sm font-semibold mb-1"
            style={{
              color: 'rgb(0, 122, 255)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            }}
          >
            How to select stocks
          </p>
          <p 
            className="text-xs leading-relaxed"
            style={{
              color: 'rgb(142, 142, 147)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            }}
          >
            Click on any stock card to select or deselect. You can choose one stock for focused analysis or multiple stocks to compare their performance side by side.
          </p>
        </div>
      </div>

      {/* Stocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
        {topStocks.map((stock) => {
          const selected = isSelected(stock.id);

          return (
            <button
              key={stock.id}
              onClick={() => toggleStock(stock.id)}
              className="relative overflow-hidden group transition-all duration-400 text-left w-full"
              style={{
                background: selected
                  ? 'linear-gradient(135deg, rgba(0, 122, 255, 0.15) 0%, rgba(0, 122, 255, 0.08) 100%)'
                  : 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(30px) saturate(180%)',
                WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                borderRadius: '20px',
                border: selected
                  ? '2.5px solid rgb(0, 122, 255)'
                  : '1.5px solid rgba(0, 0, 0, 0.06)',
                boxShadow: selected
                  ? '0 10px 40px rgba(0, 122, 255, 0.25), inset 0 1px 0 rgba(255,255,255,0.95)'
                  : '0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.95)',
                padding: '20px',
                transform: selected ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
              }}
            >
              {/* Gradient overlay on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 50% 0%, rgba(0, 122, 255, 0.12) 0%, transparent 70%)'
                }}
              />

              {/* Top indicator line */}
              {selected && (
                <div 
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-[20px]"
                  style={{
                    background: 'linear-gradient(90deg, rgb(0, 122, 255) 0%, rgb(10, 132, 255) 100%)',
                  }}
                />
              )}

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Logo placeholder */}
                  <div 
                    className="w-12 h-12 rounded-[16px] flex items-center justify-center text-lg font-bold transition-all duration-300 shadow-lg"
                    style={{
                      background: selected
                        ? 'linear-gradient(135deg, rgb(0, 122, 255) 0%, rgb(10, 132, 255) 100%)'
                        : 'linear-gradient(135deg, rgba(0, 122, 255, 0.15) 0%, rgba(0, 122, 255, 0.08) 100%)',
                      color: selected ? 'white' : 'rgb(0, 122, 255)',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                    }}
                  >
                    {stock.symbol.charAt(0)}
                  </div>

                  {/* Stock info */}
                  <div>
                    <div 
                      className="text-base font-semibold transition-colors duration-300 mb-1"
                      style={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                        color: selected ? 'rgb(0, 122, 255)' : 'rgb(28, 28, 30)',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      {stock.symbol}
                    </div>
                    <div 
                      className="text-xs line-clamp-1"
                      style={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                        color: 'rgb(142, 142, 147)'
                      }}
                    >
                      {stock.name}
                    </div>
                  </div>
                </div>

                {/* Selection indicator */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0"
                  style={{
                    background: selected ? 'rgb(0, 122, 255)' : 'rgba(0, 0, 0, 0.06)',
                    boxShadow: selected ? '0 4px 12px rgba(0, 122, 255, 0.4)' : 'none',
                  }}
                >
                  {selected ? (
                    <Check size={18} color="white" strokeWidth={3} />
                  ) : (
                    <Plus size={18} style={{ color: 'rgb(142, 142, 147)' }} strokeWidth={2.5} />
                  )}
                </div>
              </div>

              {/* Selection border glow */}
              {selected && (
                <div 
                  className="absolute inset-0 rounded-[20px] pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.08) 0%, transparent 100%)',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex gap-3 flex-wrap">
        <button
          onClick={clearSelection}
          disabled={currentSelection.length === 0}
          className="px-6 py-3 rounded-[16px] font-semibold text-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-opacity-80 active:scale-[0.98]"
          style={{
            background: 'rgba(255, 59, 48, 0.1)',
            color: 'rgb(255, 59, 48)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            border: '1.5px solid rgba(255, 59, 48, 0.2)',
          }}
        >
          Clear All ({currentSelection.length})
        </button>
      </div>

      {/* Selected Stocks Summary */}
      {currentSelection.length > 0 && (
        <div 
          className="mt-6 p-5 rounded-[20px]"
          style={{
            background: 'linear-gradient(135deg, rgba(52, 199, 89, 0.08) 0%, rgba(52, 199, 89, 0.03) 100%)',
            border: '2px solid rgba(52, 199, 89, 0.3)',
          }}
        >
          <div className="flex items-start gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgb(52, 199, 89)',
                boxShadow: '0 4px 12px rgba(52, 199, 89, 0.3)',
              }}
            >
              <Check size={20} color="white" strokeWidth={3} />
            </div>
            <div className="flex-1">
              <p 
                className="text-base font-semibold mb-2"
                style={{
                  color: 'rgb(52, 199, 89)',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                }}
              >
                {currentSelection.length} Stock{currentSelection.length > 1 ? 's' : ''} Selected
              </p>
              <div className="flex flex-wrap gap-2">
                {currentSelection.map(id => {
                  const stock = topStocks.find(s => s.id === id);
                  if (!stock) return null;
                  return (
                    <div
                      key={id}
                      className="px-3 py-1.5 rounded-[10px] flex items-center gap-2"
                      style={{
                        background: 'rgba(0, 122, 255, 0.12)',
                        border: '1px solid rgba(0, 122, 255, 0.2)',
                      }}
                    >
                      <span
                        className="text-xs font-bold"
                        style={{
                          color: 'rgb(0, 122, 255)',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                        }}
                      >
                        {stock.symbol}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
