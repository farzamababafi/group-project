"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MetricSection } from "./MetricSection";

// ─── Types ───────────────────────────────────────────────────────────────────
type AccordionItem = {
  id: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  content?: React.ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
  allowMultiple?: boolean;
  stockName?: string | null;
};

// ─── Chevron ─────────────────────────────────────────────────────────────────
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <motion.svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ flexShrink: 0 }}
    >
      <path
        d="M4 6L8 10L12 6"
        stroke={open ? "#0071e3" : "rgba(60,60,67,0.45)"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

// ─── Row ─────────────────────────────────────────────────────────────────────
function AccordionRow({
  item,
  open,
  onToggle,
  isFirst,
  isLast,
  stockName,
}: {
  item: AccordionItem;
  open: boolean;
  onToggle: () => void;
  isFirst: boolean;
  isLast: boolean;
  stockName?: string | null;
}) {
  const [pressed, setPressed] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        borderRadius: isFirst && isLast ? "14px" : isFirst ? "14px 14px 0 0" : isLast && !open ? "0 0 14px 14px" : "0",
        overflow: "hidden",
      }}
    >
      {/* Trigger */}
      <motion.button
        onClick={onToggle}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        whileTap={{ scale: 0.995 }}
        style={{
          all: "unset",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          width: "100%",
          padding: "0 18px",
          height: "58px",
          cursor: "pointer",
          boxSizing: "border-box",
          background: open
            ? "rgba(0, 113, 227, 0.04)"
            : "rgba(255,255,255,0.82)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          transition: "background 0.2s ease",
          position: "relative",
        }}
      >
        {/* Icon badge */}
        {item.icon && (
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: open
                ? "linear-gradient(145deg, #0071e3, #0058b0)"
                : "linear-gradient(145deg, rgba(60,60,67,0.12), rgba(60,60,67,0.06))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.25s ease",
              boxShadow: open
                ? "0 2px 8px rgba(0,113,227,0.35)"
                : "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <span
              style={{
                color: open ? "white" : "rgba(60,60,67,0.6)",
                fontSize: "15px",
                transition: "color 0.25s ease",
                display: "flex",
              }}
            >
              {item.icon}
            </span>
          </div>
        )}

        {/* Labels */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily:
                "-apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif",
              fontSize: "15px",
              fontWeight: open ? 590 : 400,
              color: open ? "#0071e3" : "#1d1d1f",
              letterSpacing: "-0.015em",
              lineHeight: 1.3,
              transition: "color 0.2s ease, font-weight 0.2s ease",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {item.label}
          </div>
          {item.sublabel && (
            <div
              style={{
                fontFamily:
                  "-apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif",
                fontSize: "12px",
                fontWeight: 400,
                color: "rgba(60,60,67,0.5)",
                letterSpacing: "-0.008em",
                marginTop: "1px",
              }}
            >
              {item.sublabel}
            </div>
          )}
        </div>

        {/* Open indicator pill */}
        <AnimatePresence>
          {open && (
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.18 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,113,227,0.1)",
                borderRadius: "100px",
                padding: "2px 8px",
                fontSize: "11px",
                fontWeight: 590,
                color: "#0071e3",
                fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
                letterSpacing: "-0.01em",
                flexShrink: 0,
              }}
            >
              Open
            </motion.span>
          )}
        </AnimatePresence>

        <ChevronIcon open={open} />
      </motion.button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] },
              opacity: { duration: 0.22, ease: "easeOut" },
            }}
            style={{
              overflow: "hidden",
              background: "rgba(248,248,250,0.92)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderTop: "0.5px solid rgba(0,113,227,0.12)",
            }}
          >
            <div
              style={{
                padding: "16px 18px 18px",
                minHeight: "480px",
                fontFamily:
                  "-apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif",
                fontSize: "14px",
                color: "rgba(60,60,67,0.75)",
                lineHeight: 1.55,
                letterSpacing: "-0.01em",
              }}
            >
              {item.content ?? (
                <MetricSection sectionId={item.id} stockName={stockName} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Shell ───────────────────────────────────────────────────────────────────
export function Accordion({
  items,
  allowMultiple = false,
  stockName = null,
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div
      style={{
        borderRadius: "16px",
        overflow: "hidden",
        background: "rgba(255,255,255,0.82)",
        boxShadow:
          "0 0 0 0.5px rgba(0,0,0,0.1), 0 2px 12px rgba(0,0,0,0.07), 0 8px 32px rgba(0,0,0,0.04)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {items.map((item, i) => (
        <React.Fragment key={item.id}>
          {i > 0 && (
            <div
              style={{
                height: "0.5px",
                background: "rgba(60,60,67,0.12)",
                margin: "0 18px",
              }}
            />
          )}
          <AccordionRow
            item={item}
            open={openIds.has(item.id)}
            onToggle={() => toggle(item.id)}
            isFirst={i === 0}
            isLast={i === items.length - 1}
            stockName={stockName}
          />
        </React.Fragment>
      ))}
    </div>
  );
}