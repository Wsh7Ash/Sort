# 🔧 Sorting Algorithms Visualizer

A comprehensive interactive visualization tool for 10+ sorting algorithms with real-time animation, performance metrics, and educational insights.

## 🚀 Features

### 📊 Algorithm Coverage
- **Basic Sorts**: Bubble Sort, Selection Sort, Insertion Sort
- **Advanced Sorts**: Merge Sort, Quick Sort, Heap Sort
- **Specialized Sorts**: Counting Sort, Radix Sort, Shell Sort
- **Exotic Sorts**: Cocktail Sort, Gnome Sort, Tim Sort, Bogo Sort

### 🎮 Interactive Controls
- ⚡ **Speed Control**: Adjust visualization speed (1-100%)
- 🎯 **Array Size**: Dynamic array sizing (10-100 elements)
- 🎨 **Data Patterns**: Random, Sorted, Reverse, Nearly Sorted
- ⏸ **Stop/Reset**: Full control over algorithm execution
- 📈 **Real-time Stats**: Comparisons, swaps, time complexity

### 🎨 Visual Features
- 🌈 **Color-coded Operations**: Different colors for comparisons, swaps, sorted elements
- 📊 **Performance Metrics**: Live statistics and complexity analysis
- 📝 **Step-by-step Logs**: Detailed execution trace
- 🎯 **Dark Theme**: Professional dark interface
- 📱 **Responsive Design**: Works on all screen sizes

## 🛠️ Technologies

### Frontend
- **React 18** - Component-based UI framework
- **Vite** - Fast development server and build tool
- **JavaScript/JSX** - Modern ES6+ features
- **CSS3** - Responsive styling with animations

### Backend (C++ Implementation)
- **C++20** - Modern C++ with standard library
- **CMake** - Cross-platform build system
- **STL Algorithms** - Standard library implementations

## 📁 Project Structure

```
Sort/
├── README.md                 # This file
├── package.json             # Node.js dependencies
├── vite.config.js           # Vite configuration
├── index.html              # Entry HTML file
├── src/
│   └── main.jsx           # React application entry
├── sorts/                 # Individual sorting visualizers
│   ├── bubble-sort.jsx
│   ├── selection-sort.jsx
│   ├── insertion-sort.jsx
│   ├── merge-sort.jsx
│   ├── quick-sort.jsx
│   ├── heap-sort.jsx
│   ├── counting-sort.jsx
│   ├── radix-sort.jsx
│   ├── shell-sort.jsx
│   ├── cocktail-sort.jsx
│   ├── gnome-sort.jsx
│   ├── tim-sort.jsx
│   └── bogo-sort.jsx
├── algo-visualizer.jsx     # Single algorithm viewer
├── all-sorts-visualizer.jsx # All algorithms comparison
└── cpp/                   # C++ implementations
    ├── CMakeLists.txt
    ├── sorting_algorithms.h
    └── sorting_demo.cpp
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Sort&Search/Sort
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🎯 Usage Guide

### Individual Algorithm View
1. Select any sorting algorithm from the sidebar
2. Adjust array size and data pattern
3. Click "START" to begin visualization
4. Use "STOP" to pause execution
5. Click "RESET" to generate new data

### Comparison View
1. Use the "All Sorts Visualizer"
2. See all algorithms running simultaneously
3. Compare performance side-by-side
4. Identify best performers for different data patterns

### Controls
- **Speed Slider**: Control animation speed (1-100%)
- **Array Size**: Set number of elements (10-100)
- **Data Pattern**: Choose initial data arrangement
- **START**: Begin sorting animation
- **STOP**: Pause current algorithm
- **RESET**: Generate new random array

## 📊 Algorithm Complexity

| Algorithm | Best | Average | Worst | Space | Stable |
|------------|-------|----------|--------|-------|--------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | ❌ |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅ |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | ❌ |
| Counting Sort | O(n+k) | O(n+k) | O(n+k) | O(k) | ✅ |
| Radix Sort | O(nk) | O(nk) | O(nk) | O(n+k) | ✅ |
| Shell Sort | O(n log n) | O(n^1.3) | O(n²) | O(1) | ❌ |
| Cocktail Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| Gnome Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| Tim Sort | O(n) | O(n log n) | O(n log n) | O(n) | ✅ |
| Bogo Sort | O(n!) | O(n!) | O(n!) | O(1) | ❌ |

## 🎨 Color Legend

| Color | Meaning |
|-------|---------|
| 🔵 Blue | Default/Unsorted element |
| 🔴 Red | Element being compared |
| 🟢 Green | Element being swapped |
| 🟡 Yellow | Currently selected element |
| 🟣 Purple | Sorted element |
| ⚪ White | Pivot element (Quick Sort) |

## 🛠️ C++ Implementation

### Building C++ Version

```bash
cd cpp
mkdir build && cd build
cmake ..
make
./sorting_demo
```

### Features
- **Template-based**: Works with any data type
- **Performance optimized**: Efficient implementations
- **Benchmarks**: Built-in timing and comparison
- **Educational**: Clear, commented code

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Adding New Algorithms
1. Create new JSX file in `sorts/` directory
2. Follow the existing component structure
3. Add to `all-sorts-visualizer.jsx`
4. Update README.md with algorithm details
5. Test thoroughly

## 📝 Educational Value

This visualizer helps students and developers:
- **Understand** algorithm behavior visually
- **Compare** different sorting strategies
- **Learn** time and space complexity
- **Identify** best use cases for each algorithm
- **Practice** algorithm implementation

## 🎯 Learning Outcomes

After using this visualizer, you'll understand:
- How different sorting algorithms work step-by-step
- Why some algorithms are faster than others
- The trade-offs between time and space complexity
- When to use each sorting algorithm
- The importance of data patterns in performance

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.


