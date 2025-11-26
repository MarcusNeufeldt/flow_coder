import { memo } from 'react'
import { Handle, Position } from 'reactflow'

const FunctionNode = memo(({ data }) => {
  const { label, line, description, annotationCount } = data

  return (
    <div className="bg-slate-800 border-2 border-green-600 rounded-lg shadow-lg min-w-[180px]">
      <Handle type="target" position={Position.Top} className="!bg-green-500" />

      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-green-400 font-mono">fn</span>
            <span className="font-semibold text-white text-sm">{label}</span>
          </div>
          {annotationCount > 0 && (
            <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
              {annotationCount}
            </span>
          )}
        </div>
        {line && (
          <div className="text-xs text-slate-500 mt-1">Line {line}</div>
        )}
        {description && (
          <div className="text-xs text-slate-300 mt-2">{description}</div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-green-500" />
    </div>
  )
})

FunctionNode.displayName = 'FunctionNode'

export default FunctionNode
