/**
 * Flow Coder v2 - User-Flow Based Schema
 *
 * Visual layer: label, description, icon, type
 * Hidden layer: _implementation (files, functions)
 */

/**
 * Import flow.json and convert to React Flow nodes/edges
 * Supports both v1 (file-based) and v2 (user-flow) schemas
 */
export function importFlow(data) {
  const nodes = []
  const edges = []

  // Detect schema version
  const isV2 = data.version === '2.0' || (data.nodes && data.nodes[0]?.type && !data.nodes[0]?.path)

  if (isV2) {
    return importV2Flow(data)
  } else {
    return importV1Flow(data)
  }
}

/**
 * Import v2 user-flow schema
 */
function importV2Flow(data) {
  const nodes = []
  const edges = []

  // Layout configuration
  const gridUnitX = 280 // pixels per grid unit horizontally
  const gridUnitY = 150 // pixels per grid unit vertically

  if (data.nodes) {
    data.nodes.forEach((node, index) => {
      // Use position from JSON if provided, otherwise fall back to auto-layout
      let position
      if (node.position) {
        // Convert grid units to pixels
        position = {
          x: node.position.x * gridUnitX,
          y: node.position.y * gridUnitY,
        }
      } else {
        // Fallback: simple grid layout
        const nodesPerRow = 3
        const row = Math.floor(index / nodesPerRow)
        const col = index % nodesPerRow
        position = {
          x: col * gridUnitX,
          y: row * gridUnitY,
        }
      }

      nodes.push({
        id: node.id,
        type: 'flowNode',
        position,
        data: {
          label: node.label,
          description: node.description,
          type: node.type || 'action',
          icon: node.icon,
          _implementation: node._implementation || null,
        },
      })
    })
  }

  if (data.edges) {
    data.edges.forEach((edge, index) => {
      edges.push({
        id: edge.id || `edge-${index}`,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        animated: true,
        style: { stroke: '#64748b', strokeWidth: 2 },
        labelStyle: { fill: '#94a3b8', fontSize: 11, fontWeight: 500 },
        labelBgStyle: { fill: '#1e293b', fillOpacity: 0.8 },
        labelBgPadding: [4, 8],
        labelBgBorderRadius: 4,
      })
    })
  }

  return {
    nodes,
    edges,
    annotations: data.annotations || [],
    rawData: data,
  }
}

/**
 * Import v1 file-based schema (legacy support)
 * Converts to simplified v2-style display
 */
function importV1Flow(data) {
  const nodes = []
  const edges = []

  const nodeWidth = 220
  const nodeHeight = 100
  const horizontalGap = 80
  const verticalGap = 60
  const nodesPerRow = 4

  if (data.nodes) {
    data.nodes.forEach((fileNode, index) => {
      const row = Math.floor(index / nodesPerRow)
      const col = index % nodesPerRow

      // Convert file node to simpler display
      // Use description as label if it's more user-friendly
      const label = fileNode.description || fileNode.label
      const simpleLabel = label.replace(/\.tsx?$|\.jsx?$/, '').replace(/_/g, ' ')

      nodes.push({
        id: fileNode.id,
        type: 'flowNode',
        position: {
          x: col * (nodeWidth + horizontalGap),
          y: row * (nodeHeight + verticalGap),
        },
        data: {
          label: simpleLabel,
          description: fileNode.description,
          type: guessNodeType(fileNode),
          icon: guessIcon(fileNode),
          _implementation: {
            files: [fileNode.path],
            functions: fileNode.children?.map(c => c.label) || [],
          },
        },
      })
    })
  }

  if (data.edges) {
    data.edges.forEach((edge, index) => {
      edges.push({
        id: edge.id || `edge-${index}`,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        animated: true,
        style: { stroke: '#64748b', strokeWidth: 2 },
        labelStyle: { fill: '#94a3b8', fontSize: 11 },
      })
    })
  }

  return {
    nodes,
    edges,
    annotations: data.annotations || [],
    rawData: data,
  }
}

/**
 * Guess node type from v1 file data
 */
function guessNodeType(fileNode) {
  const label = (fileNode.label + ' ' + (fileNode.description || '')).toLowerCase()

  if (label.includes('login') || label.includes('auth')) return 'action'
  if (label.includes('layout') || label.includes('provider')) return 'trigger'
  if (label.includes('firebase') || label.includes('database') || label.includes('storage')) return 'data'
  if (label.includes('screen') || label.includes('page') || label.includes('list')) return 'output'
  if (label.includes('hook') || label.includes('use')) return 'action'

  return 'action'
}

/**
 * Guess icon from v1 file data
 */
function guessIcon(fileNode) {
  const label = (fileNode.label + ' ' + (fileNode.description || '')).toLowerCase()

  if (label.includes('login') || label.includes('auth') || label.includes('user')) return 'user'
  if (label.includes('message') || label.includes('chat')) return 'message'
  if (label.includes('setting')) return 'settings'
  if (label.includes('notification')) return 'notification'
  if (label.includes('firebase') || label.includes('database')) return 'data'

  return null // Will use type default
}

/**
 * Export current flow state back to JSON format
 * Includes rich implementation context for AI coders
 */
export function exportFlow(rawData, nodes, edges, annotations) {
  const exportData = {
    project: rawData?.project || 'untitled',
    version: '2.0',
    exportedAt: new Date().toISOString(),

    // Simplified flow for reference
    flow: nodes.map(node => ({
      id: node.id,
      label: node.data.label,
      description: node.data.description,
      type: node.data.type,
    })),

    // Rich annotations with implementation context
    annotations: annotations.map(anno => {
      const relatedNode = nodes.find(n => n.id === anno.nodeId)

      return {
        id: anno.id,
        text: anno.text,
        type: anno.type,
        priority: anno.priority,
        createdAt: anno.createdAt,

        // Context for the no-coder
        node: {
          label: relatedNode?.data?.label || 'Unknown',
          description: relatedNode?.data?.description || '',
        },

        // Context for the AI coder
        implementation_context: relatedNode?.data?._implementation ? {
          related_files: relatedNode.data._implementation.files || [],
          related_functions: relatedNode.data._implementation.functions || [],
          suggested_location: suggestLocation(relatedNode, anno),
        } : null,
      }
    }),
  }

  return exportData
}

/**
 * Generate a suggested location hint for the AI
 */
function suggestLocation(node, annotation) {
  if (!node?.data?._implementation) return null

  const files = node.data._implementation.files || []
  const annoText = annotation.text.toLowerCase()

  // Simple heuristics for suggestions
  if (annoText.includes('new feature') || annoText.includes('add')) {
    return `Consider adding to ${files[0] || 'a new file'} or creating a new module`
  }
  if (annoText.includes('fix') || annoText.includes('bug')) {
    return `Check ${files.join(', ')} for the issue`
  }
  if (annoText.includes('improve') || annoText.includes('optimize')) {
    return `Review implementation in ${files.join(', ')}`
  }

  return `Related code in: ${files.join(', ')}`
}

/**
 * Generate a prompt-friendly summary of annotations
 */
export function generatePromptSummary(exportData) {
  if (!exportData.annotations?.length) {
    return 'No annotations to implement.'
  }

  const lines = [
    `Project: ${exportData.project}`,
    '',
    'Requested changes:',
    '',
  ]

  exportData.annotations.forEach((anno, i) => {
    lines.push(`${i + 1}. [${anno.type?.toUpperCase() || 'CHANGE'}] ${anno.node?.label || 'General'}`)
    lines.push(`   "${anno.text}"`)
    if (anno.implementation_context?.related_files?.length) {
      lines.push(`   Files: ${anno.implementation_context.related_files.join(', ')}`)
    }
    if (anno.implementation_context?.suggested_location) {
      lines.push(`   Hint: ${anno.implementation_context.suggested_location}`)
    }
    lines.push('')
  })

  return lines.join('\n')
}
