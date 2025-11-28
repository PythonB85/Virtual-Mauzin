# Live Mauzin App Walkthrough

I have successfully created the "Live Mauzin" mobile application and its backend server.

## Components Created
1. **Backend Server (`/backend`)**:
   - A Node.js + Express + Socket.io server.
   - Handles real-time connections and relays audio chunks from the broadcaster to all listeners.
2. **Mobile App (`/mobile-app`)**:
   - Built with React Native (Expo).
   - **Broadcaster Mode**: Records audio in short chunks and streams them to the server.
   - **Listener Mode**: Receives audio chunks and plays them sequentially.
   - **UI**: Premium design with gradients and intuitive role selection.

## How to Run Locally
1. **Start the Backend**:
   ```bash
   cd backend
   npm start
   ```
   Note the IP address printed or use `ipconfig` to find your machine's IP.

2. **Start the Mobile App**:
   ```bash
   cd mobile-app
   npx expo start
   ```
   - Scan the QR code with the Expo Go app on your phone (Android/iOS).
   - Ensure your phone is on the **same Wi-Fi network** as your computer.

3. **Configure the App**:
   - On the app's home screen, enter your computer's IP address (e.g., `http://192.168.1.5:3000`).
   - Tap "Start Broadcasting" on one device.
   - Tap "Join as Listener" on another device.

## Deployment
A detailed guide for deploying to Google Play is available in `deployment_guide.md` in the project root.
