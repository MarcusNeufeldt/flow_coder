import { useState, useCallback, useRef } from 'react'
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'

import FlowNode from './components/FlowNode'
import Toolbar from './components/Toolbar'
import AnnotationPanel from './components/AnnotationPanel'
import AnnotationPopup from './components/AnnotationPopup'
import { importFlow, exportFlow, generatePromptSummary } from './utils/flowUtils'

const nodeTypes = {
  flowNode: FlowNode,
}

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [annotations, setAnnotations] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })
  const [showPanel, setShowPanel] = useState(false)
  const [flowData, setFlowData] = useState(null)
  const [projectName, setProjectName] = useState('')
  const reactFlowWrapper = useRef(null)
  const [reactFlowInstance, setReactFlowInstance] = useState(null)

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node)
    const bounds = reactFlowWrapper.current.getBoundingClientRect()
    setPopupPosition({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    })
    setShowPopup(true)
  }, [])

  const handleImport = useCallback((fileContent) => {
    try {
      const data = JSON.parse(fileContent)
      setFlowData(data)
      setProjectName(data.project || 'Untitled Project')
      const { nodes: importedNodes, edges: importedEdges, annotations: importedAnnotations } = importFlow(data)
      setNodes(importedNodes)
      setEdges(importedEdges)
      setAnnotations(importedAnnotations || [])
    } catch (error) {
      console.error('Failed to import flow:', error)
      alert('Failed to import flow. Check console for details.')
    }
  }, [setNodes, setEdges])

  const handleExport = useCallback(() => {
    const exportData = exportFlow(flowData, nodes, edges, annotations)
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${projectName || 'flow'}-annotated.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [flowData, nodes, edges, annotations, projectName])

  const handleCopyPrompt = useCallback(() => {
    const exportData = exportFlow(flowData, nodes, edges, annotations)
    const promptText = generatePromptSummary(exportData)
    navigator.clipboard.writeText(promptText)
    alert('Copied to clipboard!')
  }, [flowData, nodes, edges, annotations])

  const handleAddAnnotation = useCallback((annotation) => {
    const newAnnotation = {
      ...annotation,
      id: `anno-${Date.now()}`,
      nodeId: selectedNode?.id,
      createdAt: new Date().toISOString(),
    }
    setAnnotations((prev) => [...prev, newAnnotation])
    setShowPopup(false)
  }, [selectedNode])

  const handleDeleteAnnotation = useCallback((annotationId) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== annotationId))
  }, [])

  const nodeAnnotationCounts = annotations.reduce((acc, anno) => {
    acc[anno.nodeId] = (acc[anno.nodeId] || 0) + 1
    return acc
  }, {})

  const nodesWithAnnotations = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      annotationCount: nodeAnnotationCounts[node.id] || 0,
    },
  }))

  return (
    <div className="w-full h-full flex bg-slate-950">
      <div ref={reactFlowWrapper} className="flex-1 relative">
        <ReactFlow
          nodes={nodesWithAnnotations}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          className="bg-slate-950"
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
          }}
        >
          <Controls className="!bg-slate-800 !border-slate-700 !rounded-lg" />
          <Background color="#1e293b" gap={24} size={2} />

          <Panel position="top-left" className="!m-4">
            <Toolbar
              onImport={handleImport}
              onExport={handleExport}
              onCopyPrompt={handleCopyPrompt}
              onTogglePanel={() => setShowPanel(!showPanel)}
              hasData={nodes.length > 0}
              annotationCount={annotations.length}
              projectName={projectName}
            />
          </Panel>

          {nodes.length === 0 && (
            <Panel position="top-center" className="!mt-32">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">
                  <svg className="w-16 h-16 mx-auto text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-400 mb-2">
                  Import a Flow
                </h2>
                <p className="text-slate-500 text-sm max-w-md">
                  Drop a flow.json file here or click "Import" to visualize your project flow
                </p>
              </div>
            </Panel>
          )}
        </ReactFlow>

        {showPopup && selectedNode && (
          <AnnotationPopup
            position={popupPosition}
            node={selectedNode}
            onAdd={handleAddAnnotation}
            onClose={() => setShowPopup(false)}
            existingAnnotations={annotations.filter((a) => a.nodeId === selectedNode.id)}
          />
        )}
      </div>

      {showPanel && (
        <AnnotationPanel
          annotations={annotations}
          nodes={nodes}
          onClose={() => setShowPanel(false)}
          onDelete={handleDeleteAnnotation}
          onCopyPrompt={handleCopyPrompt}
          onNavigate={(nodeId) => {
            const node = nodes.find((n) => n.id === nodeId)
            if (node && reactFlowInstance) {
              reactFlowInstance.fitView({ nodes: [node], duration: 500, padding: 0.5 })
            }
          }}
        />
      )}
    </div>
  )
}

export default App
