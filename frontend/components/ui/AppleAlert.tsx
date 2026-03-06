"use client";

import React, { useEffect, useRef, useState } from "react";

type AppleAlertProps = {
  title: string;
  tone?: "error" | "success";
  statusCode?: number;
  message: string;
  rawDetails?: any;
};

const KEYFRAMES = `
  @keyframes alertSlideIn {
    0%   { opacity: 0; transform: translateY(-10px) scale(0.97); filter: blur(4px); }
    60%  { opacity: 1; transform: translateY(2px) scale(1.005); filter: blur(0); }
    100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
  }
  @keyframes iconPop {
    0%   { transform: scale(0.4); opacity: 0; }
    55%  { transform: scale(1.25); opacity: 1; }
    75%  { transform: scale(0.92); }
    90%  { transform: scale(1.06); }
    100% { transform: scale(1); }
  }
  @keyframes iconPulse {
    0%, 100% { box-shadow: 0 0 0 0px var(--glow); }
    50%       { box-shadow: 0 0 0 5px var(--glow); }
  }
  @keyframes textReveal {
    0%   { opacity: 0; transform: translateX(-6px); }
    100% { opacity: 1; transform: translateX(0); }
  }
  @keyframes detailsExpand {
    0%   { opacity: 0; max-height: 0; transform: translateY(-4px); }
    100% { opacity: 1; max-height: 200px; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes borderGlow {
    0%, 100% { opacity: 0.5; }
    50%       { opacity: 1; }
  }
  @keyframes checkDraw {
    0%   { stroke-dashoffset: 20; opacity: 0; }
    40%  { opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 1; }
  }
  @keyframes bangDraw {
    0%   { stroke-dashoffset: 14; opacity: 0; }
    50%  { opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 1; }
  }
`;

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <polyline
        points="2,6.5 5,9.5 10,3"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="20"
        style={{
          animation: "checkDraw 0.55s cubic-bezier(0.4,0,0.2,1) 0.35s both",
        }}
      />
    </svg>
  );
}

function BangIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <line
        x1="6" y1="2.5" x2="6" y2="7"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray="14"
        style={{
          animation: "bangDraw 0.35s cubic-bezier(0.4,0,0.2,1) 0.3s both",
        }}
      />
      <circle cx="6" cy="9.5" r="0.9" fill={color} style={{ opacity: 0, animation: "textReveal 0.2s ease 0.65s forwards" }} />
    </svg>
  );
}

export function AppleAlert({
  title,
  tone = "error",
  statusCode,
  message,
  rawDetails,
}: AppleAlertProps) {
  const isSuccess = tone === "success";
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    if (!document.getElementById("apple-alert-keyframes")) {
      const el = document.createElement("style");
      el.id = "apple-alert-keyframes";
      el.textContent = KEYFRAMES;
      document.head.appendChild(el);
      styleRef.current = el;
    }
    return () => {
      // keep keyframes alive across remounts
    };
  }, []);

  const successColor = "rgba(22,163,74,1)";
  const errorColor   = "rgba(185,28,28,1)";
  const accentColor  = isSuccess ? successColor : errorColor;

  const ringColor    = isSuccess ? "rgba(34,197,94,0.18)" : "rgba(248,113,113,0.12)";
  const borderColor  = isSuccess ? "rgba(34,197,94,0.55)" : "rgba(248,113,113,0.5)";
  const bgColor      = isSuccess ? "rgba(240,253,244,0.97)" : "rgba(255,245,245,0.97)";
  const glowColor    = isSuccess ? "rgba(34,197,94,0.14)" : "rgba(248,113,113,0.10)";

  return (
    <div
      style={{
        borderRadius: 18,
        padding: "14px 16px",
        background: bgColor,
        border: `1px solid ${borderColor}`,
        boxShadow: `0 1px 0 rgba(255,255,255,0.9) inset, 0 18px 45px rgba(15,23,42,0.10), 0 4px 14px ${glowColor}`,
        backdropFilter: "blur(28px) saturate(200%)",
        WebkitBackdropFilter: "blur(28px) saturate(200%)",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        animation: "alertSlideIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
        willChange: "transform, opacity",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Shimmer sweep on entry */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 0.75s ease 0.1s both",
          pointerEvents: "none",
          borderRadius: 18,
        }}
      />

      {/* Icon */}
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: ringColor,
          border: `1.5px solid ${borderColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          animation: "iconPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.12s both, iconPulse 2s ease 1.2s 2",
          // CSS var trick for glow animation
          ["--glow" as any]: glowColor,
          willChange: "transform",
          zIndex: 1,
        }}
      >
        {isSuccess
          ? <CheckIcon color={successColor} />
          : <BangIcon color={errorColor} />
        }
      </div>

      {/* Body */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          zIndex: 1,
          minWidth: 0,
        }}
      >
        {/* Title row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 650,
              letterSpacing: "-0.025em",
              color: "rgba(15,23,42,0.92)",
              fontFamily: "'SF Pro Text', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
              animation: "textReveal 0.4s cubic-bezier(0.4,0,0.2,1) 0.22s both",
            }}
          >
            {title}
          </div>

          {typeof statusCode === "number" && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: 999,
                background: isSuccess ? "rgba(22,163,74,0.07)" : "rgba(185,28,28,0.06)",
                border: `1px solid ${borderColor}`,
                color: accentColor,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontFamily: "'SF Mono', 'DM Mono', monospace",
                flexShrink: 0,
                animation: "textReveal 0.4s cubic-bezier(0.4,0,0.2,1) 0.3s both",
              }}
            >
              {statusCode}
            </span>
          )}
        </div>

        {/* Message */}
        <div
          style={{
            fontSize: 12,
            color: "rgba(55,65,81,0.85)",
            lineHeight: 1.5,
            fontFamily: "'SF Pro Text', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            letterSpacing: "-0.01em",
            animation: "textReveal 0.4s cubic-bezier(0.4,0,0.2,1) 0.30s both",
          }}
        >
          {message}
        </div>

        {/* Raw details */}
        {rawDetails && typeof rawDetails === "object" && (
          <pre
            style={{
              marginTop: 6,
              fontSize: 10,
              padding: "8px 10px",
              borderRadius: 10,
              background: "rgba(15,23,42,0.03)",
              border: "1px dashed rgba(148,163,184,0.55)",
              color: "rgba(30,64,175,0.88)",
              maxHeight: 120,
              overflow: "auto",
              fontFamily: "'SF Mono', 'DM Mono', monospace",
              lineHeight: 1.6,
              animation: "detailsExpand 0.45s cubic-bezier(0.4,0,0.2,1) 0.42s both",
            }}
          >
            {JSON.stringify(rawDetails, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}