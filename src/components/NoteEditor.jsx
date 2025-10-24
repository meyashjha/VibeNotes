import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";

export default function NoteEditor({
  note,
  updateNote,
  font,
  pageStyle,
  darkMode,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const editorRef = useRef(null);
  const titleRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  // Auto-save with debounce
  useEffect(() => {
    if (!note) return;

    const timer = setTimeout(() => {
      if (title !== note.title || content !== note.content) {
        updateNote(note.id, { title, content });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [title, content, note, updateNote]);

  // Handle image paste
  useEffect(() => {
    const handlePaste = async (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          e.preventDefault();
          const blob = items[i].getAsFile();
          if (blob) {
            await handleImageUpload(blob);
          }
        }
      }
    };

    const editor = editorRef.current;
    if (editor && isEditing) {
      editor.addEventListener("paste", handlePaste);
      return () => editor.removeEventListener("paste", handlePaste);
    }
  }, [isEditing, content]);

  // Convert image to base64 and resize
  const handleImageUpload = async (file) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const img = new Image();
      img.onload = () => {
        // Calculate dimensions to fit page width (max 700px for readability)
        const maxWidth = 700;
        const maxHeight = 1000;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Create canvas to resize image
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64
        const resizedBase64 = canvas.toDataURL("image/jpeg", 0.85);

        // Insert into editor
        insertImageAtCursor(resizedBase64, width, height);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Insert image markdown at cursor position
  const insertImageAtCursor = (base64, width, height) => {
    const editor = editorRef.current;
    if (!editor) return;

    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const text = editor.value;
    const before = text.substring(0, start);
    const after = text.substring(end);

    const imageMarkdown = `\n![Image](${base64})\n`;
    const newContent = before + imageMarkdown + after;

    setContent(newContent);

    // Set cursor position after image
    setTimeout(() => {
      const newPosition = start + imageMarkdown.length;
      editor.focus();
      editor.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  // Handle file selection from button
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        await handleImageUpload(file);
      }
    }
  };

  const getFontClass = () => {
    const fontMap = {
      caveat: "font-caveat",
      patrick: "font-patrick",
      indie: "font-indie",
      kalam: "font-kalam",
      shadows: "font-shadows",
    };
    return fontMap[font] || "font-caveat";
  };

  const getPageStyleClass = () => {
    const styleMap = {
      plain: "bg-white dark:bg-gray-800",
      ruled: "bg-white dark:bg-gray-800 bg-ruled",
      dotted: "bg-white dark:bg-gray-800 bg-dotted",
      grid: "bg-white dark:bg-gray-800 bg-grid",
      parchment: "bg-amber-50 dark:bg-amber-900/20 bg-parchment",
    };
    return styleMap[pageStyle] || styleMap.plain;
  };

  const processMarkdown = (text) => {
    // Handle custom highlight syntax ===text===
    return text.replace(/===(.+?)===/g, '<mark class="highlight">$1</mark>');
  };

  // Process content to extract and render images separately
  const renderContent = () => {
    if (!content) return "*No content yet...*";

    // Split content by image markdown pattern
    const imagePattern = /!\[([^\]]*)\]\((data:image\/[^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = imagePattern.exec(content)) !== null) {
      // Add text before image
      if (match.index > lastIndex) {
        parts.push({
          type: "markdown",
          content: content.substring(lastIndex, match.index),
        });
      }

      // Add image
      parts.push({
        type: "image",
        alt: match[1] || "Image",
        src: match[2],
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: "markdown",
        content: content.substring(lastIndex),
      });
    }

    // If no images found, return content as is
    if (parts.length === 0) {
      return content;
    }

    return parts;
  };

  // Trigger file input click
  const handleInsertImageClick = () => {
    fileInputRef.current?.click();
  };

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Select a note or create a new one
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Editor Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
        <div
          className={`max-w-4xl mx-auto ${getPageStyleClass()} shadow-2xl rounded-lg overflow-hidden transition-all`}
        >
          {/* Paper effect */}
          <div className="bg-paper-texture">
            <div className="p-6 md:p-12">
              {/* Title */}
              <input
                ref={titleRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full text-3xl md:text-4xl font-bold mb-6 bg-transparent border-none outline-none ${getFontClass()} text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500`}
                placeholder="Untitled Note"
              />

              {/* Editor/Preview Toggle */}
              <div className="flex gap-2 mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className={`px-4 py-2 rounded-t-lg transition-colors ${
                    !isEditing
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className={`px-4 py-2 rounded-t-lg transition-colors ${
                    isEditing
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  Edit
                </button>
              </div>

              {/* Content Area */}
              {isEditing ? (
                <div
                  className="relative"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {isDragging && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-20 border-4 border-dashed border-blue-500 rounded-lg flex items-center justify-center z-10">
                      <p className="text-blue-600 dark:text-blue-300 text-2xl font-bold">
                        Drop image here
                      </p>
                    </div>
                  )}
                  <textarea
                    id="note-editor"
                    ref={editorRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={`w-full min-h-[500px] bg-transparent border-none outline-none resize-none ${getFontClass()} text-xl md:text-2xl leading-relaxed text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500`}
                    placeholder="Start writing your note... You can use Markdown! Paste or drag images directly."
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div
                  id="note-content"
                  className={`min-h-[500px] ${getFontClass()} text-xl md:text-2xl leading-relaxed prose dark:prose-invert max-w-none`}
                >
                  {(() => {
                    const parts = renderContent();

                    // If it's a string, render with ReactMarkdown
                    if (typeof parts === "string") {
                      return (
                        <ReactMarkdown
                          components={{
                            code({
                              node,
                              inline,
                              className,
                              children,
                              ...props
                            }) {
                              const match = /language-(\w+)/.exec(
                                className || ""
                              );
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  style={darkMode ? vscDarkPlus : vs}
                                  language={match[1]}
                                  PreTag="div"
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                              ) : (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            },
                            p({ children }) {
                              // Process text for custom highlights
                              if (typeof children === "string") {
                                const processed = processMarkdown(children);
                                return (
                                  <p
                                    dangerouslySetInnerHTML={{
                                      __html: processed,
                                    }}
                                  />
                                );
                              }
                              return <p>{children}</p>;
                            },
                          }}
                        >
                          {parts}
                        </ReactMarkdown>
                      );
                    }

                    // Render parts with images
                    return parts.map((part, index) => {
                      if (part.type === "image") {
                        return (
                          <div key={index} className="my-4 flex justify-center">
                            <img
                              src={part.src}
                              alt={part.alt}
                              className="max-w-full h-auto rounded-lg shadow-lg"
                              loading="lazy"
                            />
                          </div>
                        );
                      } else {
                        return (
                          <ReactMarkdown
                            key={index}
                            components={{
                              code({
                                node,
                                inline,
                                className,
                                children,
                                ...props
                              }) {
                                const match = /language-(\w+)/.exec(
                                  className || ""
                                );
                                return !inline && match ? (
                                  <SyntaxHighlighter
                                    style={darkMode ? vscDarkPlus : vs}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                  >
                                    {String(children).replace(/\n$/, "")}
                                  </SyntaxHighlighter>
                                ) : (
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                );
                              },
                              p({ children }) {
                                // Process text for custom highlights
                                if (typeof children === "string") {
                                  const processed = processMarkdown(children);
                                  return (
                                    <p
                                      dangerouslySetInnerHTML={{
                                        __html: processed,
                                      }}
                                    />
                                  );
                                }
                                return <p>{children}</p>;
                              },
                            }}
                          >
                            {part.content}
                          </ReactMarkdown>
                        );
                      }
                    });
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>
          {content.length} characters ·{" "}
          {content.split(/\s+/).filter((w) => w.length > 0).length} words
        </span>
        <span className="hidden md:inline">
          Last updated: {new Date(note.updatedAt).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
