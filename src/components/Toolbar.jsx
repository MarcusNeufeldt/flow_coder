import { useRef } from 'react'

function Toolbar({ onImport, onExport, onCopyPrompt, onTogglePanel, hasData, annotationCount, projectName }) {
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        onImport(event.target.result)
      }
      reader.readAsText(file)
    }
    e.target.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.name.endsWith('.json')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        onImport(event.target.result)
      }
      reader.readAsText(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  return (
    <div
      className="flex items-center gap-3 p-3 bg-slate-900/90 backdrop-blur rounded-xl border border-slate-800 shadow-xl"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {projectName && (
        <div className="px-3 py-1 bg-slate-800 rounded-lg">
          <span className="text-slate-400 text-xs">Project:</span>
          <span className="text-white text-sm font-medium ml-2">{projectName}</span>
        </div>
      )}

      <div className="h-6 w-px bg-slate-700" />

      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        onChange={handleFileSelect}
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Import
      </button>

      <button
        onClick={onExport}
        disabled={!hasData}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export
      </button>

      <button
        onClick={onCopyPrompt}
        disabled={annotationCount === 0}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
        Copy Prompt
      </button>

      <div className="h-6 w-px bg-slate-700" />

      <button
        onClick={onTogglePanel}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        Notes
        {annotationCount > 0 && (
          <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
            {annotationCount}
          </span>
        )}
      </button>
    </div>
  )
}

export default Toolbar
