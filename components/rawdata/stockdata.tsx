"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine, Legend } from "recharts"
import { TrendingUp, TrendingDown, ZoomIn, ZoomOut, Eye, EyeOff, AlertTriangle } from "lucide-react"
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'

// Crisis period definitions with date ranges
const crisisPeriods: Record<string, { start: string; end: string; name: string; color: string }> = {
  'covid': {
    start: '2020-02-01',
    end: '2020-06-30',
    name: 'COVID-19 Pandemic',
    color: 'rgb(255, 59, 48)'
  },
  'financial': {
    start: '2008-09-01',
    end: '2009-03-31',
    name: 'Financial Crisis',
    color: 'rgb(255, 149, 0)'
  },
  'dotcom': {
    start: '2000-03-01',
    end: '2002-10-31',
    name: 'Dot-com Bubble',
    color: 'rgb(88, 86, 214)'
  }
}

// Sample stock data for different stocks (you'll replace with real data)
const stockDataMap: Record<string, any[]> = {
  '1': [ // AAPL
    { date: "2024-04-01", price: 169.65, volume: 58420000 },
    { date: "2024-04-02", price: 168.45, volume: 52340000 },
    { date: "2024-04-03", price: 171.20, volume: 61230000 },
    { date: "2024-04-04", price: 173.80, volume: 68450000 },
    { date: "2024-04-05", price: 175.30, volume: 72180000 },
    { date: "2024-04-08", price: 174.25, volume: 55670000 },
    { date: "2024-04-09", price: 172.90, volume: 49320000 },
    { date: "2024-04-10", price: 176.55, volume: 64890000 },
    { date: "2024-04-11", price: 178.20, volume: 71230000 },
    { date: "2024-04-12", price: 177.45, volume: 58940000 },
    { date: "2024-04-15", price: 179.80, volume: 76540000 },
    { date: "2024-04-16", price: 181.30, volume: 82360000 },
    { date: "2024-04-17", price: 183.65, volume: 88920000 },
    { date: "2024-04-18", price: 182.40, volume: 65430000 },
    { date: "2024-04-19", price: 184.20, volume: 72180000 },
    { date: "2024-04-22", price: 185.90, volume: 79340000 },
    { date: "2024-04-23", price: 187.35, volume: 85670000 },
    { date: "2024-04-24", price: 186.70, volume: 68920000 },
    { date: "2024-04-25", price: 188.45, volume: 91230000 },
    { date: "2024-04-26", price: 190.20, volume: 95680000 },
  ],
  '2': [ // MSFT - slightly different pattern
    { date: "2024-04-01", price: 420.50, volume: 45320000 },
    { date: "2024-04-02", price: 418.30, volume: 42140000 },
    { date: "2024-04-03", price: 422.80, volume: 48230000 },
    { date: "2024-04-04", price: 425.60, volume: 51450000 },
    { date: "2024-04-05", price: 428.90, volume: 55180000 },
    { date: "2024-04-08", price: 427.40, volume: 46670000 },
    { date: "2024-04-09", price: 425.10, volume: 43320000 },
    { date: "2024-04-10", price: 430.20, volume: 52890000 },
    { date: "2024-04-11", price: 433.50, volume: 58230000 },
    { date: "2024-04-12", price: 431.80, volume: 49940000 },
    { date: "2024-04-15", price: 435.90, volume: 61540000 },
    { date: "2024-04-16", price: 438.70, volume: 67360000 },
    { date: "2024-04-17", price: 441.20, volume: 72920000 },
    { date: "2024-04-18", price: 439.80, volume: 58430000 },
    { date: "2024-04-19", price: 442.50, volume: 63180000 },
    { date: "2024-04-22", price: 445.30, volume: 68340000 },
    { date: "2024-04-23", price: 448.10, volume: 74670000 },
    { date: "2024-04-24", price: 446.90, volume: 61920000 },
    { date: "2024-04-25", price: 450.20, volume: 78230000 },
    { date: "2024-04-26", price: 453.40, volume: 82680000 },
  ],
  // Add more stocks as needed
}

// Stock symbols map
const stockSymbolsMap: Record<string, { symbol: string; name: string }> = {
  '1': { symbol: 'AAPL', name: 'Apple Inc.' },
  '2': { symbol: 'MSFT', name: 'Microsoft Corporation' },
  '3': { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  '4': { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  '5': { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  '6': { symbol: 'TSLA', name: 'Tesla Inc.' },
  '7': { symbol: 'META', name: 'Meta Platforms Inc.' },
  '8': { symbol: 'BRK.B', name: 'Berkshire Hathaway' },
}

// Color palette for multiple stocks
const stockColors = [
  'rgb(0, 122, 255)',
  'rgb(255, 59, 48)',
  'rgb(52, 199, 89)',
  'rgb(255, 149, 0)',
  'rgb(88, 86, 214)',
  'rgb(255, 45, 85)',
  'rgb(90, 200, 250)',
  'rgb(255, 204, 0)',
]

const GlassCard = styled(Box)({
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  padding: '24px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  maxWidth: '100%',
  
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 48px 0 rgba(31, 38, 135, 0.2)',
  },
  
  '@media (max-width: 768px)': {
    padding: '16px',
  },
})

const MetricPill = styled('button')<{ active?: boolean }>(({ active }) => ({
  background: active ? 'rgba(0, 122, 255, 0.15)' : 'rgba(0, 0, 0, 0.04)',
  border: active ? '1.5px solid rgba(0, 122, 255, 0.4)' : '1px solid rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  padding: '8px 16px',
  fontSize: '13px',
  fontWeight: 600,
  color: active ? '#007AFF' : 'rgba(0, 0, 0, 0.6)',
  cursor: 'pointer',
  transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
  whiteSpace: 'nowrap',
  
  '&:hover': {
    background: active ? 'rgba(0, 122, 255, 0.2)' : 'rgba(0, 0, 0, 0.06)',
    transform: 'scale(1.02)',
  },
}))

const ToggleButton = styled('button')<{ active?: boolean }>(({ active }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  background: active ? 'rgba(52, 199, 89, 0.15)' : 'rgba(0, 0, 0, 0.04)',
  border: active ? '2px solid rgba(52, 199, 89, 0.4)' : '1.5px solid rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  padding: '10px 16px',
  fontSize: '13px',
  fontWeight: 600,
  color: active ? '#34C759' : 'rgba(0, 0, 0, 0.5)',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
  
  '&:hover': {
    background: active ? 'rgba(52, 199, 89, 0.2)' : 'rgba(0, 0, 0, 0.06)',
    transform: 'scale(1.05)',
  },
  
  '&:active': {
    transform: 'scale(0.98)',
  },
}))

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, stockIds }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <Box
        sx={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 122, 255, 0.3)',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          minWidth: '220px',
        }}
      >
        <Typography
          sx={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'rgba(0, 0, 0, 0.5)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            mb: 1,
          }}
        >
          {new Date(data.date).toLocaleDateString("en-US", { 
            weekday: 'short',
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
          })}
        </Typography>
        <Divider sx={{ mb: 1.5, opacity: 0.3 }} />
        <Stack spacing={1}>
          {payload.map((entry: any, index: number) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: entry.stroke,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: '12px',
                    color: 'rgba(0, 0, 0, 0.6)',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                  }}
                >
                  {entry.name}
                </Typography>
              </Stack>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: entry.stroke,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                }}
              >
                ${entry.value.toFixed(2)}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    )
  }
  return null
}

interface StockChartInteractiveProps {
  crisisId?: string;
  stockIds?: string[];
}

export function StockChartInteractive({ 
  crisisId,
  stockIds = []
}: StockChartInteractiveProps) {
  const [timeRange, setTimeRange] = React.useState<string>("All")
  const [showZoom, setShowZoom] = React.useState(false)
  const [zoomEnabled, setZoomEnabled] = React.useState(true)
  const [hoverEnabled, setHoverEnabled] = React.useState(true)
  const [[x, y], setXY] = React.useState([0, 0])
  const [[imgWidth, imgHeight], setSize] = React.useState([0, 0])

  const chartRef = React.useRef<HTMLDivElement>(null)

  // Get crisis information
  const crisis = crisisId ? crisisPeriods[crisisId] : null

  // Merge data from multiple stocks
  const getMergedStockData = () => {
    if (stockIds.length === 0) return []

    // Get data for first stock as base
    const baseData = stockDataMap[stockIds[0]] || []
    
    // Create merged data structure
    return baseData.map((item, index) => {
      const mergedItem: any = { date: item.date }
      
      stockIds.forEach((stockId, idx) => {
        const stockData = stockDataMap[stockId] || []
        const stockInfo = stockSymbolsMap[stockId]
        if (stockData[index]) {
          mergedItem[stockInfo.symbol] = stockData[index].price
        }
      })
      
      return mergedItem
    })
  }

  const chartData = getMergedStockData()

  // Calculate statistics
  const getStockStats = () => {
    if (stockIds.length === 0 || chartData.length === 0) return null

    const firstStock = stockSymbolsMap[stockIds[0]]
    const prices = chartData.map(d => d[firstStock.symbol]).filter(p => p !== undefined)
    
    if (prices.length === 0) return null

    const currentPrice = prices[prices.length - 1]
    const previousPrice = prices[0]
    const priceChange = currentPrice - previousPrice
    const percentChange = ((priceChange / previousPrice) * 100).toFixed(2)
    const isPositive = priceChange >= 0

    const highPrice = Math.max(...prices)
    const lowPrice = Math.min(...prices)
    const avgPrice = prices.reduce((acc, curr) => acc + curr, 0) / prices.length

    return {
      currentPrice,
      priceChange,
      percentChange,
      isPositive,
      highPrice,
      lowPrice,
      avgPrice
    }
  }

  const stats = getStockStats()

  const timeRanges = ["1M", "3M", "6M", "1Y", "All"]

  const zoomBoxSize = 120
  const zoomLevel = 2.5

  const mouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomEnabled) return
    const elem = e.currentTarget
    const { width, height } = elem.getBoundingClientRect()
    setSize([width, height])
    setShowZoom(true)
  }

  const mouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomEnabled) return
    const elem = e.currentTarget
    const { top, left } = elem.getBoundingClientRect()
    const x = e.pageX - left - window.pageXOffset
    const y = e.pageY - top - window.pageYOffset
    setXY([x, y])
  }

  const mouseLeave = () => {
    if (!zoomEnabled) return
    setShowZoom(false)
  }

  if (!crisis || stockIds.length === 0) {
    return null
  }

  return (
    <GlassCard>
      <Stack spacing={3}>
        {/* Crisis Period Banner */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${crisis.color}15 0%, ${crisis.color}08 100%)`,
            border: `2px solid ${crisis.color}40`,
            borderRadius: '16px',
            padding: '16px 20px',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '14px',
                background: crisis.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 12px ${crisis.color}40`,
              }}
            >
              <AlertTriangle size={24} color="white" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: crisis.color,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                  mb: 0.5,
                }}
              >
                {crisis.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: '13px',
                  color: 'rgba(0, 0, 0, 0.6)',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                }}
              >
                Crisis Period: {new Date(crisis.start).toLocaleDateString()} - {new Date(crisis.end).toLocaleDateString()}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Header with Stock Info */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
          <Box>
            <Typography
              sx={{
                fontSize: '20px',
                fontWeight: 600,
                color: 'rgb(28, 28, 30)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                letterSpacing: '-0.02em',
                mb: 1,
              }}
            >
              Performance Analysis
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {stockIds.map((stockId, idx) => {
                const stock = stockSymbolsMap[stockId]
                return (
                  <Box
                    key={stockId}
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: '8px',
                      background: `${stockColors[idx % stockColors.length]}15`,
                      border: `1.5px solid ${stockColors[idx % stockColors.length]}30`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: stockColors[idx % stockColors.length],
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                      }}
                    >
                      {stock.symbol}
                    </Typography>
                  </Box>
                )
              })}
            </Stack>
          </Box>

          {/* Feature Toggle Controls */}
          <Stack direction="row" spacing={1.5}>
            <ToggleButton 
              active={zoomEnabled}
              onClick={() => setZoomEnabled(!zoomEnabled)}
            >
              {zoomEnabled ? <ZoomIn size={16} /> : <ZoomOut size={16} />}
              <span>Zoom</span>
            </ToggleButton>
            
            <ToggleButton 
              active={hoverEnabled}
              onClick={() => setHoverEnabled(!hoverEnabled)}
            >
              {hoverEnabled ? <Eye size={16} /> : <EyeOff size={16} />}
              <span>Details</span>
            </ToggleButton>
          </Stack>
        </Stack>

        {/* Price Display (for primary stock) */}
        {stats && (
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.05) 0%, rgba(0, 122, 255, 0.02) 100%)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(0, 122, 255, 0.1)',
            }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
              <Stack direction="row" alignItems="baseline" spacing={2}>
                <Typography
                  sx={{
                    fontSize: { xs: '32px', sm: '40px' },
                    fontWeight: 600,
                    color: 'rgba(0, 0, 0, 0.9)',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                  }}
                >
                  ${stats.currentPrice.toFixed(2)}
                </Typography>
                
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  {stats.isPositive ? (
                    <TrendingUp size={16} color="#34C759" />
                  ) : (
                    <TrendingDown size={16} color="#FF3B30" />
                  )}
                  <Typography
                    sx={{
                      fontSize: { xs: '14px', sm: '16px' },
                      fontWeight: 600,
                      color: stats.isPositive ? '#34C759' : '#FF3B30',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                    }}
                  >
                    {stats.isPositive ? '+' : ''}{stats.priceChange.toFixed(2)} ({stats.isPositive ? '+' : ''}{stats.percentChange}%)
                  </Typography>
                </Stack>
              </Stack>

              <Typography
                sx={{
                  fontSize: '12px',
                  color: 'rgba(0, 0, 0, 0.5)',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                }}
              >
                {stockSymbolsMap[stockIds[0]].symbol} • Crisis Period Data
              </Typography>
            </Stack>
          </Box>
        )}

        {/* Chart Container */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          {/* Main Chart */}
          <Box
            sx={{
              flex: (showZoom && zoomEnabled) ? '0 0 60%' : '1',
              height: { xs: 320, sm: 400 },
              position: 'relative',
              transition: 'flex 0.3s ease',
              background: 'rgba(0, 0, 0, 0.02)',
              borderRadius: '16px',
              padding: '16px',
            }}
          >
            <Box
              ref={chartRef}
              onMouseEnter={mouseEnter}
              onMouseMove={mouseMove}
              onMouseLeave={mouseLeave}
              sx={{
                width: '100%',
                height: '100%',
                position: 'relative',
                cursor: zoomEnabled ? 'crosshair' : 'default',
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                >
                  <defs>
                    {stockIds.map((stockId, idx) => (
                      <linearGradient key={stockId} id={`color${stockId}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={stockColors[idx % stockColors.length]} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={stockColors[idx % stockColors.length]} stopOpacity={0.05} />
                      </linearGradient>
                    ))}
                  </defs>
                  
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="rgba(0, 0, 0, 0.08)" 
                    vertical={true}
                    horizontal={true}
                  />
                  
                  {stats && (
                    <ReferenceLine 
                      y={stats.avgPrice} 
                      stroke="rgba(0, 122, 255, 0.4)" 
                      strokeDasharray="5 5"
                      label={{ 
                        value: `Avg: $${stats.avgPrice.toFixed(2)}`, 
                        position: 'right',
                        fill: 'rgb(0, 122, 255)',
                        fontSize: 11,
                        fontWeight: 600
                      }}
                    />
                  )}
                  
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(0, 0, 0, 0.1)' }}
                    tick={{ 
                      fill: 'rgba(0, 0, 0, 0.5)', 
                      fontSize: 11,
                      fontWeight: 500,
                    }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    minTickGap={30}
                  />
                  <YAxis
                    domain={['dataMin - 10', 'dataMax + 10']}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(0, 0, 0, 0.1)' }}
                    tick={{ 
                      fill: 'rgba(0, 0, 0, 0.5)', 
                      fontSize: 11,
                      fontWeight: 500,
                    }}
                    tickFormatter={(value) => `$${value.toFixed(0)}`}
                  />
                  
                  {hoverEnabled && (
                    <Tooltip 
                      content={<CustomTooltip stockIds={stockIds} />} 
                      cursor={{ stroke: 'rgb(0, 122, 255)', strokeWidth: 2, strokeDasharray: '5 5' }} 
                    />
                  )}

                  <Legend 
                    verticalAlign="top" 
                    height={36}
                    iconType="line"
                    wrapperStyle={{
                      paddingBottom: '10px',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  />
                  
                  {stockIds.map((stockId, idx) => {
                    const stock = stockSymbolsMap[stockId]
                    return (
                      <Area
                        key={stockId}
                        type="monotone"
                        dataKey={stock.symbol}
                        name={stock.symbol}
                        stroke={stockColors[idx % stockColors.length]}
                        strokeWidth={3}
                        fill={`url(#color${stockId})`}
                        dot={false}
                        activeDot={hoverEnabled ? { 
                          r: 6, 
                          fill: stockColors[idx % stockColors.length],
                          stroke: '#fff',
                          strokeWidth: 3,
                        } : false}
                      />
                    )
                  })}
                </AreaChart>
              </ResponsiveContainer>

              {/* Hover Box Indicator */}
              {showZoom && zoomEnabled && (
                <div
                  style={{
                    position: "absolute",
                    pointerEvents: "none",
                    height: `${zoomBoxSize}px`,
                    width: `${zoomBoxSize}px`,
                    top: `${y - zoomBoxSize / 2}px`,
                    left: `${x - zoomBoxSize / 2}px`,
                    border: "3px solid rgb(0, 122, 255)",
                    backgroundColor: "rgba(0, 122, 255, 0.1)",
                    borderRadius: "12px",
                    boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)',
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Side Zoom Panel */}
          {showZoom && zoomEnabled && (
            <Box
              sx={{
                flex: '0 0 38%',
                height: { xs: 320, sm: 400 },
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(15px)',
                border: '3px solid rgba(0, 122, 255, 0.3)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
                position: 'relative',
                animation: 'slideIn 0.3s ease',
                '@keyframes slideIn': {
                  from: { opacity: 0, transform: 'translateX(20px)' },
                  to: { opacity: 1, transform: 'translateX(0)' },
                },
              }}
            >
              <div
                style={{
                  height: `${imgHeight * zoomLevel}px`,
                  width: `${imgWidth * zoomLevel}px`,
                  marginLeft: `${-x * zoomLevel + (imgWidth * 0.38) / 2}px`,
                  marginTop: `${-y * zoomLevel + 200}px`,
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                  >
                    <defs>
                      {stockIds.map((stockId, idx) => (
                        <linearGradient key={`zoom${stockId}`} id={`colorZoom${stockId}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={stockColors[idx % stockColors.length]} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={stockColors[idx % stockColors.length]} stopOpacity={0.05} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" vertical={true} horizontal={true} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={{ stroke: 'rgba(0, 0, 0, 0.2)' }}
                      tick={{ fill: 'rgba(0, 0, 0, 0.6)', fontSize: 10, fontWeight: 600 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    />
                    <YAxis
                      domain={['dataMin - 10', 'dataMax + 10']}
                      tickLine={false}
                      axisLine={{ stroke: 'rgba(0, 0, 0, 0.2)' }}
                      tick={{ fill: 'rgba(0, 0, 0, 0.6)', fontSize: 10, fontWeight: 600 }}
                      tickFormatter={(value) => `$${value.toFixed(2)}`}
                    />
                    {stockIds.map((stockId, idx) => {
                      const stock = stockSymbolsMap[stockId]
                      return (
                        <Area
                          key={stockId}
                          type="monotone"
                          dataKey={stock.symbol}
                          stroke={stockColors[idx % stockColors.length]}
                          strokeWidth={4}
                          fill={`url(#colorZoom${stockId})`}
                          dot={{ r: 4, fill: stockColors[idx % stockColors.length], strokeWidth: 2, stroke: '#fff' }}
                        />
                      )
                    })}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  background: 'rgba(0, 122, 255, 0.95)',
                  color: 'white',
                  px: 2,
                  py: 1,
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 700,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                  boxShadow: '0 4px 12px rgba(0, 122, 255, 0.4)',
                }}
              >
                <ZoomIn size={14} />
                {zoomLevel}x
              </Stack>
            </Box>
          )}
        </Box>

        {/* Time range selector */}
        <Stack 
          direction="row" 
          spacing={1} 
          justifyContent="center"
          sx={{
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': { height: '4px' },
            '&::-webkit-scrollbar-thumb': { background: 'rgba(0, 0, 0, 0.2)', borderRadius: '4px' },
          }}
        >
          {timeRanges.map((range) => (
            <MetricPill key={range} active={timeRange === range} onClick={() => setTimeRange(range)}>
              {range}
            </MetricPill>
          ))}
        </Stack>

        {/* Enhanced Stock metrics */}
        {stats && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 2,
              mt: 1,
              '@media (max-width: 768px)': {
                gridTemplateColumns: 'repeat(2, 1fr)',
              },
            }}
          >
            <MetricBox label="High" value={`$${stats.highPrice.toFixed(2)}`} color="#34C759" />
            <MetricBox label="Low" value={`$${stats.lowPrice.toFixed(2)}`} color="#FF3B30" />
            <MetricBox label="Average" value={`$${stats.avgPrice.toFixed(2)}`} color="#007AFF" />
            <MetricBox label="Volatility" value={`${((stats.highPrice - stats.lowPrice) / stats.avgPrice * 100).toFixed(1)}%`} color="#FF9500" />
          </Box>
        )}
      </Stack>
    </GlassCard>
  )
}

function MetricBox({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <Box
      sx={{
        background: 'rgba(0, 0, 0, 0.02)',
        borderRadius: '12px',
        padding: '12px',
        border: `1px solid ${color ? `${color}20` : 'rgba(0, 0, 0, 0.05)'}`,
        transition: 'all 0.2s ease',
        '&:hover': {
          background: color ? `${color}08` : 'rgba(0, 0, 0, 0.04)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Typography
        sx={{
          fontSize: '11px',
          fontWeight: 600,
          color: color || 'rgba(0, 0, 0, 0.4)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          mb: 0.5,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: '16px', sm: '18px' },
          fontWeight: 700,
          color: color || 'rgba(0, 0, 0, 0.85)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          letterSpacing: '-0.01em',
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}
