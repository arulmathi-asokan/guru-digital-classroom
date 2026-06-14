# Guru Digital Classroom Whiteboard

A modern, interactive digital classroom whiteboard featuring real-time handwriting-to-text recognition across multiple languages.

Designed for schools and digital learning, students can write naturally on a stylus-friendly canvas (via mouse, tablet, or touch screen) and watch their handwritten scribbles instantly convert into clean, formatted digital text right where they wrote it.

---

## 🚀 Key Features

*   **In-Place OCR Conversion**: Handwritten strokes are dynamically recognized and replaced *directly on the canvas* in their original position. The text size automatically auto-scales to match the dimensions of the handwriting.
*   **Searchable Multi-Language Selector**: Search and select from supported languages including **English, Tamil, Telugu, Kannada, and Hindi**.
*   **Whiteboard Toolkit**:
    *   **Pen tool** for writing.
    *   **Highlighter tool** for highlighting (uses a semi-transparent layer).
    *   **Eraser tool** that detects collisions with both stroke lines and digital text boxes.
    *   **Custom Palette**: Six curated colors and a stroke width range slider.
*   **Advanced Action History (Undo/Redo)**: A robust action-log stack supports undoing/redoing drawing, erasing, clearing, and recognition actions.
*   **Ruled Background**: A realistic lined school board layout with ruled lines and a margin line to guide students' writing.
*   **Multi-Page Support**: Easily create, manage, and navigate through up to 10 canvas pages.
*   **Aesthetic Design**: Fully polished user interface utilizing HSL colors, responsive layouts, transitions, and native **Dark Mode** toggle.
*   **Classroom Utilities**: Student name input field, **Save PNG** to export active pages, and browser-optimized **Print PDF** layout.

---

## 🛠️ Setup & Running Locally

The project uses a lightweight Node.js Express server to host the static files and proxy handwriting coordinates to Google's API (bypassing browser CORS limitations).

### Requirements
*   Node.js 18 or later.

### Installation & Execution
1.  Open your terminal inside the project root directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the classroom server:
    ```bash
    npm start
    ```
4.  Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)** (or the custom port configured in environment variables).

---

## 🔒 Security & Performance Features
*   **Self-Hosted Proxy**: Standard browser requests to Google Input Tools are blocked by CORS policies. The Node backend forwards ink arrays server-to-server securely.
*   **Rate Limiting**: Includes a built-in rate-limiting middleware to prevent API abuse.
*   **Headers & Limits**: Implements basic security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Content-Security-Policy`) and strict JSON payload size limits.
