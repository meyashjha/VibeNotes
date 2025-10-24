import {
  Moon,
  Sun,
  Download,
  Type,
  FileText,
  Menu,
  Highlighter,
  Code,
  Image as ImageIcon,
} from "lucide-react";
import { exportToPDF } from "../utils/pdfExport";

const fonts = [
  { value: "caveat", label: "Caveat", class: "font-caveat" },
  { value: "patrick", label: "Patrick Hand", class: "font-patrick" },
  { value: "indie", label: "Indie Flower", class: "font-indie" },
  { value: "kalam", label: "Kalam", class: "font-kalam" },
  { value: "shadows", label: "Shadows", class: "font-shadows" },
];

const pageStyles = [
  { value: "plain", label: "Plain", icon: FileText },
  { value: "ruled", label: "Ruled", icon: FileText },
  { value: "dotted", label: "Dotted", icon: FileText },
  { value: "grid", label: "Grid", icon: FileText },
  { value: "parchment", label: "Parchment", icon: FileText },
];

export default function Toolbar({
  darkMode,
  setDarkMode,
  font,
  setFont,
  pageStyle,
  setPageStyle,
  currentNote,
  sidebarOpen,
  setSidebarOpen,
}) {
  const handleExportPDF = async () => {
    if (currentNote) {
      await exportToPDF(currentNote, "note-content");
    }
  };

  const insertCodeBlock = () => {
    const editor = document.getElementById("note-editor");
    if (editor) {
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      const text = editor.value;
      const before = text.substring(0, start);
      const selected = text.substring(start, end);
      const after = text.substring(end);

      const codeBlock = selected
        ? `\n\`\`\`javascript\n${selected}\n\`\`\`\n`
        : `\n\`\`\`javascript\n// Your code here\n\`\`\`\n`;

      const newValue = before + codeBlock + after;
      editor.value = newValue;

      // Trigger change event
      const event = new Event("input", { bubbles: true });
      editor.dispatchEvent(event);

      // Set cursor position
      const newPos = start + codeBlock.length;
      editor.focus();
      editor.setSelectionRange(newPos, newPos);
    }
  };

  const toggleHighlight = () => {
    const editor = document.getElementById("note-editor");
    if (editor) {
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      const text = editor.value;
      const selected = text.substring(start, end);

      if (selected) {
        const before = text.substring(0, start);
        const after = text.substring(end);
        const highlighted = `===${selected}===`;

        const newValue = before + highlighted + after;
        editor.value = newValue;

        // Trigger change event
        const event = new Event("input", { bubbles: true });
        editor.dispatchEvent(event);

        editor.focus();
        editor.setSelectionRange(start, start + highlighted.length);
      } else {
        alert("Please select text to highlight");
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 flex-wrap gap-3">
        {/* Left section */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>

          <h1 className="text-xl font-bold text-gray-800 dark:text-white font-caveat hidden sm:block">
            ✍️ VibeNotes
          </h1>
        </div>

        {/* Center section - Tools */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Font Picker */}
          <div className="relative group">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1">
              <Type className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <span className="text-sm text-gray-700 dark:text-gray-300 hidden md:inline">
                Font
              </span>
            </button>
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 hidden group-hover:block z-50 min-w-[150px]">
              {fonts.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFont(f.value)}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 ${
                    f.class
                  } text-lg ${
                    font === f.value ? "bg-blue-50 dark:bg-blue-900" : ""
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Page Style Picker */}
          <div className="relative group">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1">
              <FileText className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <span className="text-sm text-gray-700 dark:text-gray-300 hidden md:inline">
                Style
              </span>
            </button>
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 hidden group-hover:block z-50 min-w-[150px]">
              {pageStyles.map((style) => (
                <button
                  key={style.value}
                  onClick={() => setPageStyle(style.value)}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 ${
                    pageStyle === style.value
                      ? "bg-blue-50 dark:bg-blue-900"
                      : ""
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Highlight Tool */}
          <button
            onClick={toggleHighlight}
            className="p-2 hover:bg-yellow-100 dark:hover:bg-yellow-900 rounded-lg transition-colors"
            title="Highlight Selected Text"
          >
            <Highlighter className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Code Block */}
          <button
            onClick={insertCodeBlock}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Insert Code Block"
          >
            <Code className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Insert Image */}
          <button
            onClick={() => {
              const fileInput = document.querySelector(
                'input[type="file"][accept="image/*"]'
              );
              if (fileInput) {
                fileInput.click();
              } else {
                alert("Please switch to Edit mode to insert images");
              }
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Insert Image (or paste/drag in editor)"
          >
            <ImageIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Export PDF */}
          <button
            onClick={handleExportPDF}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Download as PDF"
          >
            <Download className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Right section - Dark Mode */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title={darkMode ? "Light Mode" : "Dark Mode"}
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>
    </div>
  );
}
