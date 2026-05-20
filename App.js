import React, { useState, useEffect, useRef } from "react";
import storyData from "./data/story.json";

export default function App() {
  const [currentId, setCurrentId] = useState(() => {
    return localStorage.getItem("forestGameProgress") || "scene1";
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [choiceCount, setChoiceCount] = useState(0); // Score/Choices tracker

  const bgMusicRef = useRef(null);
  const clickSoundRef = useRef(new Audio("/assets/audio/click.mp3"));

  const currentScene = storyData.scenes.find((s) => s.id === currentId);

  useEffect(() => {
    localStorage.setItem("forestGameProgress", currentId);
    if (gameStarted) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentId, gameStarted]);

  const playMusic = (path) => {
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
      bgMusicRef.current = null;
    }
    if (path) {
      const audio = new Audio(path);
      audio.loop = true;
      audio.volume = 0.5;
      audio.play().catch((err) => console.warn("Audio error:", err));
      bgMusicRef.current = audio;
    }
  };

  const handleChoice = (nextId) => {
    clickSoundRef.current.currentTime = 0;
    clickSoundRef.current.play().catch(() => {});
    setChoiceCount(prev => prev + 1); // Track decisions
    
    const nextScene = storyData.scenes.find(s => s.id === nextId);
    if (nextScene && nextScene.music !== currentScene.music) {
      playMusic(nextScene.music);
    }
    setCurrentId(nextId);
  };

  const handleRestart = () => {
    localStorage.removeItem("forestGameProgress");
    window.location.reload();
  };

  const downloadReport = () => {
    const reportData = `
==========================================
      FOREST ADVENTURE: SURVIVAL REPORT
==========================================
Status: ${currentScene.choices.length === 0 ? "SUCCESSFULLY ESCAPED" : "STILL TRAPPED"}
Decisions Made: ${choiceCount}
Last Location: ${currentId}
Last Event: ${currentScene.text}
Generated On: ${new Date().toLocaleString()}
==========================================
    `;
    const element = document.createElement("a");
    const file = new Blob([reportData], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "Adventure_Log.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!gameStarted) {
    const hasSavedProgress = localStorage.getItem("forestGameProgress") !== null && localStorage.getItem("forestGameProgress") !== "scene1";
    return (
      <div style={styles.fullScreenWrapper}>
        <style>{`body, html { margin: 0; padding: 0; overflow: hidden; background: black; font-family: 'Segoe UI', Tahoma, sans-serif; }`}</style>
        <div style={{...styles.container, backgroundImage: "url('/assets/images/forest.jpg')"}}>
          <div style={styles.overlay}>
            <div style={styles.glassBox}>
              <h1 style={styles.mainTitle}>FOREST ADVENTURE</h1>
              <div style={styles.buttonGroup}>
                <button style={styles.startButton} onClick={() => { setGameStarted(true); playMusic(currentScene.music); }}>
                  {hasSavedProgress ? "CONTINUE JOURNEY" : "START GAME"}
                </button>
                {hasSavedProgress && <button style={styles.resetButton} onClick={handleRestart}>RESET PROGRESS</button>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.fullScreenWrapper}>
      <style>{`body, html { margin: 0; padding: 0; overflow: hidden; width: 100%; height: 100%; }`}</style>
      
      {showToast && <div style={styles.toast}>💾 Progress Saved...</div>}

      {/* Floating Report Button (Taake player kabhi bhi report nikal sake) */}
      <button onClick={downloadReport} style={styles.floatingReport}>📄 Log Report</button>

      <div style={{ ...styles.container, backgroundImage: `url(${currentScene.image})` }}>
        <div style={styles.overlay}>
          <div style={styles.gameCard}>
            <p style={styles.storyText}>{currentScene.text}</p>
            
            <div style={styles.buttonGroup}>
              {currentScene.choices.map((choice, index) => (
                <button key={index} onClick={() => handleChoice(choice.next)} style={styles.choiceButton}>
                  {choice.text}
                </button>
              ))}
            </div>

            {/* Ending Scene Controls */}
            {currentScene.choices.length === 0 && (
              <div style={{ marginTop: "30px", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "20px" }}>
                <h3 style={{color: "#2ecc71", marginBottom: "15px"}}>Survival Accomplished!</h3>
                <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
                  <button onClick={handleRestart} style={styles.restartButton}>PLAY AGAIN</button>
                  <button onClick={downloadReport} style={styles.reportButton}>DOWNLOAD FINAL REPORT</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  fullScreenWrapper: { width: "100vw", height: "100vh", overflow: "hidden", position: "fixed", top: 0, left: 0 },
  container: { height: "100%", width: "100%", backgroundSize: "cover", backgroundPosition: "center", display: "flex", transition: "1s ease-in-out" },
  overlay: { height: "100%", width: "100%", background: "rgba(0,0,0,0.55)", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" },
  glassBox: { background: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(15px)", padding: "50px", borderRadius: "30px", textAlign: "center", border: "1px solid rgba(255,255,255,0.2)", boxShadow: "0 10px 40px rgba(0,0,0,0.5)" },
  gameCard: { background: "rgba(0, 0, 0, 0.8)", padding: "40px", borderRadius: "25px", maxWidth: "700px", width: "90%", textAlign: "center", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" },
  mainTitle: { color: "#fff", fontSize: "clamp(2rem, 8vw, 3.5rem)", marginBottom: "30px", letterSpacing: "6px", textTransform: "uppercase" },
  startButton: { padding: "16px 45px", fontSize: "1.1rem", cursor: "pointer", borderRadius: "50px", border: "none", background: "#fff", color: "#000", fontWeight: "bold", margin: "10px", transition: "0.3s" },
  resetButton: { padding: "16px 45px", fontSize: "1.1rem", cursor: "pointer", borderRadius: "50px", border: "1px solid #ff4d4d", background: "rgba(255,77,77,0.15)", color: "#ff4d4d", margin: "10px" },
  storyText: { color: "white", fontSize: "clamp(1.1rem, 4vw, 1.5rem)", marginBottom: "35px", lineHeight: "1.7", fontWeight: "300" },
  buttonGroup: { display: "flex", gap: "15px", flexWrap: "wrap", justifyContent: "center" },
  choiceButton: { padding: "14px 32px", cursor: "pointer", borderRadius: "50px", border: "1px solid rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.1)", color: "white", fontSize: "1rem", transition: "0.3s" },
  restartButton: { padding: "12px 30px", background: "#fff", color: "#000", borderRadius: "50px", border: "none", fontWeight: "bold", cursor: "pointer" },
  reportButton: { padding: "12px 30px", background: "#2ecc71", color: "white", borderRadius: "50px", border: "none", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 15px rgba(46, 204, 113, 0.3)" },
  toast: { position: "absolute", top: "25px", left: "50%", transform: "translateX(-50%)", background: "rgba(46, 204, 113, 0.8)", color: "#fff", padding: "10px 25px", borderRadius: "50px", zIndex: 100, fontSize: "0.9rem", fontWeight: "bold" },
  floatingReport: { position: "absolute", bottom: "20px", right: "20px", background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", padding: "8px 18px", borderRadius: "30px", cursor: "pointer", zIndex: 10, backdropFilter: "blur(5px)", fontSize: "0.8rem" }
};