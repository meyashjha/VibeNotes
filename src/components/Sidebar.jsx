import { Plus, Trash2, Copy, X } from 'lucide-react'

export default function Sidebar({ 
  notes, 
  currentNoteId, 
  setCurrentNoteId, 
  createNote, 
  deleteNote,
  duplicateNote,
  isOpen 
}) {
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPreview = (content) => {
    return content.replace(/[#*`=]/g, '').substring(0, 50) + (content.length > 50 ? '...' : '')
  }

  if (!isOpen) return null

  return (
    <div className="w-full md:w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={createNote}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-3 px-4 flex items-center justify-center gap-2 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          New Note
        </button>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {notes.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No notes yet. Create one!
          </div>
        ) : (
          <div className="p-2">
            {notes.map(note => (
              <div
                key={note.id}
                className={`group mb-2 p-3 rounded-lg cursor-pointer transition-all ${
                  currentNoteId === note.id
                    ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500'
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-transparent'
                }`}
                onClick={() => setCurrentNoteId(note.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 dark:text-white truncate font-caveat text-lg">
                      {note.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                      {getPreview(note.content)}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      {formatDate(note.updatedAt)}
                    </p>
                  </div>
                  
                  <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        duplicateNote(note.id)
                      }}
                      className="p-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm('Delete this note?')) {
                          deleteNote(note.id)
                        }
                      }}
                      className="p-1 hover:bg-red-200 dark:hover:bg-red-800 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>

                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {note.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
        {notes.length} {notes.length === 1 ? 'note' : 'notes'}
      </div>
    </div>
  )
}
