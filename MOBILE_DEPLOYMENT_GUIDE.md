# 📱 Virtual Mauzin - Mobile App Deployment Guide

## Overview
Virtual Mauzin is now configured as a mobile app using **Capacitor**, which wraps your React web app into a native Android application ready for Google Play Store deployment.

---

## 🚀 Quick Start Commands

### Build and Run Mobile App
```bash
# Navigate to client directory
cd .\scratch\client\

# Build web app and sync with Android
npm run mobile:build

# Open in Android Studio
npm run mobile:open
```

---

## 📋 Prerequisites for Google Play Deployment

### 1. **Install Required Software**
- ✅ **Node.js** (already installed)
- ✅ **Android Studio** - [Download here](https://developer.android.com/studio)
- ✅ **Java JDK 17** - Required by Android Studio

### 2. **Android Studio Setup**
1. Install Android Studio
2. During setup, install:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (for testing)
3. Set up environment variables:
   ```
   ANDROID_HOME = C:\Users\YourUsername\AppData\Local\Android\Sdk
   ```

### 3. **Google Play Console Account**
- Create a Google Play Developer account: https://play.google.com/console
- One-time registration fee: $25 USD
- Required for publishing apps to Google Play Store

---

## 🔧 Building Your App for Google Play

### Step 1: Update App Information

Edit `android/app/src/main/res/values/strings.xml`:
```xml
<resources>
    <string name="app_name">Virtual Mauzin</string>
    <string name="title_activity_main">Virtual Mauzin</string>
    <string name="package_name">com.virtualmauzin.app</string>
    <string name="custom_url_scheme">com.virtualmauzin.app</string>
</resources>
```

### Step 2: Configure App Icon and Splash Screen

**Option A: Use Android Studio's Asset Studio**
1. Open Android Studio: `npm run mobile:open`
2. Right-click `res` folder → New → Image Asset
3. Upload your icon (1024x1024 PNG)
4. Generate all sizes automatically

**Option B: Manual Icon Setup**
Place icons in these folders:
- `android/app/src/main/res/mipmap-hdpi/ic_launcher.png` (72x72)
- `android/app/src/main/res/mipmap-mdpi/ic_launcher.png` (48x48)
- `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png` (96x96)
- `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png` (144x144)
- `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` (192x192)

### Step 3: Update App Permissions

Edit `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

### Step 4: Configure Version and Build Settings

Edit `android/app/build.gradle`:
```gradle
android {
    defaultConfig {
        applicationId "com.virtualmauzin.app"
        minSdkVersion 22
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
}
```

**Version Guidelines:**
- `versionCode`: Integer that increases with each release (1, 2, 3...)
- `versionName`: User-facing version string ("1.0.0", "1.0.1", "2.0.0")

---

## 🔐 Generating Signed APK/AAB for Google Play

### Step 1: Create a Keystore (One-time Setup)

```bash
# Navigate to android/app directory
cd android/app

# Generate keystore
keytool -genkey -v -keystore virtual-mauzin-release.keystore -alias virtual-mauzin -keyalg RSA -keysize 2048 -validity 10000
```

**Important:** 
- Save the keystore file securely
- Remember your password
- Never commit keystore to version control

### Step 2: Configure Signing in Gradle

Create `android/key.properties`:
```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=virtual-mauzin
storeFile=virtual-mauzin-release.keystore
```

Update `android/app/build.gradle`:
```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Step 3: Build Release APK/AAB

**For AAB (Android App Bundle - Recommended for Google Play):**
```bash
cd android
./gradlew bundleRelease
```
Output: `android/app/build/outputs/bundle/release/app-release.aab`

**For APK (Alternative):**
```bash
cd android
./gradlew assembleRelease
```
Output: `android/app/build/outputs/apk/release/app-release.apk`

---

## 📤 Publishing to Google Play Store

### Step 1: Create App in Play Console
1. Go to [Google Play Console](https://play.google.com/console)
2. Click "Create App"
3. Fill in:
   - App name: **Virtual Mauzin**
   - Default language: English (US)
   - App type: App
   - Free or Paid: Free

### Step 2: Complete Store Listing
Required information:
- **App name**: Virtual Mauzin
- **Short description** (80 chars max):
  ```
  Real-time audio broadcasting app for high-quality live streaming
  ```
- **Full description** (4000 chars max):
  ```
  Virtual Mauzin is a powerful real-time audio broadcasting application that enables you to broadcast high-quality audio to multiple listeners simultaneously.

  Features:
  • High-quality audio streaming using WebRTC
  • Real-time peer-to-peer connections
  • Simple broadcaster and listener modes
  • Low latency audio transmission
  • Easy-to-use interface

  Perfect for:
  • Live music performances
  • Podcasts
  • Audio conferences
  • Educational broadcasts
  • Community radio

  Start broadcasting or listening with just one tap!
  ```

### Step 3: Upload Screenshots
Required screenshots (minimum 2, up to 8):
- Phone: 16:9 ratio, minimum 320px
- 7-inch tablet: 16:9 ratio
- 10-inch tablet: 16:9 ratio

**Tip:** Use Android emulator or real device to capture screenshots

### Step 4: Upload App Bundle
1. Go to "Release" → "Production"
2. Click "Create new release"
3. Upload your `app-release.aab` file
4. Fill in release notes:
   ```
   Initial release of Virtual Mauzin
   - Real-time audio broadcasting
   - High-quality audio streaming
   - Simple and intuitive interface
   ```

### Step 5: Content Rating
1. Complete the content rating questionnaire
2. For an audio broadcasting app, it will likely be rated "Everyone"

### Step 6: Privacy Policy
You'll need a privacy policy URL. Create a simple privacy policy covering:
- What data you collect
- How you use it
- User rights

### Step 7: App Content
Complete all required sections:
- Target audience
- News apps (if applicable)
- COVID-19 contact tracing (not applicable)
- Data safety
- Government apps (not applicable)

### Step 8: Submit for Review
1. Review all sections (must have green checkmarks)
2. Click "Send for review"
3. Wait for Google's review (typically 1-3 days)

---

## 🔄 Updating Your App

When you make changes:

```bash
# 1. Update your React code
# 2. Build and sync
npm run mobile:build

# 3. Increment version in android/app/build.gradle
versionCode 2  # Increment by 1
versionName "1.0.1"  # Update version string

# 4. Build new AAB
cd android
./gradlew bundleRelease

# 5. Upload to Google Play Console as new release
```

---

## 🐛 Testing Before Release

### Test on Emulator
```bash
# Open Android Studio
npm run mobile:open

# Click "Run" button or press Shift+F10
```

### Test on Real Device
1. Enable Developer Options on your Android device
2. Enable USB Debugging
3. Connect device via USB
4. Run from Android Studio

### Internal Testing Track
Before production release, use Google Play's Internal Testing:
1. Upload AAB to Internal Testing track
2. Add test users via email
3. Get feedback before public release

---

## 📊 Important Considerations

### Server Configuration
Your app currently uses a local PeerJS server. For production:

1. **Deploy PeerJS Server to Cloud**
   - Options: Heroku, AWS, Google Cloud, DigitalOcean
   - Update server URL in your React code

2. **Update Capacitor Config**
   Edit `capacitor.config.json`:
   ```json
   {
     "server": {
       "url": "https://your-production-server.com",
       "cleartext": false
     }
   }
   ```

### Permissions
The app requires microphone access. Make sure to:
- Request permissions at runtime
- Explain why you need microphone access
- Handle permission denials gracefully

### Network Requirements
- App requires internet connection
- Consider adding offline mode or error handling
- Test on different network conditions (3G, 4G, WiFi)

---

## 📱 App Size Optimization

Current build size can be reduced by:
1. Enabling ProGuard/R8 (code shrinking)
2. Using AAB instead of APK (dynamic delivery)
3. Optimizing images and assets
4. Removing unused dependencies

---

## 🆘 Common Issues and Solutions

### Issue: Build fails with "SDK not found"
**Solution:** Set ANDROID_HOME environment variable

### Issue: Keystore password forgotten
**Solution:** No recovery possible. Create new keystore (can't update existing app)

### Issue: App crashes on launch
**Solution:** Check Android logs in Android Studio's Logcat

### Issue: Microphone not working
**Solution:** Verify permissions in AndroidManifest.xml and request at runtime

---

## 📚 Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Android Developer Guide](https://developer.android.com/guide)
- [WebRTC on Mobile](https://webrtc.org/getting-started/mobile)

---

## ✅ Deployment Checklist

Before submitting to Google Play:

- [ ] App builds successfully
- [ ] Tested on multiple devices/emulators
- [ ] All permissions properly requested
- [ ] App icon and splash screen configured
- [ ] Version code and name updated
- [ ] Signed with release keystore
- [ ] AAB file generated
- [ ] Privacy policy created and hosted
- [ ] Screenshots captured
- [ ] Store listing completed
- [ ] Content rating obtained
- [ ] Production server deployed (if needed)

---

## 🎉 Success!

Once approved, your app will be live on Google Play Store at:
`https://play.google.com/store/apps/details?id=com.virtualmauzin.app`

**Congratulations on publishing your mobile app!** 🚀
