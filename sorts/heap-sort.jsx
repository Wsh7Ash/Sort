import { useState, useEffect, useRef, useCallback } from "react";

function generateArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export default function HeapSortVisualizer() {
  const [arraySize, setArraySize] = useState(30);
  const [speed, setSpeed] = useState(50);
  const [arr, setArr] = useState(() => generateArray(30));
  const [colors, setColors] = useState({});
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });
  const [logLines, setLogLines] = useState([]);
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
      setStats({ comparisons: 0, swaps: 0 });
      setLogLines([{ msg: `> Array regenerated (n=${size})`, type: "system", id: Date.now() }]);
      stopRef.current = false;
    }, 100);
  }, [arraySize]);

  useEffect(() => { reset(arraySize); }, [arraySize]);

  const delay = useCallback(() => sleep(Math.max(5, 500 - speed * 4.9)), [speed]);

  const updateArr = (a) => setArr([...a]);
  const updateColors = (c) => setColors({ ...c });

  async function heapify(a, n, i, cmp, swp) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
      if (stopRef.current) return;
      updateColors({ [largest]: "compare", [left]: "compare" });
      cmp(); addLog(`Comparing a[${largest}]=${a[largest]} and a[${left}]=${a[left]}`);
      await delay();
      if (a[left] > a[largest]) {
        largest = left;
        addLog(`New largest: a[${largest}]=${a[largest]}`, "swap");
      }
    }

    if (right < n) {
      if (stopRef.current) return;
      updateColors({ [largest]: "compare", [right]: "compare" });
      cmp(); addLog(`Comparing a[${largest}]=${a[largest]} and a[${right}]=${a[right]}`);
      await delay();
      if (a[right] > a[largest]) {
        largest = right;
        addLog(`New largest: a[${largest}]=${a[largest]}`, "swap");
      }
    }

    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      swp(); updateArr(a);
      addLog(`Swapped a[${i}] ↔ a[${largest}]`, "swap");
      await delay();
      await heapify(a, n, largest, cmp, swp);
    }
    updateColors({ [i]: "sorted" });
  }

  async function heapSort(a, cmp, swp) {
    const n = a.length;
    
    // Build heap
    addLog("Building max heap...", "system");
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      if (stopRef.current) return;
      await heapify(a, n, i, cmp, swp);
    }

    // Extract elements from heap
    addLog("Extracting elements from heap...", "system");
    for (let i = n - 1; i > 0; i--) {
      if (stopRef.current) return;
      
      // Move current root to end
      updateColors({ [0]: "pivot", [i]: "compare" });
      await delay();
      [a[0], a[i]] = [a[i], a[0]];
      swp(); updateArr(a);
      addLog(`Moved max element ${a[i]} to position ${i}`, "swap");
      
      // Call heapify on the reduced heap
      await heapify(a, i, 0, cmp, swp);
      updateColors({ [i]: "sorted" });
    }
    updateColors({ ...Object.fromEntries(a.map((_, i) => [i, "sorted"])) });
  }

  const run = async () => {
    if (running) return;
    setRunning(true); setDone(false);
    stopRef.current = false;
    setLogLines([{ msg: "> Starting Heap Sort...", type: "system", id: Date.now() }]);
    const a = [...arr];
    let comparisons = 0, swaps = 0;
    const cmp = () => { comparisons++; setStats((s) => ({ ...s, comparisons: comparisons })); };
    const swp = () => { swaps++; setStats((s) => ({ ...s, swaps })); };

    await heapSort(a, cmp, swp);
    
    if (!stopRef.current) {
      setDone(true);
      addLog(`> Done! ${comparisons} comparisons, ${swaps} swaps.`, "found");
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
          ◈ HEAP SORT VISUALIZER ◈
        </h1>
        <p style={{ color: "#64748b", fontSize: "14px", margin: "8px 0 0 0", textAlign: "center" }}>
          Time: O(n log n) | Space: O(1) | Stable: No | In-place: Yes
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
              <div><span style={{ color: "#475569" }}>Swaps: </span><span style={{ color: "#ef4444" }}>{stats.swaps}</span></div>
            </div>
          </div>

          <div>
            <h3 style={{ color: "#64748b", fontSize: "12px", margin: "0 0 8px 0" }}>LEGEND</h3>
            {[
              ["#f59e0b", "Comparing"],
              ["#a855f7", "Pivot"],
              ["#ef4444", "Swapping"],
              ["#10b981", "Sorted"],
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
