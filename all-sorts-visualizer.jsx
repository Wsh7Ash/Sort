import { useState, useEffect } from "react";

// Import all sorting visualizers
import BubbleSort from "./algo-visualizer.jsx";
import HeapSort from "./sorts/heap-sort.jsx";
import CountingSort from "./sorts/counting-sort.jsx";
import RadixSort from "./sorts/radix-sort.jsx";
import ShellSort from "./sorts/shell-sort.jsx";
import TimSort from "./sorts/tim-sort.jsx";
import CocktailSort from "./sorts/cocktail-sort.jsx";
import GnomeSort from "./sorts/gnome-sort.jsx";
import BogoSort from "./sorts/bogo-sort.jsx";

const SORT_ALGORITHMS = {
  bubble: { name: "Bubble Sort", component: BubbleSort, category: "basic", complexity: "O(n²)" },
  selection: { name: "Selection Sort", component: BubbleSort, category: "basic", complexity: "O(n²)" },
  insertion: { name: "Insertion Sort", component: BubbleSort, category: "basic", complexity: "O(n²)" },
  merge: { name: "Merge Sort", component: BubbleSort, category: "divide", complexity: "O(n log n)" },
  quick: { name: "Quick Sort", component: BubbleSort, category: "divide", complexity: "O(n log n)" },
  heap: { name: "Heap Sort", component: HeapSort, category: "advanced", complexity: "O(n log n)" },
  counting: { name: "Counting Sort", component: CountingSort, category: "non-comparison", complexity: "O(n + k)" },
  radix: { name: "Radix Sort", component: RadixSort, category: "non-comparison", complexity: "O(d × (n + k))" },
  shell: { name: "Shell Sort", component: ShellSort, category: "advanced", complexity: "O(n log² n)" },
  tim: { name: "Tim Sort", component: TimSort, category: "hybrid", complexity: "O(n log n)" },
  cocktail: { name: "Cocktail Sort", component: CocktailSort, category: "basic", complexity: "O(n²)" },
  gnome: { name: "Gnome Sort", component: GnomeSort, category: "basic", complexity: "O(n²)" },
  bogo: { name: "Bogo Sort", component: BogoSort, category: "experimental", complexity: "O((n+1)!)" }
};

const CATEGORIES = {
  basic: { name: "Basic Sorts", color: "#3b82f6", description: "Simple, educational sorting algorithms" },
  divide: { name: "Divide & Conquer", color: "#8b5cf6", description: "Recursive divide-and-conquer approaches" },
  advanced: { name: "Advanced", color: "#10b981", description: "Complex, efficient algorithms" },
  "non-comparison": { name: "Non-Comparison", color: "#f59e0b", description: "Sorts that don't compare elements" },
  hybrid: { name: "Hybrid", color: "#06b6d4", description: "Combination of multiple approaches" },
  experimental: { name: "Experimental", color: "#ef4444", description: "Educational/inefficient algorithms" }
};

export default function AllSortsVisualizer() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bubble");
  const [viewMode, setViewMode] = useState("single"); // single, grid, compare
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAlgorithms = Object.entries(SORT_ALGORITHMS).filter(([key, algo]) => {
    const matchesCategory = selectedCategory === "all" || algo.category === selectedCategory;
    const matchesSearch = algo.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const SelectedComponent = SORT_ALGORITHMS[selectedAlgorithm]?.component || BubbleSort;

  return (
    <div style={{
      minHeight: "100vh", background: "#030712",
      fontFamily: "'Courier New', monospace", color: "#e2e8f0"
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(90deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        borderBottom: "2px solid #1e3a5f", padding: "20px 24px"
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <h1 style={{ 
            color: "#38bdf8", fontSize: "32px", margin: "0 0 8px 0", textAlign: "center",
            textShadow: "0 0 20px rgba(56,189,248,0.5)"
          }}>
            ◈ COMPREHENSIVE SORTING VISUALIZER ◈
          </h1>
          <p style={{ 
            color: "#64748b", fontSize: "16px", margin: "0", textAlign: "center"
          }}>
            Interactive visualization of 13+ sorting algorithms with real-time execution
          </p>
        </div>
      </div>

      {/* Navigation and Controls */}
      <div style={{
        background: "#0d1117", borderBottom: "1px solid #1e3a5f", padding: "16px 24px"
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", gap: "20px", alignItems: "center" }}>
          {/* View Mode Selector */}
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { id: "single", name: "Single View", icon: "🔍" },
              { id: "grid", name: "Grid View", icon: "⚡" },
              { id: "compare", name: "Compare", icon: "⚖️" }
            ].map(mode => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                style={{
                  padding: "8px 16px",
                  background: viewMode === mode.id ? "rgba(56,189,248,0.2)" : "transparent",
                  border: `1px solid ${viewMode === mode.id ? "#38bdf8" : "#1e3a5f"}`,
                  color: viewMode === mode.id ? "#38bdf8" : "#64748b",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s"
                }}
              >
                <span>{mode.icon}</span>
                <span>{mode.name}</span>
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span style={{ color: "#64748b", fontSize: "12px" }}>Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                background: "#0f172a",
                border: "1px solid #1e3a5f",
                color: "#e2e8f0",
                padding: "6px 12px",
                borderRadius: "4px",
                fontSize: "12px"
              }}
            >
              <option value="all">All Categories</option>
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <option key={key} value={key}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div style={{ flex: 1, maxWidth: "300px" }}>
            <input
              type="text"
              placeholder="Search algorithms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                background: "#0f172a",
                border: "1px solid #1e3a5f",
                color: "#e2e8f0",
                padding: "6px 12px",
                borderRadius: "4px",
                fontSize: "12px"
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px" }}>
        {viewMode === "single" && (
          <div style={{ display: "flex", gap: "20px" }}>
            {/* Algorithm Selector Sidebar */}
            <div style={{
              width: "320px",
              background: "#0d1117",
              border: "1px solid #1e3a5f",
              borderRadius: "8px",
              padding: "20px",
              height: "fit-content",
              maxHeight: "80vh",
              overflowY: "auto"
            }}>
              <h2 style={{ color: "#38bdf8", fontSize: "16px", margin: "0 0 16px 0" }}>
                Select Algorithm
              </h2>
              
              {Object.entries(CATEGORIES).map(([catKey, category]) => {
                const categoryAlgorithms = filteredAlgorithms.filter(([key, algo]) => algo.category === catKey);
                if (categoryAlgorithms.length === 0) return null;
                
                return (
                  <div key={catKey} style={{ marginBottom: "20px" }}>
                    <div style={{
                      color: category.color,
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}>
                      <div style={{
                        width: "8px", height: "8px",
                        background: category.color,
                        borderRadius: "50%"
                      }} />
                      {category.name}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {categoryAlgorithms.map(([key, algo]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedAlgorithm(key)}
                          style={{
                            padding: "10px 12px",
                            background: selectedAlgorithm === key ? "rgba(56,189,248,0.1)" : "transparent",
                            border: `1px solid ${selectedAlgorithm === key ? "#38bdf8" : "#1e293b"}`,
                            color: selectedAlgorithm === key ? "#38bdf8" : "#64748b",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "11px",
                            textAlign: "left",
                            transition: "all 0.2s",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}
                        >
                          <span>{algo.name}</span>
                          <span style={{ fontSize: "9px", color: "#475569" }}>{algo.complexity}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Algorithm Visualizer */}
            <div style={{ flex: 1 }}>
              <SelectedComponent />
            </div>
          </div>
        )}

        {viewMode === "grid" && (
          <div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
              gap: "20px"
            }}>
              {filteredAlgorithms.map(([key, algo]) => {
                const Component = algo.component;
                return (
                  <div key={key} style={{
                    background: "#0d1117",
                    border: "1px solid #1e3a5f",
                    borderRadius: "8px",
                    overflow: "hidden",
                    height: "600px"
                  }}>
                    <div style={{
                      background: CATEGORIES[algo.category]?.color || "#1e3a5f",
                      padding: "12px",
                      borderBottom: "1px solid #1e3a5f"
                    }}>
                      <h3 style={{ color: "white", fontSize: "14px", margin: 0 }}>
                        {algo.name}
                      </h3>
                      <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "11px", margin: "4px 0 0 0" }}>
                        {algo.complexity} • {CATEGORIES[algo.category]?.name}
                      </p>
                    </div>
                    <div style={{ height: "calc(100% - 60px)", transform: "scale(0.8)", transformOrigin: "top left" }}>
                      <Component />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === "compare" && (
          <div>
            <div style={{
              background: "#0d1117",
              border: "1px solid #1e3a5f",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "20px"
            }}>
              <h2 style={{ color: "#38bdf8", fontSize: "18px", margin: "0 0 16px 0" }}>
                Algorithm Comparison Mode
              </h2>
              <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
                Select 2-4 algorithms to compare their performance side by side.
              </p>
            </div>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
              gap: "20px"
            }}>
              {["bubble", "quick", "heap", "merge"].map(key => {
                const algo = SORT_ALGORITHMS[key];
                const Component = algo.component;
                return (
                  <div key={key} style={{
                    background: "#0d1117",
                    border: "1px solid #1e3a5f",
                    borderRadius: "8px",
                    overflow: "hidden"
                  }}>
                    <div style={{
                      background: CATEGORIES[algo.category]?.color || "#1e3a5f",
                      padding: "12px",
                      borderBottom: "1px solid #1e3a5f"
                    }}>
                      <h3 style={{ color: "white", fontSize: "16px", margin: 0 }}>
                        {algo.name}
                      </h3>
                    </div>
                    <div style={{ height: "500px" }}>
                      <Component />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
