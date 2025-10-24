export const FEATURES = {
  fonts: [
    { id: "caveat", name: "Caveat", description: "Flowing and casual" },
    {
      id: "patrick",
      name: "Patrick Hand",
      description: "Friendly and informal",
    },
    { id: "indie", name: "Indie Flower", description: "Playful and quirky" },
    { id: "kalam", name: "Kalam", description: "Clean and readable" },
    {
      id: "shadows",
      name: "Shadows Into Light",
      description: "Light and airy",
    },
  ],

  pageStyles: [
    { id: "plain", name: "Plain", description: "Clean blank page" },
    { id: "ruled", name: "Ruled", description: "Lined notebook paper" },
    { id: "dotted", name: "Dotted", description: "Dot grid for sketching" },
    { id: "grid", name: "Grid", description: "Graph paper style" },
    { id: "parchment", name: "Parchment", description: "Vintage paper look" },
  ],

  markdownSupport: [
    "Headings (# ## ###)",
    "Bold (**text**)",
    "Italic (*text*)",
    "Code blocks with syntax highlighting",
    "Links ([text](url))",
    "Lists (ordered and unordered)",
    "Blockquotes",
    "Images",
    "Custom highlights (===text===)",
  ],

  shortcuts: [
    { action: "Toggle Sidebar", key: "Click Menu icon" },
    { action: "New Note", key: "Click + New Note" },
    { action: "Toggle Dark Mode", key: "Click Moon/Sun icon" },
    { action: "Export PDF", key: "Click Download icon" },
    { action: "Insert Code Block", key: "Click Code icon" },
    { action: "Highlight Text", key: "Select text → Click Highlight icon" },
  ],
};

export const EXAMPLE_NOTE = `# Welcome to VibeNotes! ✍️

This is a **beautiful** handwritten-style note-taking app.

## Features

- 🎨 Five handwritten fonts to choose from
- 📄 Multiple page styles (ruled, dotted, grid, parchment)
- 🌙 Dark mode support
- 💾 Auto-save to localStorage
- 📱 Fully responsive design

## Markdown Support

You can use *italic* and **bold** text, and even create lists:

1. First item
2. Second item
3. Third item

### Code Blocks

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet("World");
\`\`\`

### Highlighting

Use ===triple equals=== to highlight important text!

## Try It Out

- Click the **Font** dropdown to change handwriting styles
- Click **Style** to change the page background
- Toggle between **Edit** and **Preview** modes
- Export your notes as **PDF**

Happy writing! ✨
`;
