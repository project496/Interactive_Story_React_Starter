import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Ending({ title, text }) {
  const ref = useRef();

  useEffect(() => {
    gsap.from(ref.current, { opacity: 0, y: 50, duration: 1 });
  }, []);

  return (
    <div
      ref={ref}
      style={{
        height: "100vh",
        background: "#000",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
      }}
    >
      <h1 style={{ fontSize: "4rem" }}>{title}</h1>
      <p style={{ fontSize: "1.4rem", maxWidth: 600 }}>{text}</p>
      <button
        onClick={() => window.location.reload()}
        style={{ padding: "15px 50px", fontSize: "1.2rem", marginTop: 30 }}
      >
        PLAY AGAIN
      </button>
    </div>
  );
}
