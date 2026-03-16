import { useState, useEffect, useRef, useCallback } from "react";

function generateArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 50) + 1);
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export default function CountingSortVisualizer() {
  const [arraySize, setArraySize] = useState(30);
  const [speed, setSpeed] = useState(50);
  const [arr, setArr] = useState(() => generateArray(30));
  const [colors, setColors] = useState({});
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [stats, setStats] = useState({ comparisons: 0, operations: 0 });
  const [logLines, setLogLines] = useState([]);
  const [countArray, setCountArray] = useState([]);
  const [showCountArray, setShowCountArray] = useState(false);
  const stopRef = useRef(false);
  const logRef = useRef(null);

  const addLog = useCallback((msg, type = "info") => {
    setLogLines((prev) => {
      const next = [...prev.slice(-20), { msg, type, id: Date.now() + Math.random() }];
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
      setArr(newArr);
      setColors({});
      setRunning(false);
      setDone(false);
      setStats({ comparisons: 0, operations: 0 });
      setLogLines([{ msg: `> Array regenerated (n=${size})`, type: "system", id: Date.now() }]);
      setCountArray([]);
      setShowCountArray(false);
      stopRef.current = false;
    }, 100);
  }, [arraySize]);

  useEffect(() => { reset(arraySize); }, [arraySize]);

  const delay = useCallback(() => sleep(Math.max(5, 500 - speed * 4.9)), [speed]);

  const updateArr = (a) => setArr([...a]);
  const updateColors = (c) => setColors({ ...c });

  async function countingSort(a, cmp, op) {
    const n = a.length;
    const maxVal = Math.max(...a);
    const minVal = Math.min(...a);
    const range = maxVal - minVal + 1;
    
    addLog(`Range: ${minVal} to ${maxVal} (size: ${range})`, "system");
    
    // Create count array
    const count = new Array(range).fill(0);
    setCountArray([...count]);
    setShowCountArray(true);
    
    // Count occurrences
    addLog("Counting occurrences...", "system");
    for (let i = 0; i < n; i++) {
      if (stopRef.current) return;
      updateColors({ [i]: "compare" });
      cmp(); addLog(`Counting a[${i}]=${a[i]}`);
      count[a[i] - minVal]++;
      setCountArray([...count]);
      await delay();
      updateColors({ [i]: "visited" });
    }
    
    // Calculate cumulative count
    addLog("Calculating cumulative counts...", "system");
    for (let i = 1; i < count.length; i++) {
      if (stopRef.current) return;
      count[i] += count[i - 1];
      setCountArray([...count]);
      op(); await delay();
    }
    
    // Build output array
    const output = new Array(n);
    addLog("Building sorted array...", "system");
    for (let i = n - 1; i >= 0; i--) {
      if (stopRef.current) return;
      updateColors({ [i]: "pivot" });
      const val = a[i];
      const pos = count[val - minVal] - 1;
      output[pos] = val;
      count[val - minVal]--;
      setCountArray([...count]);
      op(); addLog(`Placed ${val} at position ${pos}`, "swap");
      await delay();
      updateColors({ [i]: "visited" });
    }
    
    // Copy back to original array
    for (let i = 0; i < n; i++) {
      if (stopRef.current) return;
      a[i] = output[i];
      updateArr(a);
      updateColors({ [i]: "sorted" });
      await delay();
    }
    
    setShowCountArray(false);
    updateColors({ ...Object.fromEntries(a.map((_, i) => [i, "sorted"])) });
  }

  const run = async () => {
    if (running) return;
    setRunning(true); setDone(false);
    stopRef.current = false;
    setLogLines([{ msg: "> Starting Counting Sort...", type: "system", id: Date.now() }]);
    const a = [...arr];
    let comparisons = 0, operations = 0;
    const cmp = () => { comparisons++; setStats((s) => ({ ...s, comparisons: comparisons })); };
    const op = () => { operations++; setStats((s) => ({ ...s, operations: operations })); };

    await countingSort(a, cmp, op);
    
    if (!stopRef.current) {
      setDone(true);
      addLog(`> Done! ${comparisons} comparisons, ${operations} operations.`, "found");
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
        background: "linear-gradient(90deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        borderBottom: "1px solid #1e3a5f", padding: "16px 24px",
        borderRadius: "8px 8px 0 0", marginBottom: "20px"
      }}>
        <h1 style={{ color: "#38bdf8", fontSize: "24px", margin: 0, textAlign: "center" }}>
          ◈ COUNTING SORT VISUALIZER ◈
        </h1>
        <p style={{ color: "#64748b", fontSize: "14px", margin: "8px 0 0 0", textAlign: "center" }}>
          Time: O(n + k) | Space: O(k) | Stable: Yes | Non-comparison based
        </p>
      </div>

      <div style={{ display: "flex", gap: "20px", flex: 1 }}>
        {/* Controls */}
        <div style={{
          width: "280px", background: "#0d1117", border: "1px solid #1e3a5f",
          borderRadius: "8px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px"
        }}>
          <div>
            <label style={{ color: "#64748b", fontSize: "12px", display: "block", marginBottom: "8px" }}>
              Array Size: {arraySize}
            </label>
            <input type="range" min="10" max="50" value={arraySize} disabled={running}
              onChange={(e) => setArraySize(+e.target.value)}
              style={{ width: "100%", accentColor: "#38bdf8" }} />
          </div>

          <div>
            <label style={{ color: "#64748b", fontSize: "12px", display: "block", marginBottom: "8px" }}>
              Speed: {speed}%
            </label>
            <input type="range" min="1" max="100" value={speed}
              onChange={(e) => setSpeed(+e.target.value)}
              style={{ width: "100%", accentColor: "#38bdf8" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button onClick={run} disabled={running}
              style={{
                padding: "12px", background: running ? "#1e293b" : "linear-gradient(135deg, #6366f1, #a855f7)",
                border: "none", color: running ? "#475569" : "white", cursor: running ? "not-allowed" : "pointer",
                fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", borderRadius: "6px",
                fontFamily: "inherit", transition: "all 0.2s"
              }}>
              {running ? "● RUNNING..." : "▶ EXECUTE"}
            </button>
            <button onClick={() => reset()} disabled={running && !stopRef.current}
              style={{
                padding: "10px", background: "transparent", border: "1px solid #1e3a5f",
                color: "#64748b", cursor: "pointer", fontSize: "11px", letterSpacing: "1px",
                textTransform: "uppercase", borderRadius: "6px", fontFamily: "inherit"
              }}>⟳ RESET</button>
            <button onClick={() => { stopRef.current = true; setRunning(false); }} disabled={!running}
              style={{
                padding: "10px", background: "transparent", border: "1px solid #ef4444",
                color: "#ef4444", cursor: "pointer", fontSize: "11px", letterSpacing: "1px",
                textTransform: "uppercase", borderRadius: "6px", fontFamily: "inherit"
              }}>⏸ STOP</button>
          </div>

          <div style={{ background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: "6px", padding: "12px" }}>
            <h3 style={{ color: "#64748b", fontSize: "12px", margin: "0 0 8px 0" }}>STATS</h3>
            <div style={{ fontSize: "11px", lineHeight: "1.8" }}>
              <div><span style={{ color: "#475569" }}>Comparisons: </span><span style={{ color: "#f59e0b" }}>{stats.comparisons}</span></div>
              <div><span style={{ color: "#475569" }}>Operations: </span><span style={{ color: "#ef4444" }}>{stats.operations}</span></div>
            </div>
          </div>

          <div>
            <h3 style={{ color: "#64748b", fontSize: "12px", margin: "0 0 8px 0" }}>LEGEND</h3>
            {[
              ["#f59e0b", "Counting"],
              ["#a855f7", "Placing"],
              ["#ef4444", "Operation"],
              ["#10b981", "Sorted"],
              ["#374151", "Visited"],
            ].map(([c, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <div style={{ width: 10, height: 10, background: c, borderRadius: "2px" }} />
                <span style={{ fontSize: "10px", color: "#475569" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Count Array Display */}
          {showCountArray && countArray.length > 0 && (
            <div style={{
              background: "#0d1117", border: "1px solid #1e3a5f", borderRadius: "8px",
              padding: "16px"
            }}>
              <h3 style={{ color: "#64748b", fontSize: "12px", margin: "0 0 8px 0" }}>COUNT ARRAY</h3>
              <div style={{ display: "flex", gap: "2px", alignItems: "flex-end", height: "60px" }}>
                {countArray.map((count, i) => (
                  <div key={i} style={{
                    flex: 1, background: "#a855f7",
                    height: `${Math.min(count * 10, 50)}px`,
                    borderRadius: "2px", display: "flex", alignItems: "flex-end", justifyContent: "center",
                    paddingBottom: "4px", fontSize: "8px", color: "white"
                  }}>
                    {count > 0 && count}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Visualizer */}
          <div style={{
            background: "#0d1117", border: "1px solid #1e3a5f", borderRadius: "8px",
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
                  borderRadius: "2px 2px 0 0", minWidth: "2px"
                }} />
              );
            })}

            {done && (
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                background: "rgba(3,7,18,0.9)", border: "1px solid #10b981",
                padding: "12px 24px", borderRadius: "8px",
                color: "#10b981", fontSize: "16px", letterSpacing: "2px",
                boxShadow: "0 0 30px rgba(16,185,129,0.3)"
              }}>
                ✓ SORTED
              </div>
            )}
          </div>

          {/* Log */}
          <div style={{
            background: "#0d1117", border: "1px solid #1e3a5f", borderRadius: "8px",
            padding: "16px", height: "150px", overflow: "hidden"
          }}>
            <h3 style={{ color: "#64748b", fontSize: "12px", margin: "0 0 8px 0" }}>EXECUTION LOG</h3>
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
