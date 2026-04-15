# The Binary State Collapse 🔢

**A Comparative Visualization of Algorithmic vs. Heuristic Search Protocols**

The Binary State Collapse is an interactive, browser-based educational tool designed to visualize the efficiency of **Binary Search (O(log n))** compared to human intuition. Set within a 0–100 state space, the application allows users to experience both ends of a search algorithm: acting as the oracle for a machine, or testing their own heuristic guessing against mathematical perfection.

## 🚀 Features

### 🤖 Mode A: Machine Observer (Algorithmic Search)
* **You hold the secret:** Pick a number between 0 and 100 in your head.
* **The Machine guesses:** The algorithm will attempt to find your number by proposing the optimal midpoint.
* **Provide Feedback:** Tell the machine if its guess is "Too Low", "Too High", or "Correct".
* **Live Telemetry:** Watch the "Entropy" percentage drop as the machine mathematically eliminates impossible states and collapses the grid in real-time.

### 🧠 Mode B: Human Observer (Heuristic Search)
* **The Machine holds the secret:** A hidden integer is generated.
* **You guess:** Input your best guesses to find the target number.
* **Visual Feedback:** The grid dynamically updates, visually blocking out numbers that are too high or too low based on your previous guesses.
* **Performance Analysis:** Upon completion, the system calculates your search efficiency by comparing your total steps against the theoretical optimal algorithm capability (7 steps for 101 items).

### 🎨 UI/UX Highlights
* **Responsive Grid Visualization:** A clean, CSS-Grid powered number matrix that visually represents the current search space.
* **Terminal-Inspired Aesthetics:** Uses monospace typography (`Roboto Mono`, `IBM Plex Mono`), soft backgrounds, and distinct color-coded states for collapsed data bounds.
* **Zero Dependencies:** Built entirely with Vanilla JavaScript, HTML5, and modern CSS3.

## 🛠️ Tech Stack

* **HTML5:** Semantic structure and accessibility considerations.
* **CSS3:** Modern layouts using CSS Grid & Flexbox, CSS Custom Properties (variables) for theming, and responsive design.
* **JavaScript (ES6+):** State management, DOM manipulation, and search logic without any external libraries or frameworks.

## 📥 How to Run

Because this project is built with purely native web technologies, no build steps or local servers are strictly required.

1. Clone or download this repository.
2. Ensure `index.html`, `style.css`, and `script.js` are in the same directory.
3. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).

## 📂 Project Structure

```text
├── index.html   # The main application shell and UI structure
├── style.css    # Styling, theming, and responsive grid layouts
└── script.js    # Application logic, state management, and DOM interactions
