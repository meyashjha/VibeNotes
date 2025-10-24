import { useState, useEffect } from 'react'
import Toolbar from './components/Toolbar'
import Sidebar from './components/Sidebar'
import NoteEditor from './components/NoteEditor'
import { v4 as uuidv4 } from './utils/uuid'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('notes')
    if (saved) {
      return JSON.parse(saved)
    }
    // Create default first note
    return [{
      id: uuidv4(),
      title: 'Welcome to VibeNotes',
      content: '# Welcome to VibeNotes! ✍️\n\nStart writing your handwritten-style notes here...',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: []
    }]
  })

  const [currentNoteId, setCurrentNoteId] = useState(notes[0]?.id)
  const [font, setFont] = useState(() => localStorage.getItem('font') || 'caveat')
  const [pageStyle, setPageStyle] = useState(() => localStorage.getItem('pageStyle') || 'plain')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Save to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  // Save preferences
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('font', font)
  }, [font])

  useEffect(() => {
    localStorage.setItem('pageStyle', pageStyle)
  }, [pageStyle])

  const currentNote = notes.find(note => note.id === currentNoteId)

  const updateNote = (id, updates) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === id 
          ? { ...note, ...updates, updatedAt: new Date().toISOString() }
          : note
      )
    )
  }

  const createNote = () => {
    const newNote = {
      id: uuidv4(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: []
    }
    setNotes([...notes, newNote])
    setCurrentNoteId(newNote.id)
  }

  const deleteNote = (id) => {
    if (notes.length === 1) {
      alert('You must have at least one note!')
      return
    }
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id))
    if (currentNoteId === id) {
      setCurrentNoteId(notes.find(note => note.id !== id).id)
    }
  }

  const duplicateNote = (id) => {
    const noteToDuplicate = notes.find(note => note.id === id)
    if (noteToDuplicate) {
      const newNote = {
        ...noteToDuplicate,
        id: uuidv4(),
        title: `${noteToDuplicate.title} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setNotes([...notes, newNote])
      setCurrentNoteId(newNote.id)
    }
  }

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      <Toolbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        font={font}
        setFont={setFont}
        pageStyle={pageStyle}
        setPageStyle={setPageStyle}
        currentNote={currentNote}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          notes={notes}
          currentNoteId={currentNoteId}
          setCurrentNoteId={setCurrentNoteId}
          createNote={createNote}
          deleteNote={deleteNote}
          duplicateNote={duplicateNote}
          isOpen={sidebarOpen}
        />
        
        <NoteEditor
          note={currentNote}
          updateNote={updateNote}
          font={font}
          pageStyle={pageStyle}
          darkMode={darkMode}
        />
      </div>
    </div>
  )
}

export default App
