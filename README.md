# Flow Coder

A visual canvas for annotating project flows and sending change requests to AI coders.

**The problem:** No-code tools like n8n give you a bird's eye view, but code-based projects don't. As projects grow, you lose the overview.

**The solution:** Generate a simple user-flow diagram from your code, annotate it visually, and export rich context for AI to implement your changes.

## How It Works

```
1. AI generates flow.json    ->  Analyzes your project, outputs user journey
2. Import into Flow Coder    ->  Visual canvas with drag/zoom
3. Annotate nodes            ->  "Add alert feature here"
4. Export / Copy Prompt      ->  Rich JSON with implementation context for AI
```

**For the no-coder:** Clean, simple visual flow
**For the AI coder:** Hidden implementation details (files, functions) included in export

## Quick Start

```bash
cd flow_coder
npm install
npm run dev
```

Open http://localhost:5173

### Generate a Flow

1. Copy the prompt from `prompts/generate-flow-prompt.md`
2. Give it to any AI with your project description
3. Save the output as `flow.json`
4. Import into Flow Coder

### Try the Example

Import `examples/fam-chat-v2.json` to see a sample family chat app flow.

## Schema (v2.0)

```json
{
  "project": "my-project",
  "version": "2.0",
  "nodes": [
    {
      "id": "unique-id",
      "type": "trigger|action|decision|data|output",
      "label": "Human Readable Label",
      "description": "What this does",
      "icon": "user|message|database|settings|notification",
      "position": { "x": 0, "y": 1 },
      "_implementation": {
        "files": ["path/to/file.ts"],
        "functions": ["functionName"]
      }
    }
  ],
  "edges": [
    { "source": "id1", "target": "id2", "label": "optional" }
  ],
  "annotations": []
}
```

### Node Types

| Type | Color | Purpose |
|------|-------|---------|
| `trigger` | Yellow | What starts a flow (app opens, button tap) |
| `action` | Blue | What happens (login, send message) |
| `decision` | Purple | Branching logic (logged in?) |
| `data` | Green | Data sources (database, API) |
| `output` | Cyan | What user sees (screens, notifications) |

### Position Layout

Nodes are positioned on a grid (x, y):
- **x** = column, increases left-to-right as story progresses
- **y** = row, main flow on y=1, branches on y=0 or y=2

```
y=0:                          [Notification]
y=1: [Open] -> [Auth?] -> [List] -> [Chat] -> [Send]
y=2:           [Login]   [Settings]
      x=0       x=1       x=2       x=3      x=4
```

## Features

### Visual Canvas
- Drag to pan, scroll to zoom
- Nodes colored by type
- Edges follow flow direction (left-to-right, top-to-bottom)
- Hover for full text on truncated labels

### Annotations
- Click any node to add notes
- Types: Feature, Change, Todo, Question, Note
- Priority: High, Medium, Low
- Side panel shows all annotations

### Export Options
- **Export JSON** - Full flow with annotations and implementation context
- **Copy Prompt** - Text format ready to paste to AI

### Export Format

When you export, annotations include implementation context:

```json
{
  "annotations": [
    {
      "text": "Kids should be able to set alerts",
      "node": {
        "label": "Send Message",
        "description": "Send text, photos, GIFs"
      },
      "implementation_context": {
        "related_files": ["hooks/useChatActions.ts"],
        "related_functions": ["handleSendMessage"],
        "suggested_location": "Related code in: hooks/useChatActions.ts"
      }
    }
  ]
}
```

## Project Structure

```
flow_coder/
  src/
    App.jsx                 # Main app
    components/
      FlowNode.jsx          # Universal node component
      Toolbar.jsx           # Import/Export/Copy buttons
      AnnotationPopup.jsx   # Quick annotation input
      AnnotationPanel.jsx   # Side panel with all notes
    utils/
      flowUtils.js          # Import/export logic
  prompts/
    generate-flow-prompt.md # Template for AI flow generation
  examples/
    fam-chat-v2.json        # Sample flow
  README.md
```

## Tech Stack

- React 18
- React Flow (reactflow)
- Vite
- Tailwind CSS

## Workflow Example

**You:** "I want kids to set their own reminders"

**Steps:**
1. Open Flow Coder, import your project's flow.json
2. Click "Send Message" node
3. Add annotation: "Kids should be able to set reminders for themselves"
4. Click "Copy Prompt"
5. Paste to AI coder along with "implement these changes"

**AI receives:**
```
Project: fam-chat-time

Requested changes:

1. [FEATURE] Send Message
   "Kids should be able to set reminders for themselves"
   Files: hooks/useChatActions.ts, lib/media-utils.ts
   Hint: Related code in: hooks/useChatActions.ts
```

The AI knows exactly where to look and what to implement.

## License

MIT
