import { motion } from "framer-motion";

export function RadioDot({ selected, accent, accentRgb }: { selected: boolean; accent: string; accentRgb: string }) {
  return (
    <div style={{
      width: 22,
      height: 22,
      borderRadius: "50%",
      border: selected
        ? `2px solid ${accent}`
        : "1.5px solid rgba(0,0,0,0.18)",
      background: selected ? accent : "rgba(255,255,255,0.65)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      transition: "all 0.22s cubic-bezier(0.34, 1.2, 0.64, 1)",
      boxShadow: selected ? `0 0 0 4px rgba(${accentRgb}, 0.14)` : "none",
    }}>
      <motion.div
        animate={{ scale: selected ? 1 : 0, opacity: selected ? 1 : 0 }}
        initial={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
        style={{ width: 9, height: 9, borderRadius: "50%", background: "#fff" }}
      />
    </div>
  );
}
