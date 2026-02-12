'use client';

import * as React from 'react';
import { AlertTriangle } from "lucide-react";

interface Crisis {
  id: string;
  name: string;
  year: string;
  color: string;
  description: string;
}

const crises: Crisis[] = [
  {
    id: 'covid',
    name: 'COVID-19 Pandemic',
    year: '2020',
    color: 'rgb(255, 59, 48)',
    description: 'Global market shock from pandemic'
  },
  {
    id: 'financial',
    name: 'Financial Crisis',
    year: '2008',
    color: 'rgb(255, 149, 0)',
    description: 'Subprime mortgage collapse'
  },
  {
    id: 'dotcom',
    name: 'Dot-com Bubble',
    year: '2000',
    color: 'rgb(88, 86, 214)',
    description: 'Internet speculation burst'
  }
];

interface CrisisSelectorProps {
  selectedCrisis?: string | null;
  onSelect?: (crisisId: string) => void;
}

export function CrisisSelector({ selectedCrisis, onSelect }: CrisisSelectorProps) {
  // Find the selected crisis object or default to first one
  const getSelectedCrisis = () => {
    if (selectedCrisis) {
      return crises.find(c => c.id === selectedCrisis) || crises[0];
    }
    return crises[0];
  };

  const selectedCrisisObj = getSelectedCrisis();

  const handleCrisisClick = (crisis: Crisis) => {
    // Call parent handler if provided
    if (onSelect) {
      onSelect(crisis.id);
    }
  };

  return (
    <div className="w-full">
      {/* Title Section */}
      <div className="mb-6">
        <h2 
          className="text-2xl font-semibold mb-2"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            color: 'rgb(28, 28, 30)',
            letterSpacing: '-0.02em'
          }}
        >
          Select Crisis Period
        </h2>
        <p 
          className="text-sm"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            color: 'rgb(142, 142, 147)'
          }}
        >
          Analyze market behavior during historical financial crises
        </p>
      </div>

      {/* Crisis Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {crises.map((crisis) => {
          const isSelected = selectedCrisisObj.id === crisis.id;
          
          return (
            <button
              key={crisis.id}
              onClick={() => handleCrisisClick(crisis)}
              className="relative overflow-hidden group transition-all duration-500 ease-out w-full"
              style={{
                background: isSelected
                  ? `linear-gradient(135deg, ${crisis.color}15 0%, ${crisis.color}08 100%)`
                  : 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(30px) saturate(180%)',
                WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                borderRadius: '24px',
                border: isSelected
                  ? `2.5px solid ${crisis.color}`
                  : '1.5px solid rgba(0, 0, 0, 0.06)',
                boxShadow: isSelected
                  ? `0 12px 48px ${crisis.color}25, 0 0 0 1px ${crisis.color}10, inset 0 1px 0 rgba(255,255,255,0.95)`
                  : '0 4px 16px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.95)',
                padding: '28px 32px',
                transform: isSelected ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
              }}
            >
              {/* Gradient overlay on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${crisis.color}12 0%, transparent 65%)`
                }}
              />

              {/* Top accent line */}
              <div 
                className="absolute top-0 left-0 right-0 h-1 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(90deg, ${crisis.color} 0%, ${crisis.color}80 100%)`,
                  opacity: isSelected ? 1 : 0,
                  borderRadius: '24px 24px 0 0'
                }}
              />

              <div className="relative flex flex-col gap-4">
                {/* Icon and year row */}
                <div className="flex items-center justify-between">
                  <div 
                    className="w-14 h-14 rounded-[20px] flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: isSelected
                        ? `linear-gradient(135deg, ${crisis.color} 0%, ${crisis.color}dd 100%)`
                        : `linear-gradient(135deg, ${crisis.color}20 0%, ${crisis.color}10 100%)`,
                    }}
                  >
                    <AlertTriangle 
                      className="w-7 h-7 transition-colors duration-300" 
                      style={{ 
                        color: isSelected ? 'white' : crisis.color 
                      }} 
                    />
                  </div>

                  {/* Year badge */}
                  <div 
                    className="px-4 py-2 rounded-[12px] text-sm font-bold transition-all duration-300"
                    style={{
                      background: isSelected
                        ? `${crisis.color}18`
                        : 'rgba(0, 0, 0, 0.04)',
                      color: isSelected ? crisis.color : 'rgb(142, 142, 147)',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                    }}
                  >
                    {crisis.year}
                  </div>
                </div>

                {/* Crisis name */}
                <div className="text-left">
                  <h3 
                    className="text-lg font-semibold leading-tight mb-2 transition-colors duration-300"
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                      color: isSelected ? crisis.color : 'rgb(28, 28, 30)',
                      letterSpacing: '-0.015em'
                    }}
                  >
                    {crisis.name}
                  </h3>
                  <p 
                    className="text-sm leading-relaxed"
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                      color: 'rgb(142, 142, 147)'
                    }}
                  >
                    {crisis.description}
                  </p>
                </div>

                {/* Selected indicator */}
                <div className="flex items-center justify-between pt-2">
                  <div 
                    className="text-xs font-semibold uppercase tracking-wider transition-all duration-300"
                    style={{
                      color: isSelected ? crisis.color : 'transparent',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                    }}
                  >
                    Selected
                  </div>

                  {isSelected && (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{ 
                        background: crisis.color,
                        boxShadow: `0 4px 12px ${crisis.color}40`
                      }}
                    >
                      <svg 
                        className="w-4 h-4 text-white" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        strokeWidth={3.5}
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          d="M5 13l4 4L19 7" 
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Hover ring effect */}
              <div 
                className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, ${crisis.color}08 0%, transparent 100%)`,
                  border: `1px solid ${crisis.color}15`
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Selection Summary */}
      {selectedCrisis && (
        <div 
          className="mt-6 p-4 rounded-[16px] flex items-center gap-3"
          style={{
            background: `${selectedCrisisObj.color}08`,
            border: `1.5px solid ${selectedCrisisObj.color}30`,
          }}
        >
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: selectedCrisisObj.color,
            }}
          >
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p 
              className="text-sm font-semibold"
              style={{
                color: selectedCrisisObj.color,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              }}
            >
              Analyzing: {selectedCrisisObj.name}
            </p>
            <p 
              className="text-xs"
              style={{
                color: 'rgb(142, 142, 147)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              }}
            >
              {selectedCrisisObj.description} • {selectedCrisisObj.year}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
