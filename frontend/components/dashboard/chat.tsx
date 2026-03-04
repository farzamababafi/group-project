"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "user" | "ai";

type Message = {
  id: string;
  role: Role;
  text: string;
};

// ─── Placeholder messages ─────────────────────────────────────────────────────────────

const PLACEHOLDERS = [
  "How can I help?",
  "Ask me anything about the markets.",
  "What drives S&P 500 volatility?",
  "Explain the VIX index",
  "How does a yield curve inversion work?",
  "What is market breadth?",
  "Compare 2008 vs COVID crash",
  "What is a P/E ratio?",
];

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

// ─── Typing dots ──────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.2 }}
      style={{ display: "flex", gap: "11px", alignItems: "flex-start", padding: "0 18px" }}
    >
      <AvatarAI />
      <div style={{
        padding: "13px 15px", borderRadius: "18px 18px 18px 5px",
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        boxShadow: "0 0 0 0.5px rgba(0,0,0,0.09), 0 2px 12px rgba(0,0,0,0.06)",
        display: "flex", gap: "5px", alignItems: "center",
      }}>
        {[0, 0.15, 0.3].map((delay, i) => (
          <motion.div key={i}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay, ease: "easeInOut" }}
            style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(60,60,67,0.32)" }}
          />
        ))}
      </div>
    </motion.div>
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

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Rotate placeholder every 2 seconds when input is empty
  useEffect(() => {
    if (input.trim().length > 0) return;
    
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [input]);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  };

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", text: trimmed },
    ]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    // ── Plug your API call here ──────────────────────────────────────────────
    // setIsTyping(true);
    // const reply = await fetchFromYourAPI(trimmed);
    // setIsTyping(false);
    // setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "ai", text: reply }]);
    // ────────────────────────────────────────────────────────────────────────
  };

  const activeInput = input.trim().length > 0;

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

        {/* ── Message area (only when there is chat or typing) ── */}
        {(hasMessages || isTyping) && (
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
              {messages.map((m) => (
                <MessageRow key={m.id} message={m} />
              ))}
              <AnimatePresence>
                {isTyping && <TypingDots key="typing" />}
              </AnimatePresence>
            </motion.div>
            <div ref={bottomRef} />
          </div>
        )}

        {/* ── Input bar ── */}
        <div style={{
          padding: "10px 14px 14px",
          ...((hasMessages || isTyping) && { borderTop: "0.5px solid rgba(0,0,0,0.07)" }),
          background: "rgba(247,247,247,0.65)",
        }}>
          <motion.div
            animate={{
              boxShadow: activeInput
                ? "0 0 0 0.5px rgba(0,113,227,0.35), 0 2px 14px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.92)"
                : "0 0 0 0.5px rgba(0,0,0,0.09), 0 2px 14px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.92)",
            }}
            transition={{ duration: 0.2 }}
            style={{
              display: "flex", alignItems: "flex-end", gap: "9px",
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
              borderRadius: "22px", padding: "10px 10px 10px 18px",
            }}
          >
            <div style={{ flex: 1, position: "relative", minWidth: 0 }}>
              <textarea
                ref={textareaRef}
                value={input}
                rows={1}
                placeholder=" "
                onChange={(e) => { setInput(e.target.value); autoResize(); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
                }}
                style={{
                  width: "100%", border: "none", outline: "none", resize: "none",
                  background: "transparent", overflow: "hidden",
                  fontSize: "15px", fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400, color: "#1d1d1f", letterSpacing: "-0.016em",
                  lineHeight: 1.5, maxHeight: "140px",
                  caretColor: "#0071e3", padding: 0,
                }}
              />
              {input.trim().length === 0 && (
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                    pointerEvents: "none",
                    fontSize: "15px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 400,
                    letterSpacing: "-0.016em",
                    lineHeight: 1.5,
                    color: "rgba(60,60,67,0.4)",
                    overflow: "hidden",
                  }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={placeholderIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.4,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {PLACEHOLDERS[placeholderIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Send button */}
            <motion.button
              animate={{
                background: activeInput
                  ? "linear-gradient(145deg, #0071e3, #0058b0)"
                  : "rgba(60,60,67,0.08)",
                boxShadow: activeInput
                  ? "0 2px 10px rgba(0,113,227,0.38)"
                  : "none",
              }}
              transition={{ duration: 0.18 }}
              whileTap={activeInput ? { scale: 0.88 } : {}}
              onClick={() => send(input)}
              disabled={!activeInput}
              style={{
                width: "35px", height: "35px", borderRadius: "50%",
                border: "none", cursor: activeInput ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M14 8L2 2L5.5 8L2 14L14 8Z"
                  fill={activeInput ? "white" : "rgba(60,60,67,0.28)"} />
              </svg>
            </motion.button>
          </motion.div>

        </div>

      </div>
    </>
  );
}
