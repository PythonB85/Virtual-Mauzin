Â# Google Play Deployment Guide for Live Mauzin

This guide walks you through the process of publishing your Expo app to the Google Play Store.

## Prerequisites
- **Google Play Console Account**: ($25 one-time fee).
- **Expo Account**: Create one at [expo.dev](https://expo.dev).
- **EAS CLI**: Install globally: `npm install -g eas-cli`.

## Step 1: Configure App for Production
1. **Update `app.json`**:
   Ensure your `android.package` is unique (e.g., `com.yourname.livemauzin`).
   ```json
   "android": {
     "package": "com.yourname.livemauzin",
     "versionCode": 1
   }
   ```
2. **Icons and Splash Screens**:
   Replace the default images in `./assets` with your custom branding.

## Step 2: Build with EAS
1. **Login to EAS**:
   ```bash
   eas login
   ```
2. **Configure Project**:
   ```bash
   eas build:configure
   ```
   Select `Android`. This creates an `eas.json` file.
3. **Run the Build**:
   ```bash
   eas build --platform android
   ```
   - You will be asked to generate a Keystore. Choose **Yes** to let Expo handle it.
   - Wait for the build to finish. It will provide a link to download an `.aab` (Android App Bundle) file.

## Step 3: Upload to Google Play Console
1. **Create App**:
   - Go to [Google Play Console](https://play.google.com/console).
   - Click **Create App**.
   - Enter "Live Mauzin" as the name.
   - Select **App** and **Free**.
2. **Set up Store Listing**:
   - Fill in the short description, full description, and upload screenshots (you can take these from your emulator).
   - Upload your App Icon (512x512).
   - Upload Feature Graphic (1024x500).
3. **Privacy Policy**:
   - Since you use the Microphone, you **MUST** provide a Privacy Policy URL. You can generate a free one online and host it on GitHub Pages or Google Sites.
4. **Upload Bundle**:
   - Go to **Production** (or **Internal Testing** first).
   - Create a new release.
   - Upload the `.aab` file you downloaded from Expo.
5. **Content Rating & Target Audience**:
   - Complete the questionnaires.
   - Mark your app as "Audio" or "Communication".
6. **Review and Rollout**:
   - Once everything is green, click **Start Rollout to Production**.
   - Google will review your app (usually takes 1-3 days).

## Important Note on Backend
Your app connects to a backend server.
- **You cannot use `localhost` or a local IP (192.168.x.x) for the production app.**
- You must host your Node.js server on a cloud provider like **Heroku**, **Render**, **DigitalOcean**, or **AWS**.
- **Render.com** is a good free/cheap option:
    1. Push your `backend` folder to a GitHub repository.
    2. Connect it to Render.
    3. Get the public URL (e.g., `https://live-mauzin-backend.onrender.com`).
    4. Update `DEFAULT_SERVER_URL` in `App.js` with this new URL.
    5. Rebuild your app with EAS.
Â*cascade082Cfile:///e:/Projects_2743/MobileApps/Live_Muazin/deployment_guide.md