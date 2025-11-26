import { useState } from 'react'

const ANNOTATION_TYPES = [
  { value: 'feature', label: 'Feature', color: 'bg-blue-500' },
  { value: 'change', label: 'Change', color: 'bg-orange-500' },
  { value: 'todo', label: 'Todo', color: 'bg-cyan-500' },
  { value: 'question', label: 'Question', color: 'bg-purple-500' },
  { value: 'note', label: 'Note', color: 'bg-slate-500' },
]

const PRIORITIES = [
  { value: 'high', label: 'High', color: 'text-red-400' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
  { value: 'low', label: 'Low', color: 'text-green-400' },
]

function AnnotationPopup({ position, node, onAdd, onClose, existingAnnotations }) {
  const [text, setText] = useState('')
  const [type, setType] = useState('feature')
  const [priority, setPriority] = useState('medium')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (text.trim()) {
      onAdd({ text: text.trim(), type, priority })
      setText('')
    }
  }

  // Adjust position to stay within viewport
  const adjustedPosition = {
    x: Math.min(position.x + 10, window.innerWidth - 340),
    y: Math.min(position.y + 10, window.innerHeight - 400),
  }

  return (
    <div
      className="absolute z-50 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 w-80"
      style={{ left: adjustedPosition.x, top: adjustedPosition.y }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-white font-semibold text-sm">Add Note</h3>
          <p className="text-slate-400 text-xs mt-0.5">{node.data.label}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Existing annotations */}
      {existingAnnotations.length > 0 && (
        <div className="mb-4 pb-4 border-b border-slate-700">
          <div className="text-xs text-slate-500 mb-2">Existing notes:</div>
          <div className="space-y-1.5 max-h-20 overflow-y-auto">
            {existingAnnotations.map((anno) => (
              <div key={anno.id} className="flex items-start gap-2 text-xs">
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${ANNOTATION_TYPES.find(t => t.value === anno.type)?.color || 'bg-slate-500'}`} />
                <span className="text-slate-300 line-clamp-1">{anno.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Type selector */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1.5">
            {ANNOTATION_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                  type === t.value
                    ? `${t.color} text-white`
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text input */}
        <div className="mb-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe what you want..."
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            rows={3}
            autoFocus
          />
        </div>

        {/* Priority selector */}
        <div className="mb-4">
          <div className="text-xs text-slate-500 mb-1.5">Priority</div>
          <div className="flex gap-2">
            {PRIORITIES.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={`flex-1 px-2 py-1.5 text-xs rounded-lg transition-colors ${
                  priority === p.value
                    ? `bg-slate-700 ${p.color} font-medium`
                    : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-sm text-slate-400 hover:text-white rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!text.trim()}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
          >
            Add Note
          </button>
        </div>
      </form>
    </div>
  )
}

export default AnnotationPopup
