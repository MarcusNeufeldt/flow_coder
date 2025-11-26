import { memo } from 'react'
import { Handle, Position } from 'reactflow'

// Icons as simple SVG paths
const icons = {
  trigger: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
    </svg>
  ),
  action: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  ),
  decision: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  ),
  data: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
      <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
      <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
    </svg>
  ),
  output: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.321A1 1 0 0113.32 17H6.68a1 1 0 01-.376-1.19l.804-.32.122-.49H5a2 2 0 01-2-2V5zm11 1H6v6h8V6z" clipRule="evenodd" />
    </svg>
  ),
  user: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  ),
  message: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  ),
  notification: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    </svg>
  ),
  check: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  ),
}

// Type-based styling
const typeStyles = {
  trigger: {
    bg: 'bg-yellow-900/50',
    border: 'border-yellow-500',
    iconBg: 'bg-yellow-500',
    text: 'text-yellow-100',
  },
  action: {
    bg: 'bg-blue-900/50',
    border: 'border-blue-500',
    iconBg: 'bg-blue-500',
    text: 'text-blue-100',
  },
  decision: {
    bg: 'bg-purple-900/50',
    border: 'border-purple-500',
    iconBg: 'bg-purple-500',
    text: 'text-purple-100',
  },
  data: {
    bg: 'bg-green-900/50',
    border: 'border-green-500',
    iconBg: 'bg-green-500',
    text: 'text-green-100',
  },
  output: {
    bg: 'bg-cyan-900/50',
    border: 'border-cyan-500',
    iconBg: 'bg-cyan-500',
    text: 'text-cyan-100',
  },
}

const FlowNode = memo(({ data }) => {
  const { label, description, type = 'action', icon, annotationCount } = data
  const style = typeStyles[type] || typeStyles.action
  const IconComponent = icons[icon] || icons[type] || icons.action

  return (
    <div
      className={`${style.bg} ${style.border} border-2 rounded-xl shadow-lg min-w-[180px] max-w-[220px] overflow-hidden`}
    >
      {/* Left handle - for incoming connections (horizontal flow) */}
      <Handle type="target" position={Position.Left} className="!bg-white !w-3 !h-3" />

      {/* Top handle - for incoming connections (vertical flow / branches) */}
      <Handle type="target" position={Position.Top} id="top" className="!bg-white !w-3 !h-3" />

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`${style.iconBg} p-2 rounded-lg text-white shrink-0`}>
            {IconComponent}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white text-sm truncate" title={label}>{label}</h3>
              {annotationCount > 0 && (
                <span className="bg-yellow-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full shrink-0">
                  {annotationCount}
                </span>
              )}
            </div>
            {description && (
              <p
                className={`${style.text} text-xs mt-1 opacity-80 line-clamp-2 cursor-help`}
                title={description}
              >
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right handle - for outgoing connections (horizontal flow) */}
      <Handle type="source" position={Position.Right} className="!bg-white !w-3 !h-3" />

      {/* Bottom handle - for outgoing connections (vertical flow / branches) */}
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-white !w-3 !h-3" />
    </div>
  )
})

FlowNode.displayName = 'FlowNode'

export default FlowNode
