"use client";

import { motion } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "user" | "ai";

type Message = {
  id: string;
  role: Role;
  text: string;
};

// ─── Avatars ──────────────────────────────────────────────────────────────────

function AvatarAI() {
  return (
    <div style={{
      width: "30px", height: "30px", borderRadius: "50%", flexShrink: 0,
      background: "linear-gradient(145deg, #1d1d1f, #3d3d3f)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L13.5 8.5L20 7L15.5 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L8.5 12L4 7L10.5 8.5L12 2Z"
          fill="white" fillOpacity="0.92" />
      </svg>
    </div>
  );
}

function AvatarUser() {
  return (
    <div style={{
      width: "30px", height: "30px", borderRadius: "50%", flexShrink: 0,
      background: "linear-gradient(145deg, #0071e3, #0058b0)",
      boxShadow: "0 2px 8px rgba(0,113,227,0.35)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "12px", fontWeight: 600, color: "white",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      Y
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageRow({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        display: "flex", gap: "11px", alignItems: "flex-start",
        padding: "0 18px",
        flexDirection: isUser ? "row-reverse" : "row",
      }}
    >
      {isUser ? <AvatarUser /> : <AvatarAI />}

      <div style={{
        display: "flex", flexDirection: "column", gap: "4px",
        maxWidth: "74%", alignItems: isUser ? "flex-end" : "flex-start",
      }}>
        <span style={{
          fontSize: "11px", fontWeight: 500, letterSpacing: "-0.01em",
          color: "rgba(60,60,67,0.4)", fontFamily: "'DM Sans', sans-serif",
        }}>
          {isUser ? "You" : "Aria"}
        </span>

        <div style={{
          padding: "11px 15px",
          fontSize: "14px", lineHeight: 1.65,
          letterSpacing: "-0.015em", fontWeight: 400,
          fontFamily: "'DM Sans', sans-serif",
          wordBreak: "break-word",
          ...(isUser ? {
            borderRadius: "18px 18px 5px 18px",
            background: "linear-gradient(145deg, #0071e3, #0058b0)",
            color: "rgba(255,255,255,0.97)",
            boxShadow: "0 4px 16px rgba(0,113,227,0.25), inset 0 1px 0 rgba(255,255,255,0.12)",
          } : {
            borderRadius: "18px 18px 18px 5px",
            background: "rgba(255,255,255,0.82)",
            color: "#1d1d1f",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            boxShadow: "0 0 0 0.5px rgba(0,0,0,0.08), 0 2px 12px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)",
          }),
        }}>
          {message.text}
        </div>
      </div>
    </motion.div>
  );
}


// ─── Chat ─────────────────────────────────────────────────────────────────────

export function Chat({ recommendationText }: { recommendationText: string }) {
  const message: Message = {
    id: "ai",
    role: "ai",
    text: recommendationText?.trim() || "No recommendation available.",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        .aria-scroll::-webkit-scrollbar { width: 0; }
      `}</style>

      <div style={{
        width: "100%", borderRadius: "20px",
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.88)",
        overflow: "hidden",
        display: "flex", flexDirection: "column",
        fontFamily: "'DM Sans', sans-serif",
      }}>

        <div
          className="aria-scroll"
          style={{
            height: "380px", overflowY: "auto",
            display: "flex", flexDirection: "column",
            padding: "18px 0 10px", gap: "16px",
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <MessageRow key={message.id} message={message} />
          </motion.div>
        </div>
      </div>
    </>
  );
}
