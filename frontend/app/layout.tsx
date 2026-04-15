import type { Metadata } from "next"
import "./globals.css"
import { AppSidebar } from "@/components/app-sidebar"

export const metadata: Metadata = {
  title: "Stock Analyzer",
  description: "Stock market analysis dashboard",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: "flex", height: "100vh", background: "#f7f7f7" }}>
          <AppSidebar />
          <div style={{ flex: 1, overflowY: "auto" }}>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}