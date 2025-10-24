import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function NoteEditor({ note, updateNote, font, pageStyle, darkMode }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const editorRef = useRef(null)
  const titleRef = useRef(null)

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content)
    }
  }, [note])

  // Auto-save with debounce
  useEffect(() => {
    if (!note) return
    
    const timer = setTimeout(() => {
      if (title !== note.title || content !== note.content) {
        updateNote(note.id, { title, content })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [title, content, note, updateNote])

  const getFontClass = () => {
    const fontMap = {
      caveat: 'font-caveat',
      patrick: 'font-patrick',
      indie: 'font-indie',
      kalam: 'font-kalam',
      shadows: 'font-shadows'
    }
    return fontMap[font] || 'font-caveat'
  }

  const getPageStyleClass = () => {
    const styleMap = {
      plain: 'bg-white dark:bg-gray-800',
      ruled: 'bg-white dark:bg-gray-800 bg-ruled',
      dotted: 'bg-white dark:bg-gray-800 bg-dotted',
      grid: 'bg-white dark:bg-gray-800 bg-grid',
      parchment: 'bg-amber-50 dark:bg-amber-900/20 bg-parchment'
    }
    return styleMap[pageStyle] || styleMap.plain
  }

  const processMarkdown = (text) => {
    // Handle custom highlight syntax ===text===
    return text.replace(/===(.+?)===/g, '<mark class="highlight">$1</mark>')
  }

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Select a note or create a new one
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Editor Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
        <div className={`max-w-4xl mx-auto ${getPageStyleClass()} shadow-2xl rounded-lg overflow-hidden transition-all`}>
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
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className={`px-4 py-2 rounded-t-lg transition-colors ${
                    isEditing
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Edit
                </button>
              </div>

              {/* Content Area */}
              {isEditing ? (
                <textarea
                  id="note-editor"
                  ref={editorRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={`w-full min-h-[500px] bg-transparent border-none outline-none resize-none ${getFontClass()} text-xl md:text-2xl leading-relaxed text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500`}
                  placeholder="Start writing your note... You can use Markdown!"
                />
              ) : (
                <div
                  id="note-content"
                  className={`min-h-[500px] ${getFontClass()} text-xl md:text-2xl leading-relaxed prose dark:prose-invert max-w-none`}
                >
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={darkMode ? vscDarkPlus : vs}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        )
                      },
                      p({ children }) {
                        // Process text for custom highlights
                        if (typeof children === 'string') {
                          const processed = processMarkdown(children)
                          return <p dangerouslySetInnerHTML={{ __html: processed }} />
                        }
                        return <p>{children}</p>
                      }
                    }}
                  >
                    {content || '*No content yet...*'}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>
          {content.length} characters · {content.split(/\s+/).filter(w => w.length > 0).length} words
        </span>
        <span className="hidden md:inline">
          Last updated: {new Date(note.updatedAt).toLocaleTimeString()}
        </span>
      </div>
    </div>
  )
}
