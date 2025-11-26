const ANNOTATION_TYPES = {
  change: { label: 'Change', color: 'bg-orange-500', textColor: 'text-orange-400' },
  feature: { label: 'Feature', color: 'bg-blue-500', textColor: 'text-blue-400' },
  todo: { label: 'Todo', color: 'bg-cyan-500', textColor: 'text-cyan-400' },
  question: { label: 'Question', color: 'bg-purple-500', textColor: 'text-purple-400' },
  note: { label: 'Note', color: 'bg-slate-500', textColor: 'text-slate-400' },
}

const PRIORITIES = {
  high: { label: 'High', color: 'text-red-400', bg: 'bg-red-500/20' },
  medium: { label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  low: { label: 'Low', color: 'text-green-400', bg: 'bg-green-500/20' },
}

function AnnotationPanel({ annotations, nodes, onClose, onDelete, onCopyPrompt, onNavigate }) {
  const getNodeLabel = (nodeId) => {
    const node = nodes.find((n) => n.id === nodeId)
    return node?.data?.label || nodeId
  }

  const sortedAnnotations = [...annotations].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1)
  })

  return (
    <div className="w-96 bg-slate-900 border-l border-slate-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-white font-semibold">Annotations</h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Click to navigate, copy to send to AI
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Copy Prompt Button */}
      <div className="p-3 border-b border-slate-800">
        <button
          onClick={onCopyPrompt}
          disabled={annotations.length === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          Copy as Prompt for AI
        </button>
      </div>

      {/* Annotations List */}
      <div className="flex-1 overflow-y-auto">
        {sortedAnnotations.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-slate-600 mb-3">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">No annotations yet</p>
            <p className="text-slate-600 text-xs mt-1">Click on a node to add one</p>
          </div>
        ) : (
          <div className="p-3 space-y-3">
            {sortedAnnotations.map((anno) => {
              const typeInfo = ANNOTATION_TYPES[anno.type] || ANNOTATION_TYPES.note
              const priorityInfo = PRIORITIES[anno.priority] || PRIORITIES.medium

              return (
                <div
                  key={anno.id}
                  className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600 transition-colors"
                >
                  {/* Header with type and priority */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${typeInfo.color}`} />
                      <span className={`text-xs font-medium ${typeInfo.textColor}`}>
                        {typeInfo.label}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${priorityInfo.bg} ${priorityInfo.color}`}>
                        {priorityInfo.label}
                      </span>
                    </div>
                    <button
                      onClick={() => onDelete(anno.id)}
                      className="p-1 text-slate-500 hover:text-red-400 rounded"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Node reference */}
                  <button
                    onClick={() => onNavigate(anno.nodeId)}
                    className="flex items-center gap-2 text-blue-400 text-xs hover:text-blue-300 mb-2 group"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span className="group-hover:underline">{getNodeLabel(anno.nodeId)}</span>
                  </button>

                  {/* Annotation text */}
                  <p className="text-white text-sm leading-relaxed">{anno.text}</p>

                  {/* Timestamp */}
                  <div className="text-xs text-slate-500 mt-3">
                    {new Date(anno.createdAt).toLocaleString()}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800 text-center">
        <span className="text-xs text-slate-500">
          {annotations.length} annotation{annotations.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}

export default AnnotationPanel
