"use client"
import { useState, useEffect, useRef } from "react"


function HomeIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  )
}


function GlobeIcon({ size = 20, spinning = false }: { size?: number; spinning?: boolean }) {
  const [angle, setAngle] = useState(0)
  const rafRef = useRef<number | null>(null)
  const lastRef = useRef<number | null>(null)

  useEffect(() => {
    if (!spinning) return
    const animate = (ts: number) => {
      if (lastRef.current !== null) {
        const delta = ts - lastRef.current
        setAngle(a => (a + delta * 0.1) % 360)
      }
      lastRef.current = ts
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      lastRef.current = null
    }
  }, [spinning])

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" opacity="0.6" />
      <path d="M12 2v20" opacity="0.4" />
      <path d="M4.9 7.5h14.2" opacity="0.5" />
      <path d="M4.9 16.5h14.2" opacity="0.5" />
      <ellipse cx="12" cy="12" rx="3.8" ry="10"
        style={{
          transformOrigin: "12px 12px",
          transform: `rotateY(${angle}deg)`,
          opacity: 0.35,
        }}
      />
    </svg>
  )
}


function NavButton({ label, icon, active, onClick, collapsed }: { label: string; icon: string; active: boolean; onClick: () => void; collapsed: boolean }) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const isGlobe = icon === "globe"

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      title={collapsed ? label : undefined}
      style={{
        all: "unset",
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        gap: "13px",
        width: "100%",
        boxSizing: "border-box",
        padding: collapsed ? "12px" : "15px 18px",
        borderRadius: "13px",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        background: active ? "#0f0f0f" : hovered ? "#f4f4f4" : "transparent",
        boxShadow: active
          ? "0 4px 20px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.1)"
          : hovered ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
        transform: pressed ? "scale(0.985)" : "scale(1)",
        transition: "background 0.2s ease, box-shadow 0.2s ease, transform 0.12s ease, padding 0.3s ease",
        marginBottom: "6px",
      }}
    >
      {active && (
        <span style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 40%)",
          borderRadius: "13px", pointerEvents: "none",
        }} />
      )}

      <span style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: "36px", height: "36px", borderRadius: "9px", flexShrink: 0,
        background: active ? "rgba(255,255,255,0.1)" : hovered ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.04)",
        color: active ? "#fff" : hovered ? "#111" : "#777",
        transition: "all 0.2s ease",
      }}>
        {isGlobe ? <GlobeIcon spinning={active || hovered} /> : <HomeIcon />}
      </span>

      {!collapsed && (
        <span style={{ display: "flex", flexDirection: "column", gap: "1px", flex: 1, overflow: "hidden" }}>
          <span style={{
            fontFamily: "'Geist', 'DM Sans', sans-serif",
            fontSize: "15px", fontWeight: "600", letterSpacing: "-0.02em",
            color: active ? "#fff" : hovered ? "#111" : "#222",
            lineHeight: 1.2, transition: "color 0.2s ease", whiteSpace: "nowrap",
          }}>
            {label}
          </span>
          <span style={{
            fontFamily: "'Geist Mono', 'DM Mono', monospace",
            fontSize: "10.5px", letterSpacing: "0.02em",
            color: active ? "rgb(255,255,255)" : "#bbb",
            transition: "color 0.2s ease", whiteSpace: "nowrap",
          }}>
            {isGlobe ? "Live · 42 markets" : "Overview · Dashboard"}
          </span>
        </span>
      )}

      {!collapsed && (
        <span style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
          {isGlobe && (
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: active ? "#4ade80" : "#ddd",
              boxShadow: active ? "0 0 8px rgba(74,222,128,0.9)" : "none",
              transition: "all 0.3s ease",
              animation: active ? "blink 2s ease-in-out infinite" : "none",
            }} />
          )}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{
              color: active ? "rgba(255,255,255,0.4)" : "#ccc",
              transform: hovered && !active ? "translateX(2px)" : "none",
              transition: "all 0.2s ease",
            }}>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </span>
      )}
    </button>
  )
}


export function AppSidebar(props: { style?: React.CSSProperties }) {
  const [active, setActive] = useState("home")
  const [collapsed, setCollapsed] = useState(false)
  const [openerHovered, setOpenerHovered] = useState(false)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes blink {
          0%,100% { opacity:1; }
          50%      { opacity:0.4; }
        }
        @keyframes slide-in {
          from { opacity:0; transform: translateX(-10px); }
          to   { opacity:1; transform: translateX(0); }
        }
        @keyframes opener-pop {
          from { opacity:0; transform: translateY(-50%) scale(0.8); }
          to   { opacity:1; transform: translateY(-50%) scale(1); }
        }
        .sidebar-nav-item { animation: slide-in 0.35s ease forwards; }
        .sidebar-nav-item:nth-child(1) { animation-delay: 0.05s; opacity: 0; }
        .sidebar-nav-item:nth-child(2) { animation-delay: 0.12s; opacity: 0; }
        .app-sidebar ::-webkit-scrollbar { width: 0px; }
      `}</style>

      {/* ── Floating opener tab — only visible when collapsed ── */}
      {collapsed && (
        <div
          onClick={() => setCollapsed(false)}
          onMouseEnter={() => setOpenerHovered(true)}
          onMouseLeave={() => setOpenerHovered(false)}
          title="Open sidebar"
          style={{
            position: "fixed",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 100,
            cursor: "pointer",
            animation: "opener-pop 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards",

            // Pill tab shape
            background: openerHovered ? "#0f0f0f" : "#fff",
            border: "1px solid #e5e5e5",
            borderLeft: "none",
            borderRadius: "0 10px 10px 0",
            boxShadow: openerHovered
              ? "4px 0 20px rgba(0,0,0,0.18)"
              : "2px 0 10px rgba(0,0,0,0.08)",
            padding: "14px 10px 14px 8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            transition: "background 0.2s ease, box-shadow 0.2s ease",
          }}
        >
          {/* Double chevron right */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ color: openerHovered ? "#fff" : "#999", transition: "color 0.2s ease" }}>
            <path d="M6 17l5-5-5-5" />
            <path d="M13 17l5-5-5-5" />
          </svg>

          {/* Vertical label */}
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "8px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: openerHovered ? "rgba(255,255,255,0.6)" : "#ccc",
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            transition: "color 0.2s ease",
            userSelect: "none",
          }}>
            Menu
          </span>
        </div>
      )}

      <aside className="app-sidebar" style={{
        width: collapsed ? "0px" : "288px",
        height: "100vh",
        background: "#fff",
        borderRight: collapsed ? "none" : "1px solid #ebebeb",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'DM Sans', sans-serif",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), border 0.3s ease",
        overflow: "hidden",
        flexShrink: 0,
        ...props.style,
      }}>

        {/* ── Top wordmark strip ── */}
        <div style={{
          padding: "22px 16px 18px",
          borderBottom: "1px solid #f2f2f2",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          minHeight: "72px",
          boxSizing: "border-box",
        }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "9px",
            background: "#0f0f0f", display: "flex", alignItems: "center",
            justifyContent: "center", flexShrink: 0,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>

          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: "700",
            letterSpacing: "-0.03em", color: "#0f0f0f", lineHeight: 1, whiteSpace: "nowrap",
          }}>
            Nexus
          </div>

          <div style={{ flex: 1 }} />

          {/* ── Collapse button ── */}
          <button
            onClick={() => setCollapsed(true)}
            title="Collapse sidebar"
            style={{
              all: "unset", cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center",
              width: "28px", height: "28px", borderRadius: "8px",
              color: "#aaa", transition: "background 0.18s ease, color 0.18s ease", flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#f0f0f0"; e.currentTarget.style.color = "#333" }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#aaa" }}
          >
            {/* Double chevron left */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 17l-5-5 5-5" />
              <path d="M18 17l-5-5 5-5" />
            </svg>
          </button>
        </div>

        {/* ── Nav items ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 12px" }}>
          <div style={{
            padding: "0 6px 10px",
            fontFamily: "'DM Mono', monospace", fontSize: "9px",
            letterSpacing: "0.14em", textTransform: "uppercase", color: "black",
          }}>
            Menu
          </div>

          <div className="sidebar-nav-item">
            <NavButton label="Home" icon="home" active={active === "home"}
              onClick={() => setActive("home")} collapsed={false} />
          </div>

          <div className="sidebar-nav-item">
            <NavButton label="Global Market" icon="globe" active={active === "global"}
              onClick={() => setActive("global")} collapsed={false} />
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: "14px 20px", borderTop: "1px solid #f2f2f2",
          display: "flex", alignItems: "center", gap: "8px", flexShrink: 0,
        }}>
          <div style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: "#4ade80", boxShadow: "0 0 6px rgba(74,222,128,0.7)", flexShrink: 0,
          }} />
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: "10px",
            color: "#ccc", letterSpacing: "0.04em", whiteSpace: "nowrap",
          }}>
          </span>
        </div>
      </aside>
    </>
  )
}


export default function Demo() {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#f7f7f7" }}>
      <AppSidebar />
      <main style={{
        flex: 1, display: "flex", alignItems: "center",
        justifyContent: "center", color: "#ccc",
        fontFamily: "'DM Sans', sans-serif", fontSize: "14px", letterSpacing: "-0.01em",
      }}>
        Main content area
      </main>
    </div>
  )
}
