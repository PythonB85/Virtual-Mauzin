# 🚀 Virtual Mauzin - Quick Reference Guide

## Common Commands

### Development
```bash
# Start web development server
cd scratch\client
npm run dev

# Build web app
npm run build

# Build for mobile
npm run mobile:build

# Open in Android Studio
npm run mobile:open
```

### Testing
```bash
# Run on emulator (from Android Studio)
Shift + F10

# View logs
# In Android Studio: View → Tool Windows → Logcat
```

### Building for Release
```bash
# Navigate to Android project
cd scratch\client\android

# Build AAB (for Google Play)
.\gradlew bundleRelease

# Build APK (for testing)
.\gradlew assembleRelease
```

## File Locations

### Important Configuration Files
- **App Config**: `scratch/client/capacitor.config.json`
- **Android Manifest**: `scratch/client/android/app/src/main/AndroidManifest.xml`
- **Build Config**: `scratch/client/android/app/build.gradle`
- **Package Info**: `scratch/client/package.json`

### Build Outputs
- **AAB File**: `scratch/client/android/app/build/outputs/bundle/release/app-release.aab`
- **APK File**: `scratch/client/android/app/build/outputs/apk/release/app-release.apk`
- **Web Build**: `scratch/client/dist/`

### App Assets
- **Icons**: `scratch/client/android/app/src/main/res/mipmap-*/`
- **Strings**: `scratch/client/android/app/src/main/res/values/strings.xml`
- **Styles**: `scratch/client/android/app/src/main/res/values/styles.xml`

## Version Management

### Update App Version
Edit `scratch/client/android/app/build.gradle`:
```gradle
defaultConfig {
    versionCode 2        // Increment by 1 for each release
    versionName "1.0.1"  // Update version string
}
```

### Version Naming Convention
- **Major.Minor.Patch** (e.g., 1.0.0)
- **Major**: Breaking changes (1.0.0 → 2.0.0)
- **Minor**: New features (1.0.0 → 1.1.0)
- **Patch**: Bug fixes (1.0.0 → 1.0.1)

## Troubleshooting

### Build Fails
```bash
# Clean build
cd scratch\client\android
.\gradlew clean

# Rebuild
.\gradlew build
```

### Sync Issues
```bash
# Re-sync Capacitor
cd scratch\client
npx cap sync android
```

### Android Studio Issues
```bash
# Invalidate caches
# File → Invalidate Caches → Invalidate and Restart
```

### Permission Errors
Check `AndroidManifest.xml` has:
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
```

## Testing Checklist

### Before Each Build
- [ ] All code changes committed
- [ ] Version number updated
- [ ] Build completes without errors
- [ ] App runs on emulator
- [ ] App runs on real device
- [ ] All features tested

### Before Google Play Upload
- [ ] Signed with release keystore
- [ ] AAB file generated
- [ ] File size under 150MB
- [ ] Tested on multiple devices
- [ ] No critical bugs
- [ ] Privacy policy updated

## Google Play Console

### Access
- URL: https://play.google.com/console
- Your App: https://play.google.com/console/u/0/developers/[YOUR_ID]/app/[APP_ID]

### Common Tasks
1. **Upload New Release**
   - Release → Production → Create new release
   - Upload AAB
   - Add release notes
   - Review and rollout

2. **Update Store Listing**
   - Grow → Store presence → Main store listing
   - Edit details
   - Save changes

3. **View Statistics**
   - Statistics → Overview
   - Check installs, ratings, crashes

4. **Respond to Reviews**
   - Grow → User reviews
   - Reply to user feedback

## Environment Variables

### Required for Android Development
```powershell
# Set ANDROID_HOME
$env:ANDROID_HOME = "C:\Users\YourUsername\AppData\Local\Android\Sdk"

# Add to PATH
$env:PATH += ";$env:ANDROID_HOME\platform-tools"
$env:PATH += ";$env:ANDROID_HOME\tools"
```

### Verify Setup
```bash
# Check Android SDK
echo $env:ANDROID_HOME

# Check Java
java -version

# Check Node
node --version
```

## Keystore Management

### Generate Keystore (One-time)
```bash
keytool -genkey -v -keystore virtual-mauzin-release.keystore -alias virtual-mauzin -keyalg RSA -keysize 2048 -validity 10000
```

### Verify Keystore
```bash
keytool -list -v -keystore virtual-mauzin-release.keystore
```

### Backup Keystore
**CRITICAL**: Store keystore in multiple secure locations:
- External hard drive
- Cloud storage (encrypted)
- Password manager

**Losing the keystore means you cannot update your app!**

## Server Configuration

### Local Development
```javascript
// Current setup (for testing)
const peerServer = {
  host: 'localhost',
  port: 9000,
  path: '/'
};
```

### Production
```javascript
// Update for production
const peerServer = {
  host: 'your-server.com',
  port: 443,
  path: '/peerjs',
  secure: true
};
```

## Performance Optimization

### Reduce App Size
1. Enable ProGuard in `build.gradle`:
```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
    }
}
```

2. Use AAB instead of APK (automatic optimization)

3. Optimize images and assets

### Improve Load Time
1. Lazy load components
2. Minimize bundle size
3. Use code splitting
4. Optimize images

## Useful Links

### Documentation
- [Capacitor Docs](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/guide)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [WebRTC Documentation](https://webrtc.org/getting-started/overview)

### Tools
- [Android Studio](https://developer.android.com/studio)
- [Google Play Console](https://play.google.com/console)
- [App Icon Generator](https://romannurik.github.io/AndroidAssetStudio/)
- [Screenshot Generator](https://screenshots.pro/)

### Community
- [Capacitor Community](https://github.com/capacitor-community)
- [Android Developers Reddit](https://www.reddit.com/r/androiddev/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/capacitor)

## Emergency Contacts

### If App is Rejected
1. Read rejection email carefully
2. Check Google Play Console for specific issues
3. Fix issues mentioned
4. Increment version code
5. Re-upload and resubmit

### If Users Report Bugs
1. Check crash reports in Play Console
2. Reproduce the issue
3. Fix and test thoroughly
4. Release update quickly
5. Respond to user reviews

## Success Metrics

Track these in Google Play Console:
- **Installs**: Total and active
- **Ratings**: Average and distribution
- **Reviews**: Read and respond
- **Crashes**: Monitor and fix
- **ANRs**: Application Not Responding events
- **Retention**: User retention rate

## Release Workflow

1. **Develop** → Make changes in `src/`
2. **Test** → Test locally with `npm run dev`
3. **Build** → `npm run mobile:build`
4. **Test Mobile** → Test in Android Studio
5. **Update Version** → Increment in `build.gradle`
6. **Sign** → Build signed AAB
7. **Upload** → Upload to Play Console
8. **Review** → Wait for Google's review
9. **Publish** → App goes live
10. **Monitor** → Watch metrics and reviews

## Tips for Success

✅ **Test thoroughly** before each release  
✅ **Respond to reviews** within 24 hours  
✅ **Update regularly** with new features  
✅ **Monitor crashes** and fix quickly  
✅ **Keep privacy policy** up to date  
✅ **Backup keystore** in multiple locations  
✅ **Use staged rollouts** for major updates  
✅ **Collect user feedback** and act on it  

---

**Need more help?** See the full guides:
- **MOBILE_DEPLOYMENT_GUIDE.md** - Complete deployment instructions
- **DEPLOYMENT_CHECKLIST.md** - Step-by-step checklist
- **PRIVACY_POLICY.md** - Privacy policy template
