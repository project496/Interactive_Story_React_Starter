import React from "react";

export default function ProgressBar({ value }) {
  return (
    <div style={{ width: 220, height: 14, background: "#222", borderRadius: 20 }}>
      <div
        style={{
          width: `${value}%`,
          height: "100%",
          background: value > 30 ? "#2ecc71" : "#e74c3c",
          borderRadius: 20,
          transition: "0.4s"
        }}
      />
    </div>
  );
}
