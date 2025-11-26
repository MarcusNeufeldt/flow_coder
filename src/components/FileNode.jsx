import { memo } from 'react'
import { Handle, Position } from 'reactflow'

const FileNode = memo(({ data, id }) => {
  const { label, path, description, children, expanded, annotationCount, onExpand } = data
  const hasChildren = children && children.length > 0

  return (
    <div className="bg-slate-800 border-2 border-slate-600 rounded-lg shadow-lg min-w-[200px] overflow-hidden">
      <Handle type="target" position={Position.Top} className="!bg-blue-500" />

      <div
        className="px-4 py-3 bg-slate-700 flex items-center justify-between cursor-pointer hover:bg-slate-650"
        onClick={() => hasChildren && onExpand(id, !expanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-blue-400 text-lg">
            {expanded ? '[-]' : '[+]'}
          </span>
          <div>
            <div className="font-semibold text-white text-sm">{label}</div>
            {path && <div className="text-xs text-slate-400">{path}</div>}
          </div>
        </div>
        {annotationCount > 0 && (
          <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
            {annotationCount}
          </span>
        )}
      </div>

      {description && (
        <div className="px-4 py-2 text-xs text-slate-300 border-t border-slate-600">
          {description}
        </div>
      )}

      {expanded && hasChildren && (
        <div className="border-t border-slate-600">
          {children.map((child, idx) => (
            <div
              key={child.id || idx}
              className="px-4 py-2 text-sm border-b border-slate-700 last:border-b-0 hover:bg-slate-700"
            >
              <div className="flex items-center gap-2">
                <span className="text-green-400">fn</span>
                <span className="text-white">{child.label}</span>
                {child.line && (
                  <span className="text-slate-500 text-xs">L{child.line}</span>
                )}
              </div>
              {child.description && (
                <div className="text-xs text-slate-400 mt-1 ml-6">{child.description}</div>
              )}
            </div>
          ))}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-blue-500" />
    </div>
  )
})

FileNode.displayName = 'FileNode'

export default FileNode
