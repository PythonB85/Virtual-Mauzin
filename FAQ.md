# ❓ Virtual Mauzin - Frequently Asked Questions (FAQ)

## General Questions

### What is Virtual Mauzin?
Virtual Mauzin is a real-time audio broadcasting application that allows one person (broadcaster) to stream audio to multiple listeners simultaneously using peer-to-peer WebRTC technology.

### What platforms does it support?
- **Web**: Works in any modern browser (Chrome, Firefox, Safari, Edge)
- **Android**: Native mobile app via Capacitor
- **iOS**: Possible but not yet implemented

### Is it free?
Yes, the app itself is free. However, publishing to Google Play requires a one-time $25 developer account fee.

---

## Technical Questions

### How does the audio streaming work?
Virtual Mauzin uses WebRTC (Web Real-Time Communication) for peer-to-peer audio streaming. The PeerJS server acts as a signaling server to establish connections, but the actual audio data flows directly between broadcaster and listeners.

### Is audio data stored anywhere?
No. Audio is transmitted in real-time and is never stored on any server. Once the broadcast ends, the audio is gone.

### What's the audio quality?
WebRTC provides high-quality audio streaming with minimal latency. The actual quality depends on:
- Broadcaster's microphone quality
- Network bandwidth
- Number of simultaneous listeners

### How many listeners can connect?
This depends on the broadcaster's upload bandwidth. Each listener requires a separate peer connection. Typical home internet can support 5-10 listeners comfortably.

### What's the latency?
Typically 100-500ms depending on network conditions. WebRTC is designed for low-latency communication.

---

## Development Questions

### Do I need to know Android development?
No! The app is built with React (web technologies). Capacitor handles the conversion to a native Android app. You only need to know React/JavaScript.

### Can I customize the app?
Absolutely! All the source code is in `scratch/client/src/`. You can:
- Change the UI design
- Add new features
- Modify audio settings
- Add recording capabilities
- Implement user authentication

### What if I want to add iOS support?
Run `npx cap add ios` in the client directory. You'll need:
- macOS computer
- Xcode installed
- Apple Developer account ($99/year)

### How do I update the app after publishing?
1. Make your changes
2. Increment `versionCode` in `build.gradle`
3. Build a new signed AAB
4. Upload to Google Play Console
5. Submit for review

---

## Google Play Questions

### How long does Google Play review take?
Typically 1-3 days for the first submission. Updates are usually faster (hours to 1 day).

### What if my app is rejected?
Google will email you with specific reasons. Common issues:
- Missing privacy policy
- Incomplete store listing
- Permission issues
- Content policy violations

Fix the issues and resubmit.

### Do I need a privacy policy?
Yes, it's required by Google Play. We've provided a template in `PRIVACY_POLICY.md`. Customize it with your contact information and host it online.

### Can I test before publishing?
Yes! Use Google Play's Internal Testing track:
1. Upload AAB to Internal Testing
2. Add test users via email
3. They can install and test
4. Collect feedback before public release

### How much does it cost to publish?
- Google Play Developer account: $25 (one-time)
- App itself: Free to publish
- Cloud server (for production): $5-20/month depending on provider

---

## Server Questions

### Why do I need a server?
The PeerJS server is needed for:
- Generating unique peer IDs
- Facilitating WebRTC handshakes
- Managing peer connections

It does NOT handle audio data (that's peer-to-peer).

### Can I use the local server for production?
No. The local server (`localhost:9000`) only works for development. For production, deploy to:
- Heroku (free tier available)
- AWS EC2
- Google Cloud
- DigitalOcean
- Any Node.js hosting

### How do I deploy the server?
Example for Heroku:
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
cd scratch/server
heroku create your-app-name

# Deploy
git push heroku main

# Your server URL: https://your-app-name.herokuapp.com
```

Then update the server URL in your React code.

### What if the server goes down?
Users won't be able to establish new connections. Existing connections may continue working (peer-to-peer), but new listeners can't join.

---

## Build & Deployment Questions

### What's the difference between APK and AAB?
- **APK**: Android Package - installable file for Android
- **AAB**: Android App Bundle - optimized format for Google Play

Google Play requires AAB for new apps. AAB is smaller and allows dynamic delivery.

### How do I test the APK before publishing?
1. Build debug APK: `.\gradlew assembleDebug`
2. Install on device: `adb install app-debug.apk`
3. Or use Android Studio's "Run" button

### What if I lose my keystore?
**Critical**: You cannot update your app without the original keystore. You would have to:
- Publish as a new app (new package name)
- Lose all existing users and reviews

**Always backup your keystore!**

### Can I change the package name after publishing?
No. The package name (`com.virtualmauzin.app`) is permanent once published. To change it, you'd need to publish as a new app.

### How do I reduce app size?
1. Enable ProGuard/R8 in `build.gradle`
2. Use AAB (automatic optimization)
3. Optimize images
4. Remove unused dependencies
5. Use code splitting

---

## Feature Questions

### Can I record broadcasts?
Not currently, but you can add this feature:
1. Use MediaRecorder API in the broadcaster
2. Save recordings locally or to cloud storage
3. Add playback functionality

### Can I add video streaming?
Yes! WebRTC supports video. You'd need to:
1. Request camera permission
2. Capture video stream
3. Update UI for video display
4. Handle increased bandwidth requirements

### Can I add chat functionality?
Yes! WebRTC supports data channels. You can:
1. Create a data channel alongside audio
2. Send text messages
3. Add a chat UI component

### Can I add user accounts?
Yes, but you'd need to:
1. Set up a backend (Firebase, custom server)
2. Implement authentication
3. Store user profiles
4. Manage sessions

### Can I monetize the app?
Yes, options include:
- In-app purchases (via Google Play Billing)
- Subscriptions
- Ads (AdMob)
- Premium features

---

## Troubleshooting Questions

### The app won't build. What do I do?
1. Check error message carefully
2. Ensure Android Studio is installed
3. Verify ANDROID_HOME is set
4. Run `npm install` in client directory
5. Try `.\gradlew clean` in android directory
6. See QUICK_REFERENCE.md troubleshooting section

### Microphone doesn't work on mobile
1. Check AndroidManifest.xml has RECORD_AUDIO permission
2. Verify permission is requested at runtime
3. Check device settings allow microphone access
4. Test on real device (emulators may have issues)

### Audio quality is poor
Possible causes:
- Poor network connection
- Low bandwidth
- Too many listeners
- Microphone quality

Solutions:
- Use better internet connection
- Reduce number of listeners
- Adjust audio constraints in code
- Use better microphone

### App crashes on startup
1. Check Android Studio Logcat for errors
2. Verify all dependencies are installed
3. Check AndroidManifest.xml is correct
4. Ensure dist/ folder has built files
5. Try `npx cap sync` again

### Can't connect to broadcaster
1. Verify PeerJS server is running
2. Check server URL is correct
3. Ensure both users have internet
4. Check firewall settings
5. Try different network

---

## Performance Questions

### How can I improve performance?
1. Optimize React components (use React.memo)
2. Minimize re-renders
3. Use code splitting
4. Optimize images and assets
5. Enable ProGuard for smaller app size

### Why is the app slow?
Possible causes:
- Large bundle size
- Unoptimized code
- Too many re-renders
- Network issues
- Old device

### How much data does streaming use?
Approximate data usage:
- Audio streaming: 0.5-2 MB per minute
- Depends on audio quality settings
- Both broadcaster and listener use data

---

## Security Questions

### Is the app secure?
- WebRTC uses encryption (DTLS-SRTP)
- No audio storage
- Temporary peer IDs
- HTTPS recommended for production

However:
- No user authentication
- Peer IDs are public
- Anyone with peer ID can listen

### Can I add authentication?
Yes, you can implement:
- Password-protected broadcasts
- User accounts
- Access tokens
- Room-based access control

### Is user data collected?
By default, no. The app:
- Doesn't collect personal information
- Doesn't store audio
- Doesn't track users
- Uses minimal connection metadata

See PRIVACY_POLICY.md for details.

---

## Business Questions

### Can I use this commercially?
Yes, but consider:
- Adding terms of service
- Implementing proper privacy policy
- Ensuring GDPR/CCPA compliance
- Getting legal review if needed

### Can I white-label this app?
Yes! You can:
- Change the app name
- Update branding and colors
- Modify package name
- Add your logo
- Customize features

### How do I get users?
- App Store Optimization (ASO)
- Social media marketing
- Content marketing
- Paid advertising
- Word of mouth
- Community building

### How do I handle support?
- Add support email in app
- Create FAQ section
- Use Google Play Console to respond to reviews
- Set up help documentation
- Consider in-app support chat

---

## Legal Questions

### Do I need a business license?
Depends on your location and business structure. Consult local regulations.

### What about copyright for broadcasted content?
Broadcasters are responsible for:
- Having rights to broadcast content
- Complying with copyright laws
- Not broadcasting illegal content

Consider adding terms of service.

### GDPR compliance?
If you have EU users:
- Provide privacy policy
- Allow data deletion
- Get consent for data collection
- Implement data portability

Our template privacy policy covers basics.

### CCPA compliance?
For California users:
- Disclose data collection
- Allow opt-out
- Provide data deletion
- Don't sell personal data

---

## Future Development Questions

### What features should I add next?
Popular additions:
- User accounts
- Broadcast recording
- Scheduled broadcasts
- Chat functionality
- Broadcast discovery
- Analytics dashboard
- Multiple audio quality options

### How do I scale for more users?
1. Use cloud-based PeerJS server
2. Implement load balancing
3. Consider WebRTC SFU for efficiency
4. Use CDN for static assets
5. Optimize database queries (if added)
6. Monitor performance metrics

### Can I make this a SaaS?
Yes! You could:
- Add user accounts
- Implement subscriptions
- Create broadcaster profiles
- Add analytics
- Offer premium features
- Build web dashboard

---

## Getting Help

### Where can I find more information?
- **MOBILE_DEPLOYMENT_GUIDE.md** - Deployment details
- **QUICK_REFERENCE.md** - Common commands
- **ARCHITECTURE.md** - System architecture
- [Capacitor Docs](https://capacitorjs.com/docs)
- [WebRTC Documentation](https://webrtc.org)

### Where can I ask questions?
- Stack Overflow (tag: capacitor, webrtc)
- Capacitor Community Forums
- Reddit: r/androiddev, r/webdev
- GitHub Issues (if open source)

### Can I hire someone to help?
Yes, you can find developers on:
- Upwork
- Fiverr
- Freelancer
- Toptal
- Local development agencies

---

## Quick Answers

**Q: Is coding experience required?**  
A: Basic React/JavaScript knowledge is helpful. Android knowledge is NOT required.

**Q: How long to publish?**  
A: Setup: 1-2 days. Google review: 1-3 days. Total: ~1 week.

**Q: Can I make money?**  
A: Yes, through ads, subscriptions, or in-app purchases.

**Q: Is it difficult?**  
A: Moderate. Follow the guides step-by-step. Most challenging part is Google Play setup.

**Q: Do I need a Mac?**  
A: No, not for Android. Only needed for iOS.

**Q: What's the cost?**  
A: $25 Google Play fee + optional server hosting ($0-20/month).

**Q: Can I test for free?**  
A: Yes! Test locally and on emulator for free.

**Q: How do I get started?**  
A: Read SETUP_COMPLETE.md, then follow MOBILE_DEPLOYMENT_GUIDE.md.

---

**Still have questions?** Check the other documentation files or search online. Most issues have been solved by others before!
