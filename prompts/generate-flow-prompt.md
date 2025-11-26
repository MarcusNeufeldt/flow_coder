# Generate User Flow for Flow Coder v2

Use this prompt to generate a visual flow.json that shows the **user journey**, not code architecture.

---

## Prompt Template

Copy this to your AI:

```
Create a USER FLOW diagram for my project. Think like you're explaining what the app does to someone who doesn't code.

## Rules
1. **Maximum 8-10 nodes** - Keep it high level
2. **Use plain English labels** - "Login" not "handleLogin"
3. **No file paths or function names** in labels
4. **Focus on what users DO and SEE**
5. **Group related code into single nodes**

## Node Types
- trigger: What starts things (app opens, user clicks)
- action: What happens (login, send message, save data)
- decision: Branching (is logged in?, has permission?)
- data: Where data lives (database, storage)
- output: What user sees (screens, notifications)

## Output Schema
{
  "project": "my-project-name",
  "version": "2.0",
  "nodes": [
    {
      "id": "unique-id",
      "type": "trigger|action|decision|data|output",
      "label": "Human Readable Label",
      "description": "One sentence what this does",
      "icon": "user|message|database|settings|notification|check",
      "position": { "x": 0, "y": 0 },
      "_implementation": {
        "files": ["path/to/file.ts"],
        "functions": ["functionName1", "functionName2"]
      }
    }
  ],
  "edges": [
    { "source": "id1", "target": "id2", "label": "optional description" }
  ],
  "annotations": []
}

## Position Layout
Place nodes LEFT to RIGHT following the user story flow:
- x = column (0, 1, 2, 3...) - increases as story progresses
- y = row (0, 1, 2) - use for branches/alternatives

Example layout:
```
y=0:                                    [Notification]
y=1: [Open] -> [Auth?] -> [Chat List] -> [Chat Room] -> [Send]
y=2:            [Login]    [Settings]
      x=0       x=1          x=2          x=3          x=4
```

Main flow on y=1, branches below on y=2, related outputs above on y=0.

## My Project
[Describe your project here - what it does, main features, tech stack]
```

---

## Example Output

For a family chat app:

```json
{
  "project": "fam-chat-time",
  "version": "2.0",
  "nodes": [
    {
      "id": "open-app",
      "type": "trigger",
      "label": "Open App",
      "description": "User launches the app",
      "icon": "trigger",
      "position": { "x": 0, "y": 1 }
    },
    {
      "id": "check-auth",
      "type": "decision",
      "label": "Logged In?",
      "description": "Check if user is authenticated",
      "icon": "decision",
      "position": { "x": 1, "y": 1 },
      "_implementation": {
        "files": ["hooks/useCurrentUser.tsx"],
        "functions": ["AuthProvider", "checkAuthState"]
      }
    },
    {
      "id": "login",
      "type": "action",
      "label": "Login",
      "description": "Parent or child signs in",
      "icon": "user",
      "position": { "x": 1, "y": 2 },
      "_implementation": {
        "files": ["app/login.tsx", "lib/firebase-auth.ts"],
        "functions": ["handleChildLogin", "handlePinSubmit", "signInUser"]
      }
    },
    {
      "id": "chat-list",
      "type": "output",
      "label": "Chat List",
      "description": "See all conversations",
      "icon": "message",
      "position": { "x": 2, "y": 1 },
      "_implementation": {
        "files": ["app/index.tsx"],
        "functions": ["ChatListScreen", "setupRealtimeChats"]
      }
    },
    {
      "id": "send-message",
      "type": "action",
      "label": "Send Message",
      "description": "Text, photo, GIF, or voice",
      "icon": "message",
      "position": { "x": 3, "y": 1 },
      "_implementation": {
        "files": ["hooks/useChatActions.ts", "lib/media-utils.ts"],
        "functions": ["handleSendMessage", "handleSendGif", "uploadMediaToFirebase"]
      }
    },
    {
      "id": "notification",
      "type": "output",
      "label": "Push Notification",
      "description": "Other users get notified",
      "icon": "notification",
      "position": { "x": 4, "y": 0 },
      "_implementation": {
        "files": ["functions/src/index.ts", "lib/notification-utils.ts"],
        "functions": ["sendPushNotification"]
      }
    }
  ],
  "edges": [
    { "source": "open-app", "target": "check-auth" },
    { "source": "check-auth", "target": "login", "label": "No" },
    { "source": "check-auth", "target": "chat-list", "label": "Yes" },
    { "source": "login", "target": "chat-list" },
    { "source": "chat-list", "target": "send-message" },
    { "source": "send-message", "target": "notification" }
  ],
  "annotations": []
}
```

---

## Tips

1. **Start with user journey**: What does someone DO when they use your app?
2. **Think screens**: Each major screen could be an "output" node
3. **Think actions**: What can users DO on each screen?
4. **Keep implementation hidden**: The `_implementation` field is for the AI coder, not for display
5. **Less is more**: 6-8 nodes is often enough for a clear overview

---

## After Generation

1. Save as `flow.json`
2. Import into Flow Coder
3. Click nodes to add annotations in plain English
4. Export and send to AI with "implement these annotations"
