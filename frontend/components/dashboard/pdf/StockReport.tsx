import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { StockMetrics } from "@/lib/types";

const styles = StyleSheet.create({
  page: {
    padding: "40px 48px",
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  label: {
    fontSize: 8,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#9ca3af",
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 4,
  },
  generatedAt: {
    fontSize: 9,
    color: "#9ca3af",
    textAlign: "right",
  },
  periodRow: {
    flexDirection: "row",
    gap: 24,
    marginTop: 8,
  },
  periodLabel: {
    fontSize: 8,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  periodValue: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#374151",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "#374151",
    marginBottom: 10,
  },
  chartImage: {
    width: "100%",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metricCard: {
    flex: 1,
    minWidth: "44%",
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: "12px 14px",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  metricLabel: {
    fontSize: 8,
    color: "#6b7280",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  recommendationBox: {
    backgroundColor: "#f0f9ff",
    borderRadius: 8,
    padding: "14px 16px",
    borderWidth: 1,
    borderColor: "#bae6fd",
  },
  recommendationText: {
    fontSize: 10,
    color: "#1e3a5f",
    lineHeight: 1.6,
  },
  chartPageHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  chartPageTicker: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#374151",
  },
  chartPageSep: {
    fontSize: 11,
    color: "#d1d5db",
  },
  chartPageLabel: {
    fontSize: 11,
    color: "#6b7280",
  },
  chartsStack: {
    flexDirection: "column",
    gap: 18,
  },
  chartGridLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#374151",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: "#9ca3af",
  },
});

function fmt(n: number, decimals = 4): string {
  return n.toFixed(decimals);
}

interface StockReportProps {
  ticker: string;
  period: string;
  startDate: string;
  endDate: string;
  metrics: StockMetrics | null;
  chartImages: { label: string; url: string }[];
  recommendationText: string;
  generatedAt: string;
}

function Footer({ ticker, startDate, endDate }: { ticker: string; startDate: string; endDate: string }) {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>{ticker} · {startDate} – {endDate}</Text>
      <Text style={styles.footerText}>COMP530 Group Project — University of Liverpool</Text>
    </View>
  );
}

export function StockReport({
  ticker,
  period,
  startDate,
  endDate,
  metrics,
  chartImages,
  recommendationText,
  generatedAt,
}: StockReportProps) {
  const [allChart, ...individualCharts] = chartImages;

  // Group individual charts 3 per page
  const chartPairs: typeof individualCharts[] = [];
  for (let i = 0; i < individualCharts.length; i += 3) {
    chartPairs.push(individualCharts.slice(i, i + 3));
  }

  return (
    <Document>
      {/* ── Page 1: Summary ── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.label}>Stock Analysis Report</Text>
              <Text style={styles.title}>{ticker}</Text>
              <Text style={styles.subtitle}>{period}</Text>
            </View>
            <Text style={styles.generatedAt}>Generated {generatedAt}</Text>
          </View>
          <View style={styles.periodRow}>
            <View>
              <Text style={styles.periodLabel}>Start date</Text>
              <Text style={styles.periodValue}>{startDate}</Text>
            </View>
            <View>
              <Text style={styles.periodLabel}>End date</Text>
              <Text style={styles.periodValue}>{endDate}</Text>
            </View>
          </View>
        </View>

        {allChart && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Metrics</Text>
            <Image src={allChart.url} style={styles.chartImage} />
          </View>
        )}

        {metrics && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Metrics</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Volatility</Text>
                <Text style={styles.metricValue}>{fmt(metrics.volatility)}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Avg Log Return</Text>
                <Text style={styles.metricValue}>{fmt(metrics.avg_log_return)}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>ROI Ratio</Text>
                <Text style={styles.metricValue}>{fmt(metrics.roi_ratio)}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Recovery Duration</Text>
                <Text style={styles.metricValue}>
                  {metrics.recovery_duration > 0 ? `${Math.round(metrics.recovery_duration)} days` : "N/A"}
                </Text>
              </View>
            </View>
          </View>
        )}

        {recommendationText && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommendation</Text>
            <View style={styles.recommendationBox}>
              <Text style={styles.recommendationText}>{recommendationText}</Text>
            </View>
          </View>
        )}

        <Footer ticker={ticker} startDate={startDate} endDate={endDate} />
      </Page>

      {/* ── Pages 2+: Individual metric charts (3 per page, stacked vertically) ── */}
      {chartPairs.map((pair, pageIdx) => (
        <Page key={pageIdx} size="A4" style={styles.page}>
          <View style={styles.chartPageHeader}>
            <Text style={styles.chartPageTicker}>{ticker}</Text>
            <Text style={styles.chartPageSep}>·</Text>
            <Text style={styles.chartPageLabel}>Individual Metrics</Text>
          </View>

          <View style={styles.chartsStack}>
            {pair.map((chart) => (
              <View key={chart.label}>
                <Text style={styles.chartGridLabel}>{chart.label}</Text>
                <Image src={chart.url} style={styles.chartImage} />
              </View>
            ))}
          </View>

          <Footer ticker={ticker} startDate={startDate} endDate={endDate} />
        </Page>
      ))}
    </Document>
  );
}
