"use client"
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-data-grid-pro/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';
import { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import AppNavbar from './components/AppNavbar';
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import AppTheme from './theme/AppTheme';
import {StockChartInteractive} from '@/components/rawdata/stockdata';
import {CrisisSelector} from '@/components/rawdata/Filterbuttons';
import {TopStocksSelector} from '@/components/rawdata/stocks';

// Modern gradient background with depth
const MainContainer = styled(Box)({
  display: 'flex',
  minHeight: '100vh',
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-50%',
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    animation: 'float 20s ease-in-out infinite',
  },
  
  '@keyframes float': {
    '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
    '50%': { transform: 'translate(-20px, 20px) scale(1.1)' },
  },
});

// Fixed sidebar wrapper
const SidebarWrapper = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100vh',
  zIndex: 1200,
});

// Glass content area with Apple-style spacing
const ContentArea = styled(Box)({
  flexGrow: 1,
  background: 'rgba(255, 255, 255, 0.25)',
  backdropFilter: 'blur(30px) saturate(150%)',
  WebkitBackdropFilter: 'blur(30px) saturate(150%)',
  margin: '16px',
  marginLeft: '296px',
  borderRadius: '24px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  overflow: 'auto',
  position: 'relative',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '4px',
    
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.3)',
    },
  },
});

// Inner content wrapper with Apple's 8-point grid system
const ContentWrapper = styled(Stack)({
  padding: '32px',
  gap: '24px',
  maxWidth: '1400px',
  margin: '0 auto',
  width: '100%',
  
  '@media (max-width: 768px)': {
    padding: '16px',
    gap: '16px',
  },
});

// Compact section wrapper (90% scale)
const CompactSection = styled(Box)({
  transform: 'scale(0.9)',
  transformOrigin: 'top center',
  width: '111.11%',
  marginLeft: '-5.56%',
  
  '@media (max-width: 768px)': {
    transform: 'scale(0.95)',
    width: '105.26%',
    marginLeft: '-2.63%',
  },
});

// Empty state component
const EmptyState = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <Box
    sx={{
      textAlign: 'center',
      py: 8,
      px: 4,
      background: 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      border: '1px solid rgba(0, 0, 0, 0.05)',
    }}
  >
    <Box sx={{ fontSize: '64px', mb: 2 }}>{icon}</Box>
    <Typography
      sx={{
        fontSize: '22px',
        fontWeight: 600,
        color: 'rgb(28, 28, 30)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        mb: 1,
        letterSpacing: '-0.02em',
      }}
    >
      {title}
    </Typography>
    <Typography
      sx={{
        fontSize: '15px',
        color: 'rgb(142, 142, 147)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        maxWidth: '400px',
        margin: '0 auto',
      }}
    >
      {description}
    </Typography>
  </Box>
);

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
  const [selectedCrisis, setSelectedCrisis] = useState<string | null>(null);
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);

  // Handler for crisis selection
  const handleCrisisSelect = (crisisId: string) => {
    setSelectedCrisis(crisisId);
    // Reset stocks when crisis changes
    setSelectedStocks([]);
  };

  // Handler for stock selection
  const handleStocksSelect = (stockIds: string[]) => {
    setSelectedStocks(stockIds);
  };

  return (
    <AppTheme {...props} disableCustomTheme={true}>
      <CssBaseline enableColorScheme />
      <MainContainer>
        {/* Fixed Sidebar */}
        <SidebarWrapper>
          <SideMenu />
        </SidebarWrapper>
        
        {/* Main content with glassmorphism */}
        <ContentArea component="main">
          <AppNavbar />
          
          <ContentWrapper>
            <Header />
            
            {/* Step 1: Crisis Selector - Always visible */}
            <CompactSection>
              <CrisisSelector 
                selectedCrisis={selectedCrisis}
                onSelect={handleCrisisSelect}
              />
            </CompactSection>

            {/* Step 2: Stock Selector - Show only if crisis selected */}
            {selectedCrisis ? (
              <CompactSection>
                <TopStocksSelector 
                  selectedStocks={selectedStocks}
                  onSelect={handleStocksSelect}
                />
              </CompactSection>
            ) : (
              <CompactSection>
                <EmptyState
                  icon="📊"
                  title="Select a Crisis Period First"
                  description="Choose a historical crisis period above to start analyzing stock performance"
                />
              </CompactSection>
            )}

            {/* Step 3: Chart - Show only if both crisis and stocks selected */}
            {selectedCrisis && selectedStocks.length > 0 ? (
              <CompactSection>
                <StockChartInteractive 
                  crisisId={selectedCrisis}
                  stockIds={selectedStocks}
                />
              </CompactSection>
            ) : selectedCrisis ? (
              <CompactSection>
                <EmptyState
                  icon="📈"
                  title="Select Stocks to Analyze"
                  description={`Choose one or more stocks to see their performance during the selected crisis period`}
                />
              </CompactSection>
            ) : null}

            {/* Summary info when everything is selected */}
            {selectedCrisis && selectedStocks.length > 0 && (
              <Box
                sx={{
                  background: 'rgba(33, 135, 244, 0.08)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '16px 24px',
                  border: '1px solid rgba(0, 122, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box sx={{ fontSize: '24px' }}>✅</Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'rgb(0, 122, 255)',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                      mb: 0.5,
                    }}
                  >
                    Analysis Ready
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '13px',
                      color: 'rgb(0, 122, 255)',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                      opacity: 0.8,
                    }}
                  >
                    Showing {selectedStocks.length} stock{selectedStocks.length > 1 ? 's' : ''} during the selected crisis period
                  </Typography>
                </Box>
              </Box>
            )}
          </ContentWrapper>
        </ContentArea>
      </MainContainer>
    </AppTheme>
  );
}
