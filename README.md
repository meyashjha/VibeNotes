# ✍️ VibeNotes - Handwritten Note-Taking App

A beautiful, handwritten-style note-taking Single Page Application (SPA) built with React, Vite, and TailwindCSS.

![VibeNotes](https://img.shields.io/badge/React-18.2-blue)
![Vite](https://img.shields.io/badge/Vite-5.1-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan)

## ✨ Features

### 🎨 Beautiful Handwritten UI
- **5 Handwritten Fonts**: Choose from Caveat, Patrick Hand, Indie Flower, Kalam, and Shadows Into Light
- **5 Page Styles**: Plain, Ruled, Dotted, Grid, and Parchment backgrounds
- **Paper Texture**: Realistic paper texture overlay for authentic feel
- **Dark/Light Mode**: Eye-friendly dark mode with smooth transitions

### 📝 Rich Note Taking
- **Markdown Support**: Write notes with full Markdown formatting
- **Syntax Highlighting**: Code blocks with beautiful syntax highlighting
- **Custom Highlights**: Use `===text===` to highlight important text
- **Auto-Save**: Your notes are automatically saved to localStorage
- **Multiple Notes**: Create, edit, and organize unlimited notes

### 🛠️ Powerful Tools
- **PDF Export**: Download your notes as beautifully formatted PDFs
- **Quick Actions**: Insert code blocks and highlights with one click
- **Note Management**: Duplicate, delete, and organize your notes
- **Word/Character Count**: Track your writing progress
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd d:\11.Vibe\VibeNotes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   The app will automatically open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 📖 Usage Guide

### Creating Notes
1. Click the "**+ New Note**" button in the sidebar
2. Give your note a title
3. Start writing with your preferred handwriting font

### Formatting Text
- Use standard Markdown syntax for formatting
- Click the **Highlight** button and select text to highlight
- Click the **Code** button to insert a code block
- Switch between Edit and Preview modes

### Customizing Appearance
- **Font**: Click the "Font" dropdown to choose a handwriting style
- **Page Style**: Select from Plain, Ruled, Dotted, Grid, or Parchment
- **Dark Mode**: Toggle the sun/moon icon for dark/light mode

### Exporting Notes
- Click the **Download** icon to export the current note as a PDF
- Your note will be saved with its title as the filename

### Organizing Notes
- All notes are listed in the sidebar
- Click a note to view/edit it
- Hover over a note to see Duplicate and Delete options
- Notes are automatically saved as you type

## 🎨 Customization

### Adding New Fonts
Edit `tailwind.config.js` to add new Google Fonts:
```javascript
fontFamily: {
  'yourfont': ['Your Font Name', 'cursive'],
}
```

Then add the font to the toolbar in `src/components/Toolbar.jsx`.

### Changing Colors
Modify the TailwindCSS classes in components or extend the theme in `tailwind.config.js`.

### Custom Page Styles
Add new background patterns in `src/index.css` under the `@layer utilities` section.

## 🏗️ Project Structure

```
VibeNotes/
├── src/
│   ├── components/
│   │   ├── Toolbar.jsx       # Top toolbar with all controls
│   │   ├── Sidebar.jsx       # Notes list and management
│   │   └── NoteEditor.jsx    # Main note editing area
│   ├── utils/
│   │   ├── uuid.js           # UUID generator for notes
│   │   └── pdfExport.js      # PDF export functionality
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # App entry point
│   └── index.css             # Global styles and utilities
├── index.html                # HTML template
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # TailwindCSS configuration
└── postcss.config.js         # PostCSS configuration
```

## 📦 Tech Stack

- **React 18.2** - UI library
- **Vite 5.1** - Build tool and dev server
- **TailwindCSS 3.4** - Utility-first CSS framework
- **react-markdown** - Markdown rendering
- **react-syntax-highlighter** - Code syntax highlighting
- **jspdf** - PDF generation
- **html2canvas** - HTML to canvas conversion
- **lucide-react** - Beautiful icons

## 🌟 Features Breakdown

### ✅ Implemented
- ✅ Handwritten fonts (5 styles)
- ✅ Page styles (5 types)
- ✅ Dark/Light mode
- ✅ Highlight tool
- ✅ Code blocks with syntax highlighting
- ✅ PDF export
- ✅ Multiple notes
- ✅ Auto-save to localStorage
- ✅ Responsive design
- ✅ Paper texture background
- ✅ Note duplication
- ✅ Note deletion
- ✅ Word/character count
- ✅ Markdown support

### 🎯 Future Enhancements
- Tags and folder organization
- Search functionality
- Note sharing
- Cloud sync
- Collaborative editing
- Voice notes
- Drawing/sketching
- Note templates
- Import/Export (JSON, Markdown)
- Pen sound effects

## 📄 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 💖 Acknowledgments

- Google Fonts for beautiful handwritten typefaces
- The React and Vite teams for amazing tools
- TailwindCSS for making styling enjoyable
- All the open-source libraries that made this possible

---

**Built with ❤️ for note-taking enthusiasts**

Enjoy your handwritten digital notes! ✍️
