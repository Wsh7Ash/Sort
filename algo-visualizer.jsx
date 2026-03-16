import { useState, useEffect, useRef, useCallback } from "react";

const ALGORITHMS = {
  sort: {
    bubble: "Bubble Sort",
    selection: "Selection Sort",
    insertion: "Insertion Sort",
    merge: "Merge Sort",
    quick: "Quick Sort",
  },
  search: {
    linear: "Linear Search",
    binary: "Binary Search",
  },
};

const DESCRIPTIONS = {
  bubble: { time: "O(n²)", space: "O(1)", stable: true, desc: "Repeatedly swaps adjacent elements if they're in wrong order." },
  selection: { time: "O(n²)", space: "O(1)", stable: false, desc: "Finds minimum element and places it at the beginning each pass." },
  insertion: { time: "O(n²)", space: "O(1)", stable: true, desc: "Builds sorted array one item at a time by inserting into position." },
  merge: { time: "O(n log n)", space: "O(n)", stable: true, desc: "Divides array in half, sorts each half, then merges them." },
  quick: { time: "O(n log n)", space: "O(log n)", stable: false, desc: "Picks a pivot, partitions array around it, recursively sorts." },
  linear: { time: "O(n)", space: "O(1)", stable: true, desc: "Scans each element one by one until target is found." },
  binary: { time: "O(log n)", space: "O(1)", stable: true, desc: "Repeatedly halves sorted array to find target. Requires sorted input." },
};

function generateArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export default function AlgoVisualizer() {
  const [mode, setMode] = useState("sort");
  const [algo, setAlgo] = useState("bubble");
  const [arraySize, setArraySize] = useState(40);
  const [speed, setSpeed] = useState(50);
  const [arr, setArr] = useState(() => generateArray(40));
  const [colors, setColors] = useState({});
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [searchTarget, setSearchTarget] = useState("");
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });
  const [logLines, setLogLines] = useState([]);
  const stopRef = useRef(false);
  const logRef = useRef(null);

  const addLog = useCallback((msg, type = "info") => {
    setLogLines((prev) => {
      const next = [...prev.slice(-30), { msg, type, id: Date.now() + Math.random() }];
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

  // ─── SORT ALGORITHMS ───────────────────────────────────────────────────────
  async function bubbleSort(a, cmp, swp) {
    const n = a.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (stopRef.current) return;
        updateColors({ [j]: "compare", [j + 1]: "compare" });
        cmp(); addLog(`Comparing a[${j}]=${a[j]} and a[${j+1}]=${a[j+1]}`);
        await delay();
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          swp(); updateArr(a);
          addLog(`Swapped → a[${j}]=${a[j]}, a[${j+1}]=${a[j+1]}`, "swap");
          await delay();
        }
      }
      updateColors((prev) => ({ ...prev, [n - 1 - i]: "sorted" }));
    }
    updateColors({ ...Object.fromEntries(a.map((_, i) => [i, "sorted"])) });
  }

  async function selectionSort(a, cmp, swp) {
    const n = a.length;
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        if (stopRef.current) return;
        updateColors({ [minIdx]: "pivot", [j]: "compare" });
        cmp(); addLog(`Min so far: a[${minIdx}]=${a[minIdx]}, checking a[${j}]=${a[j]}`);
        await delay();
        if (a[j] < a[minIdx]) { minIdx = j; addLog(`New min: a[${minIdx}]=${a[minIdx]}`, "swap"); }
      }
      if (minIdx !== i) {
        [a[i], a[minIdx]] = [a[minIdx], a[i]];
        swp(); updateArr(a); addLog(`Placed min ${a[i]} at index ${i}`, "swap");
      }
      updateColors({ [i]: "sorted" }); await delay();
    }
    updateColors({ ...Object.fromEntries(a.map((_, i) => [i, "sorted"])) });
  }

  async function insertionSort(a, cmp, swp) {
    const n = a.length;
    updateColors({ 0: "sorted" });
    for (let i = 1; i < n; i++) {
      const key = a[i];
      let j = i - 1;
      addLog(`Inserting a[${i}]=${key}`);
      while (j >= 0 && a[j] > key) {
        if (stopRef.current) return;
        cmp();
        updateColors({ [j]: "compare", [j + 1]: "compare" });
        addLog(`Shifting a[${j}]=${a[j]} right`);
        a[j + 1] = a[j]; j--;
        swp(); updateArr(a); await delay();
      }
      a[j + 1] = key; updateArr(a);
      updateColors({ ...Object.fromEntries(Array.from({ length: i + 1 }, (_, k) => [k, "sorted"])) });
      await delay();
    }
  }

  async function mergeSort(a, cmp, swp, l = 0, r = a.length - 1) {
    if (l >= r || stopRef.current) return;
    const m = Math.floor((l + r) / 2);
    await mergeSort(a, cmp, swp, l, m);
    await mergeSort(a, cmp, swp, m + 1, r);
    const left = a.slice(l, m + 1), right = a.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    addLog(`Merging [${l}..${m}] and [${m+1}..${r}]`);
    while (i < left.length && j < right.length) {
      if (stopRef.current) return;
      cmp(); updateColors({ [k]: "compare" });
      await delay();
      if (left[i] <= right[j]) { a[k++] = left[i++]; }
      else { a[k++] = right[j++]; swp(); }
      updateArr(a);
    }
    while (i < left.length) { a[k++] = left[i++]; updateArr(a); await delay(); }
    while (j < right.length) { a[k++] = right[j++]; updateArr(a); await delay(); }
    for (let x = l; x <= r; x++) updateColors((p) => ({ ...p, [x]: "sorted" }));
  }

  async function quickSort(a, cmp, swp, l = 0, r = a.length - 1) {
    if (l >= r || stopRef.current) return;
    const pivot = a[r];
    addLog(`Pivot = a[${r}]=${pivot}`, "pivot");
    updateColors((p) => ({ ...p, [r]: "pivot" }));
    let i = l - 1;
    for (let j = l; j < r; j++) {
      if (stopRef.current) return;
      cmp(); updateColors((p) => ({ ...p, [j]: "compare", [r]: "pivot" }));
      await delay();
      if (a[j] < pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        swp(); updateArr(a); addLog(`Swap a[${i}] ↔ a[${j}]`, "swap"); await delay();
      }
    }
    [a[i + 1], a[r]] = [a[r], a[i + 1]];
    swp(); updateArr(a);
    const pi = i + 1;
    updateColors((p) => ({ ...p, [pi]: "sorted" }));
    await quickSort(a, cmp, swp, l, pi - 1);
    await quickSort(a, cmp, swp, pi + 1, r);
  }

  // ─── SEARCH ALGORITHMS ─────────────────────────────────────────────────────
  async function linearSearch(a, target, cmp) {
    addLog(`> Linear search for ${target}`, "system");
    for (let i = 0; i < a.length; i++) {
      if (stopRef.current) return -1;
      updateColors({ [i]: "compare" });
      cmp(); addLog(`Checking a[${i}]=${a[i]}`);
      await delay();
      if (a[i] === target) {
        updateColors({ [i]: "found" });
        addLog(`✓ Found ${target} at index ${i}!`, "found");
        return i;
      }
      updateColors({ [i]: "visited" });
    }
    addLog(`✗ ${target} not found`, "error");
    return -1;
  }

  async function binarySearch(a, target, cmp) {
    const sorted = [...a].sort((x, y) => x - y);
    addLog(`> Binary search (array sorted first)`, "system");
    setArr(sorted);
    await delay(); await delay();
    let lo = 0, hi = sorted.length - 1;
    while (lo <= hi) {
      if (stopRef.current) return -1;
      const mid = Math.floor((lo + hi) / 2);
      const rangeColors = {};
      for (let i = 0; i < sorted.length; i++) {
        if (i < lo || i > hi) rangeColors[i] = "visited";
        else if (i === mid) rangeColors[i] = "pivot";
        else rangeColors[i] = "compare";
      }
      updateColors(rangeColors);
      cmp(); addLog(`Range [${lo}..${hi}], mid=${mid}, a[mid]=${sorted[mid]}`);
      await delay();
      if (sorted[mid] === target) {
        updateColors({ ...rangeColors, [mid]: "found" });
        addLog(`✓ Found ${target} at index ${mid}!`, "found");
        return mid;
      } else if (sorted[mid] < target) {
        addLog(`${sorted[mid]} < ${target}, search right`);
        lo = mid + 1;
      } else {
        addLog(`${sorted[mid]} > ${target}, search left`);
        hi = mid - 1;
      }
    }
    addLog(`✗ ${target} not found`, "error");
    return -1;
  }

  // ─── RUN ───────────────────────────────────────────────────────────────────
  const run = async () => {
    if (running) return;
    setRunning(true); setDone(false);
    stopRef.current = false;
    setLogLines([{ msg: `> Starting ${ALGORITHMS[mode][algo]}...`, type: "system", id: Date.now() }]);
    const a = [...arr];
    let comparisons = 0, swaps = 0;
    const cmp = () => { comparisons++; setStats((s) => ({ ...s, comparisons: comparisons })); };
    const swp = () => { swaps++; setStats((s) => ({ ...s, swaps })); };

    if (mode === "sort") {
      if (algo === "bubble") await bubbleSort(a, cmp, swp);
      else if (algo === "selection") await selectionSort(a, cmp, swp);
      else if (algo === "insertion") await insertionSort(a, cmp, swp);
      else if (algo === "merge") await mergeSort(a, cmp, swp);
      else if (algo === "quick") await quickSort(a, cmp, swp);
      if (!stopRef.current) { setDone(true); addLog(`> Done! ${comparisons} comparisons, ${swaps} swaps.`, "found"); }
    } else {
      const target = parseInt(searchTarget);
      if (isNaN(target)) { addLog("Enter a valid number to search.", "error"); setRunning(false); return; }
      if (algo === "linear") await linearSearch(a, target, cmp);
      else await binarySearch(a, target, cmp);
      if (!stopRef.current) { setDone(true); addLog(`> Done! ${comparisons} comparisons.`, "found"); }
    }
    setRunning(false);
  };

  const COLOR_MAP = {
    compare: "#f59e0b",
    swap: "#ef4444",
    sorted: "#10b981",
    found: "#06b6d4",
    pivot: "#a855f7",
    visited: "#374151",
  };

  const info = DESCRIPTIONS[algo];
  const maxVal = Math.max(...arr);

  return (
    <div style={{
      minHeight: "100vh", background: "#030712",
      fontFamily: "'Courier New', monospace", color: "#e2e8f0",
      display: "flex", flexDirection: "column", padding: "0"
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(90deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        borderBottom: "1px solid #1e3a5f", padding: "16px 24px",
        display: "flex", alignItems: "center", gap: "16px"
      }}>
        <div style={{ display: "flex", gap: "6px" }}>
          {["#ef4444", "#f59e0b", "#10b981"].map((c) => (
            <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <span style={{ color: "#38bdf8", fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase" }}>
          ◈ ALGORITHM VISUALIZER ◈
        </span>
        <span style={{ marginLeft: "auto", color: "#475569", fontSize: "11px" }}>v2.0.1 // C++ logic → JS runtime</span>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{
          width: "260px", background: "#0d1117", borderRight: "1px solid #1e3a5f",
          padding: "20px 16px", display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto"
        }}>
          {/* Mode */}
          <div>
            <div style={{ color: "#64748b", fontSize: "10px", letterSpacing: "3px", marginBottom: "8px" }}>// MODE</div>
            <div style={{ display: "flex", gap: "8px" }}>
              {["sort", "search"].map((m) => (
                <button key={m} onClick={() => { if (!running) { setMode(m); setAlgo(m === "sort" ? "bubble" : "linear"); reset(); } }}
                  style={{
                    flex: 1, padding: "8px", border: `1px solid ${mode === m ? "#38bdf8" : "#1e3a5f"}`,
                    background: mode === m ? "rgba(56,189,248,0.1)" : "transparent",
                    color: mode === m ? "#38bdf8" : "#475569", cursor: "pointer",
                    fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", borderRadius: "4px"
                  }}>{m}</button>
              ))}
            </div>
          </div>

          {/* Algorithm */}
          <div>
            <div style={{ color: "#64748b", fontSize: "10px", letterSpacing: "3px", marginBottom: "8px" }}>// ALGORITHM</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {Object.entries(ALGORITHMS[mode]).map(([key, label]) => (
                <button key={key} onClick={() => { if (!running) setAlgo(key); }}
                  style={{
                    padding: "8px 12px", textAlign: "left",
                    border: `1px solid ${algo === key ? "#a855f7" : "#1e293b"}`,
                    background: algo === key ? "rgba(168,85,247,0.1)" : "transparent",
                    color: algo === key ? "#c084fc" : "#64748b", cursor: "pointer",
                    fontSize: "12px", borderRadius: "4px", transition: "all 0.15s"
                  }}>{label}</button>
              ))}
            </div>
          </div>

          {/* Info */}
          {info && (
            <div style={{ background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: "6px", padding: "12px" }}>
              <div style={{ color: "#64748b", fontSize: "10px", letterSpacing: "3px", marginBottom: "8px" }}>// INFO</div>
              <div style={{ fontSize: "11px", lineHeight: "1.8", color: "#94a3b8" }}>
                <div><span style={{ color: "#f59e0b" }}>time</span>  → {info.time}</div>
                <div><span style={{ color: "#f59e0b" }}>space</span> → {info.space}</div>
                <div><span style={{ color: "#f59e0b" }}>stable</span>→ {info.stable ? "yes" : "no"}</div>
              </div>
              <div style={{ marginTop: "8px", fontSize: "10px", color: "#475569", lineHeight: "1.6" }}>{info.desc}</div>
            </div>
          )}

          {/* Controls */}
          <div>
            <div style={{ color: "#64748b", fontSize: "10px", letterSpacing: "3px", marginBottom: "8px" }}>// CONTROLS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#475569", marginBottom: "4px" }}>
                  <span>Array Size</span><span style={{ color: "#38bdf8" }}>{arraySize}</span>
                </div>
                <input type="range" min="10" max="80" value={arraySize} disabled={running}
                  onChange={(e) => setArraySize(+e.target.value)}
                  style={{ width: "100%", accentColor: "#38bdf8" }} />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#475569", marginBottom: "4px" }}>
                  <span>Speed</span><span style={{ color: "#38bdf8" }}>{speed}%</span>
                </div>
                <input type="range" min="1" max="100" value={speed}
                  onChange={(e) => setSpeed(+e.target.value)}
                  style={{ width: "100%", accentColor: "#38bdf8" }} />
              </div>
              {mode === "search" && (
                <div>
                  <div style={{ fontSize: "10px", color: "#475569", marginBottom: "4px" }}>Target Value</div>
                  <input type="number" value={searchTarget} onChange={(e) => setSearchTarget(e.target.value)}
                    placeholder="e.g. 42" disabled={running}
                    style={{
                      width: "100%", padding: "8px", background: "#0f172a", border: "1px solid #1e3a5f",
                      color: "#38bdf8", fontSize: "13px", borderRadius: "4px", boxSizing: "border-box",
                      outline: "none"
                    }} />
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button onClick={run} disabled={running}
              style={{
                padding: "12px", background: running ? "#1e293b" : "linear-gradient(135deg, #6366f1, #a855f7)",
                border: "none", color: running ? "#475569" : "white", cursor: running ? "not-allowed" : "pointer",
                fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase", borderRadius: "6px",
                fontFamily: "inherit", transition: "all 0.2s",
                boxShadow: running ? "none" : "0 0 20px rgba(99,102,241,0.4)"
              }}>
              {running ? "● RUNNING..." : "▶ EXECUTE"}
            </button>
            <button onClick={() => reset()} disabled={running && !stopRef.current}
              style={{
                padding: "10px", background: "transparent", border: "1px solid #1e3a5f",
                color: "#64748b", cursor: "pointer", fontSize: "11px", letterSpacing: "2px",
                textTransform: "uppercase", borderRadius: "6px", fontFamily: "inherit"
              }}>⟳ RESET</button>
            <button onClick={() => { stopRef.current = true; setRunning(false); }} disabled={!running}
              style={{
                padding: "10px", background: "transparent", border: "1px solid #ef4444",
                color: "#ef4444", cursor: "pointer", fontSize: "11px", letterSpacing: "2px",
                textTransform: "uppercase", borderRadius: "6px", fontFamily: "inherit"
              }}>⏸ STOP</button>
          </div>

          {/* Stats */}
          <div style={{ background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: "6px", padding: "12px" }}>
            <div style={{ color: "#64748b", fontSize: "10px", letterSpacing: "3px", marginBottom: "8px" }}>// STATS</div>
            <div style={{ fontSize: "11px", lineHeight: "2" }}>
              <div><span style={{ color: "#475569" }}>comparisons </span><span style={{ color: "#f59e0b" }}>{stats.comparisons}</span></div>
              {mode === "sort" && <div><span style={{ color: "#475569" }}>swaps       </span><span style={{ color: "#ef4444" }}>{stats.swaps}</span></div>}
            </div>
          </div>

          {/* Legend */}
          <div>
            <div style={{ color: "#64748b", fontSize: "10px", letterSpacing: "3px", marginBottom: "8px" }}>// LEGEND</div>
            {[
              ["#f59e0b", "Comparing"],
              ["#a855f7", "Pivot"],
              ["#ef4444", "Swapping"],
              ["#10b981", "Sorted"],
              ["#06b6d4", "Found"],
              ["#374151", "Visited"],
            ].map(([c, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <div style={{ width: 10, height: 10, background: c, borderRadius: "2px" }} />
                <span style={{ fontSize: "10px", color: "#475569" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Visualizer */}
          <div style={{
            flex: 1, padding: "24px", display: "flex", alignItems: "flex-end",
            gap: "2px", background: "#030712", position: "relative", minHeight: "300px"
          }}>
            {/* Grid lines */}
            {[25, 50, 75, 100].map((p) => (
              <div key={p} style={{
                position: "absolute", left: "24px", right: "24px",
                bottom: `calc(${p}% + 24px - ${p * 0.24}px)`,
                borderTop: "1px solid #0f172a", zIndex: 0
              }} />
            ))}

            {arr.map((val, i) => {
              const colorKey = colors[i];
              const barColor = colorKey ? COLOR_MAP[colorKey] : "#1e3a5f";
              const glowColor = colorKey ? barColor : "transparent";
              return (
                <div key={i} style={{
                  flex: 1, height: `${(val / maxVal) * 85}%`,
                  background: barColor,
                  boxShadow: colorKey ? `0 0 8px ${glowColor}` : "none",
                  transition: "height 0.05s ease, background 0.1s ease, box-shadow 0.1s ease",
                  borderRadius: "2px 2px 0 0", zIndex: 1,
                  minWidth: "2px"
                }} />
              );
            })}

            {done && (
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                background: "rgba(3,7,18,0.9)", border: "1px solid #10b981",
                padding: "12px 24px", borderRadius: "8px",
                color: "#10b981", fontSize: "13px", letterSpacing: "3px",
                boxShadow: "0 0 30px rgba(16,185,129,0.3)"
              }}>
                ✓ COMPLETE
              </div>
            )}
          </div>

          {/* Log */}
          <div style={{
            height: "140px", background: "#0d1117", borderTop: "1px solid #1e3a5f",
            padding: "8px 16px", overflow: "hidden"
          }}>
            <div style={{ color: "#64748b", fontSize: "10px", letterSpacing: "3px", marginBottom: "6px" }}>
              // EXECUTION LOG
            </div>
            <div ref={logRef} style={{ height: "90px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "2px" }}>
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
