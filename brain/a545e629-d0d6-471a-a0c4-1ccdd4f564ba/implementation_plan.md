# Audio Broadcasting App - Implementation Plan

## Goal Description
Create a real-time audio broadcasting application. One user (the Broadcaster) captures audio from their microphone, and multiple other users (Listeners) can connect and hear the audio stream in real-time.

## User Review Required
> [!IMPORTANT]
> **Architecture Choice**: I will build this as a **Progressive Web App (PWA)**. This allows it to run on any mobile device via the browser and be "installed" to the home screen, without needing complex native build environments (Android Studio/Xcode).
>
> **Technology**:
> - **Frontend**: React (Vite) for the UI.
> - **Audio/Networking**: **WebRTC** (via PeerJS) for low-latency real-time audio streaming.
> - **Signaling**: A small Node.js server (using PeerJS Server) to help peers find each other.

## Proposed Changes

### Project Structure
- `server/`: Node.js signaling server.
- `client/`: React application.

### Server
#### [NEW] server/index.js
- Initialize `peer` server.
- Handle basic connection events (optional, mostly handled by PeerJS client).

### Client (Frontend)
#### [NEW] client/src/App.jsx
- Main routing/state logic.
- Role selection: "Start Broadcast" or "Join Broadcast".

#### [NEW] client/src/components/Broadcaster.jsx
- Access `navigator.mediaDevices.getUserMedia` for audio.
- Initialize `Peer` instance.
- Maintain list of connected listeners.
- Stream audio track to all connected peers.

#### [NEW] client/src/components/Listener.jsx
- Initialize `Peer` instance.
- Connect to Broadcaster's Peer ID.
- Receive stream and play via `<audio>` element.

#### [NEW] client/src/styles/index.css
- Custom Vanilla CSS for a premium, responsive mobile look.
- Dark mode, vibrant accents.

## Verification Plan
### Automated Tests
- None planned for MVP (focus on manual testing of WebRTC).

### Manual Verification
- Start the signaling server.
- Open the app in one browser window as **Broadcaster**.
- Open the app in a second (and third) browser window as **Listener**.
- Verify audio from Broadcaster is heard clearly on Listeners.
- Verify "mobile" responsiveness using browser dev tools.
