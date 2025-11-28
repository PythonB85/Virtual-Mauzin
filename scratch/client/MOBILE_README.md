# 📱 Virtual Mauzin Mobile App

A real-time audio broadcasting mobile application built with React, Vite, and Capacitor.

## 🎯 What's Been Set Up

Your web app has been successfully converted to a mobile app! Here's what's ready:

✅ **Capacitor Integration** - Native Android wrapper configured  
✅ **Build Scripts** - Easy commands for building and running  
✅ **Android Project** - Native Android project generated  
✅ **Permissions** - Audio recording and network permissions configured  
✅ **App Configuration** - Package name: `com.virtualmauzin.app`  

## 🚀 Quick Start

### 1. Build the Mobile App
```bash
cd scratch\client
npm run mobile:build
```

### 2. Open in Android Studio
```bash
npm run mobile:open
```

### 3. Run on Device/Emulator
- Click the green "Run" button in Android Studio
- Or press `Shift + F10`

## 📱 Available Commands

| Command | Description |
|---------|-------------|
| `npm run mobile:build` | Build web app and sync with Android |
| `npm run mobile:open` | Open project in Android Studio |
| `npm run mobile:sync` | Sync web assets to Android |
| `npm run mobile:run` | Build and open in one command |

## 🔧 Development Workflow

1. **Make changes** to your React code in `src/`
2. **Build and sync**: `npm run mobile:build`
3. **Test** in Android Studio emulator or real device
4. **Repeat** as needed

## 📦 Project Structure

```
Virtual-Mauzin/
├── scratch/
│   ├── client/              # React web app
│   │   ├── src/            # React source code
│   │   ├── dist/           # Built web assets
│   │   ├── android/        # Native Android project
│   │   ├── capacitor.config.json
│   │   └── package.json
│   └── server/             # PeerJS server
├── MOBILE_DEPLOYMENT_GUIDE.md  # Complete deployment guide
└── setup-mobile.ps1        # Setup script
```

## 🎨 App Features

- **Broadcaster Mode**: Start broadcasting audio to multiple listeners
- **Listener Mode**: Connect to a broadcaster using their Peer ID
- **Real-time Audio**: Low-latency audio streaming using WebRTC
- **Simple UI**: Easy-to-use interface for both roles

## 🔐 Important Files

- **capacitor.config.json** - Capacitor configuration
- **android/app/build.gradle** - Android build configuration
- **android/app/src/main/AndroidManifest.xml** - App permissions and settings

## 📚 Next Steps

### For Testing
1. Install Android Studio if not already installed
2. Set up an Android emulator or connect a real device
3. Run the app and test all features

### For Google Play Deployment
See the comprehensive guide: **[MOBILE_DEPLOYMENT_GUIDE.md](../../MOBILE_DEPLOYMENT_GUIDE.md)**

Key steps:
1. Create a Google Play Developer account ($25)
2. Generate a signing keystore
3. Build a signed AAB file
4. Upload to Google Play Console
5. Complete store listing
6. Submit for review

## ⚠️ Important Notes

### Server Configuration
Your app currently uses a local PeerJS server (`localhost:9000`). For production:

1. Deploy the PeerJS server to a cloud platform
2. Update the server URL in your React code
3. Update `capacitor.config.json` with production server URL

### Permissions
The app requires:
- **Microphone access** - For broadcasting audio
- **Internet access** - For peer connections
- **Network state** - For connection monitoring

These are already configured in `AndroidManifest.xml`.

## 🐛 Troubleshooting

### Build Errors
- Ensure Android Studio is installed
- Set `ANDROID_HOME` environment variable
- Run `npm install` in the client directory

### App Won't Launch
- Check Android Studio Logcat for errors
- Verify permissions in AndroidManifest.xml
- Ensure device/emulator has internet connection

### Audio Not Working
- Grant microphone permission when prompted
- Test on a real device (emulators may have audio issues)
- Check browser console for WebRTC errors

## 📞 Support

For detailed deployment instructions, see:
- **[MOBILE_DEPLOYMENT_GUIDE.md](../../MOBILE_DEPLOYMENT_GUIDE.md)** - Complete deployment guide
- [Capacitor Docs](https://capacitorjs.com/docs) - Official Capacitor documentation
- [Android Developer Guide](https://developer.android.com/guide) - Android development resources

## 🎉 Ready to Deploy!

Your app is now ready for:
- ✅ Local testing
- ✅ Emulator testing
- ✅ Device testing
- ✅ Google Play deployment (with additional setup)

**Good luck with your app launch!** 🚀
