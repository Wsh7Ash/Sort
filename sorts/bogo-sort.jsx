import { useState, useEffect, useRef, useCallback } from "react";

function generateArray(size) {
  return Array.from({ length: size }, (_, i) => i + 1); // Start with sorted array for better visualization
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export default function BogoSortVisualizer() {
  const [arraySize, setArraySize] = useState(8); // Small size for bogo sort
  const [speed, setSpeed] = useState(20); // Lower speed default
  const [arr, setArr] = useState(() => generateArray(8));
  const [colors, setColors] = useState({});
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [stats, setStats] = useState({ attempts: 0, comparisons: 0 });
  const [logLines, setLogLines] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const stopRef = useRef(false);
  const logRef = useRef(null);

  const addLog = useCallback((msg, type = "info") => {
    setLogLines((prev) => {
      const next = [...prev.slice(-15), { msg, type, id: Date.now() + Math.random() }];
      return next;
    });
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logLines]);

  const reset = useCallback((size = arraySize) => {
    stopRef.current = true;
    setTimeout(() => {
      const newArr = generateArray(size);
      // Shuffle the initial array
      for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      setArr(newArr);
      setColors({});
      setRunning(false);
      setDone(false);
      setStats({ attempts: 0, comparisons: 0 });
      setLogLines([{ msg: `> Array regenerated (n=${size}) - WARNING: Bogo sort is extremely inefficient!`, type: "error", id: Date.now() }]);
      setIsShuffling(false);
      stopRef.current = false;
    }, 100);
  }, [arraySize]);

  useEffect(() => { reset(arraySize); }, [arraySize]);

  const delay = useCallback(() => sleep(Math.max(10, 1000 - speed * 9)), [speed]);

  const updateArr = (a) => setArr([...a]);
  const updateColors = (c) => setColors({ ...c });

  function isSorted(a) {
    for (let i = 1; i < a.length; i++) {
      if (a[i] < a[i - 1]) return false;
    }
    return true;
  }

  function shuffleArray(a) {
    const shuffled = [...a];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  async function bogoSort(a, cmp, att) {
    addLog("Starting Bogo Sort - randomly shuffling until sorted!", "system");
    addLog("⚠️ This may take a very long time for larger arrays!", "error");
    
    while (!isSorted(a)) {
      if (stopRef.current) return;
      
      setIsShuffling(true);
      att(); 
      addLog(`Attempt #${stats.attempts + 1}: Shuffling array...`, "swap");
      
      // Highlight all elements during shuffle
      updateColors(Object.fromEntries(a.map((_, i) => [i, "compare"])));
      await delay();
      
      // Shuffle the array
      const shuffled = shuffleArray(a);
      for (let i = 0; i < a.length; i++) {
        a[i] = shuffled[i];
      }
      updateArr(a);
      
      await delay();
      
      // Check if sorted
      let sorted = true;
      for (let i = 1; i < a.length; i++) {
        cmp();
        if (a[i] < a[i - 1]) {
          sorted = false;
          updateColors({ [i]: "swap", [i - 1]: "swap" });
          addLog(`Not sorted: a[${i-1}]=${a[i-1]} > a[${i}]=${a[i]}`);
          break;
        }
      }
      
      if (sorted) {
        updateColors(Object.fromEntries(a.map((_, i) => [i, "sorted"])));
        addLog("✓ Array is sorted!", "found");
        break;
      }
      
      await delay();
      updateColors({});
      setIsShuffling(false);
    }
    
    setIsShuffling(false);
    updateColors({ ...Object.fromEntries(a.map((_, i) => [i, "sorted"])) });
  }

  const run = async () => {
    if (running) return;
    setRunning(true); setDone(false);
    stopRef.current = false;
    setLogLines([{ msg: "> Starting Bogo Sort...", type: "system", id: Date.now() }]);
    const a = [...arr];
    let attempts = 0, comparisons = 0;
    const att = () => { attempts++; setStats((s) => ({ ...s, attempts: attempts })); };
    const cmp = () => { comparisons++; setStats((s) => ({ ...s, comparisons: comparisons })); };

    await bogoSort(a, cmp, att);
    
    if (!stopRef.current) {
      setDone(true);
      addLog(`> Done! ${attempts} attempts, ${comparisons} comparisons.`, "found");
    }
    setRunning(false);
  };

  const COLOR_MAP = {
    compare: "#f59e0b",
    swap: "#ef4444",
    sorted: "#10b981",
    pivot: "#a855f7",
    visited: "#374151",
  };

  const maxVal = Math.max(...arr);

  return (
    <div style={{
      minHeight: "100vh", background: "#030712",
      fontFamily: "'Courier New', monospace", color: "#e2e8f0",
      display: "flex", flexDirection: "column", padding: "20px"
    }}>
      <div style={{
        background: "linear-gradient(90deg, #dc2626 0%, #ea580c 50%, #dc2626 100%)",
        borderBottom: "1px solid #1e3a5f", padding: "16px 24px",
        borderRadius: "8px 8px 0 0", marginBottom: "20px"
      }}>
        <h1 style={{ color: "#fbbf24", fontSize: "24px", margin: 0, textAlign: "center" }}>
          ⚠️ BOGO SORT VISUALIZER ⚠️
        </h1>
        <p style={{ color: "#fca5a5", fontSize: "14px", margin: "8px 0 0 0", textAlign: "center" }}>
          Time: O((n+1)!) | Space: O(1) | Stable: No | EXTREMELY INEFFICIENT
        </p>
        <p style={{ color: "#ef4444", fontSize: "12px", margin: "4px 0 0 0", textAlign: "center", fontWeight: "bold" }}>
          EDUCATIONAL PURPOSES ONLY - DO NOT USE IN PRODUCTION!
        </p>
        {isShuffling && (
          <p style={{ color: "#fbbf24", fontSize: "12px", margin: "4px 0 0 0", textAlign: "center" }}>
            🎲 SHUFFLING... 🎲
          </p>
        )}
      </div>

      <div style={{ display: "flex", gap: "20px", flex: 1 }}>
        {/* Controls */}
        <div style={{
          width: "280px", background: "#0d1117", border: "1px solid #dc2626",
          borderRadius: "8px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px"
        }}>
          <div>
            <label style={{ color: "#fca5a5", fontSize: "12px", display: "block", marginBottom: "8px" }}>
              Array Size: {arraySize} (Keep small!)
            </label>
            <input type="range" min="3" max="10" value={arraySize} disabled={running}
              onChange={(e) => setArraySize(+e.target.value)}
              style={{ width: "100%", accentColor: "#ef4444" }} />
          </div>

          <div>
            <label style={{ color: "#fca5a5", fontSize: "12px", display: "block", marginBottom: "8px" }}>
              Speed: {speed}%
            </label>
            <input type="range" min="1" max="50" value={speed}
              onChange={(e) => setSpeed(+e.target.value)}
              style={{ width: "100%", accentColor: "#ef4444" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button onClick={run} disabled={running}
              style={{
                padding: "12px", background: running ? "#1e293b" : "linear-gradient(135deg, #dc2626, #ea580c)",
                border: "none", color: running ? "#475569" : "white", cursor: running ? "not-allowed" : "pointer",
                fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", borderRadius: "6px",
                fontFamily: "inherit", transition: "all 0.2s"
              }}>
              {running ? "🎲 SHUFFLING..." : "🎲 START SHUFFLING"}
            </button>
            <button onClick={() => reset()} disabled={running && !stopRef.current}
              style={{
                padding: "10px", background: "transparent", border: "1px solid #dc2626",
                color: "#fca5a5", cursor: "pointer", fontSize: "11px", letterSpacing: "1px",
                textTransform: "uppercase", borderRadius: "6px", fontFamily: "inherit"
              }}>⟳ RESET</button>
            <button onClick={() => { stopRef.current = true; setRunning(false); }} disabled={!running}
              style={{
                padding: "10px", background: "transparent", border: "1px solid #ef4444",
                color: "#ef4444", cursor: "pointer", fontSize: "11px", letterSpacing: "1px",
                textTransform: "uppercase", borderRadius: "6px", fontFamily: "inherit"
              }}>⏸ STOP</button>
          </div>

          <div style={{ background: "#450a0a", border: "1px solid #dc2626", borderRadius: "6px", padding: "12px" }}>
            <h3 style={{ color: "#fca5a5", fontSize: "12px", margin: "0 0 8px 0" }}>STATS</h3>
            <div style={{ fontSize: "11px", lineHeight: "1.8" }}>
              <div><span style={{ color: "#fca5a5" }}>Attempts: </span><span style={{ color: "#fbbf24" }}>{stats.attempts}</span></div>
              <div><span style={{ color: "#fca5a5" }}>Comparisons: </span><span style={{ color: "#ef4444" }}>{stats.comparisons}</span></div>
            </div>
          </div>

          <div>
            <h3 style={{ color: "#fca5a5", fontSize: "12px", margin: "0 0 8px 0" }}>LEGEND</h3>
            {[
              ["#f59e0b", "Shuffling"],
              ["#ef4444", "Not Sorted"],
              ["#10b981", "Sorted!"],
              ["#374151", "Normal"],
            ].map(([c, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <div style={{ width: 10, height: 10, background: c, borderRadius: "2px" }} />
                <span style={{ fontSize: "10px", color: "#fca5a5" }}>{l}</span>
              </div>
            ))}
          </div>

          <div style={{ background: "#450a0a", border: "1px solid #dc2626", borderRadius: "6px", padding: "12px" }}>
            <h3 style={{ color: "#fca5a5", fontSize: "12px", margin: "0 0 8px 0" }}>⚠️ WARNING</h3>
            <p style={{ color: "#ef4444", fontSize: "10px", lineHeight: "1.5", margin: 0 }}>
              Bogo sort has O((n+1)!) time complexity. For n=8, it may require up to 362,880 attempts! 
              This is purely for educational purposes to demonstrate inefficient algorithms.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Visualizer */}
          <div style={{
            background: "#0d1117", border: "1px solid #dc2626", borderRadius: "8px",
            padding: "24px", flex: 1, display: "flex", alignItems: "flex-end",
            gap: "2px", position: "relative", minHeight: "300px"
          }}>
            {arr.map((val, i) => {
              const colorKey = colors[i];
              const barColor = colorKey ? COLOR_MAP[colorKey] : "#1e3a5f";
              return (
                <div key={i} style={{
                  flex: 1, height: `${(val / maxVal) * 85}%`,
                  background: barColor,
                  boxShadow: colorKey ? `0 0 8px ${barColor}` : "none",
                  transition: "height 0.05s ease, background 0.1s ease, box-shadow 0.1s ease",
                  borderRadius: "2px 2px 0 0", minWidth: "2px",
                  display: "flex", alignItems: "flex-end", justifyContent: "center",
                  paddingBottom: "4px", fontSize: "10px", color: "white", fontWeight: "bold"
                }}>
                  {val}
                </div>
              );
            })}

            {done && (
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                background: "rgba(3,7,18,0.9)", border: "2px solid #10b981",
                padding: "12px 24px", borderRadius: "8px",
                color: "#10b981", fontSize: "16px", letterSpacing: "2px",
                boxShadow: "0 0 30px rgba(16,185,129,0.3)"
              }}>
                🎉 FINALLY SORTED! 🎉
              </div>
            )}
          </div>

          {/* Log */}
          <div style={{
            background: "#0d1117", border: "1px solid #dc2626", borderRadius: "8px",
            padding: "16px", height: "150px", overflow: "hidden"
          }}>
            <h3 style={{ color: "#fca5a5", fontSize: "12px", margin: "0 0 8px 0" }}>SHUFFLE LOG</h3>
            <div ref={logRef} style={{ height: "100px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "2px" }}>
              {logLines.map((l) => (
                <div key={l.id} style={{
                  fontSize: "11px", fontFamily: "monospace", lineHeight: "1.5",
                  color: l.type === "system" ? "#38bdf8"
                    : l.type === "swap" ? "#ef4444"
                    : l.type === "found" ? "#10b981"
                    : l.type === "error" ? "#f87171"
                    : l.type === "pivot" ? "#a855f7"
                    : "#475569"
                }}>
                  {l.msg}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
