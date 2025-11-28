Æhimport React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, Platform } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { io } from 'socket.io-client';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

// Default to the Wi-Fi IP found
const DEFAULT_SERVER_URL = 'http://10.40.215.196:3000';

export default function App() {
  const [role, setRole] = useState(null); // 'broadcaster' | 'listener' | null
  const [serverUrl, setServerUrl] = useState(DEFAULT_SERVER_URL);
  const [connected, setConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [statusMsg, setStatusMsg] = useState('Ready to connect');
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => {
    console.log(msg);
    setLogs(prev => [`${new Date().toLocaleTimeString()} - ${msg}`, ...prev].slice(0, 10));
  };

  const socketRef = useRef(null);
  const recordingRef = useRef(null);
  const soundQueueRef = useRef([]);
  const isProcessingQueueRef = useRef(false);
  const recordingLoopRef = useRef(null);

  useEffect(() => {
    return () => {
      disconnectSocket();
      stopRecording();
      stopPlayback();
    };
  }, []);

  const connectSocket = () => {
    if (socketRef.current) return;

    try {
      const socket = io(serverUrl);
      socketRef.current = socket;

      socket.on('connect', () => {
        setConnected(true);
        setStatusMsg('Connected to server');
        addLog('Connected to ' + serverUrl);
      });

      socket.on('disconnect', () => {
        setConnected(false);
        setStatusMsg('Disconnected from server');
        addLog('Disconnected');
        stopRecording();
        stopPlayback();
      });

      socket.on('audio-chunk', async (chunk) => {
        if (role === 'listener') {
          addLog(`Received chunk: ${chunk.length} chars`);
          await handleIncomingAudio(chunk);
        }
      });

    } catch (error) {
      Alert.alert('Connection Error', error.message);
      addLog('Error: ' + error.message);
    }
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setConnected(false);
    }
  };

  const joinAs = (selectedRole) => {
    if (!connected) {
      connectSocket();
    }
    // Wait a bit for connection or just join immediately if already connected logic could be better
    // But for simplicity, we assume connection is fast or we handle it in 'connect' event
    // Ideally we emit 'join' after connection.

    // We'll use a timeout to ensure socket is ready or check connected state
    setTimeout(() => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('join', selectedRole);
        setRole(selectedRole);
        setStatusMsg(`Joined as ${selectedRole}`);
      } else {
        // If not connected yet, try to connect and then join
        connectSocket();
        setRole(selectedRole); // Optimistic update, actual join emit might need to happen in 'connect' listener
      }
    }, 500);
  };

  // --- Broadcaster Logic ---

  const startRecording = async () => {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status !== 'granted') {
        Alert.alert('Permission missing', 'Microphone permission is required');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      setIsRecording(true);
      setStatusMsg('Broadcasting...');

      // Start the recording loop
      recordingLoop();

    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const recordingLoop = async () => {
    if (recordingLoopRef.current) return;

    const recordAndSend = async () => {
      if (!socketRef.current || !socketRef.current.connected) return;

      try {
        const recording = new Audio.Recording();
        // Use better quality settings
        await recording.prepareToRecordAsync({
          android: {
            extension: '.m4a',
            outputFormat: Audio.AndroidOutputFormat.MPEG_4,
            audioEncoder: Audio.AndroidAudioEncoder.AAC,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          ios: {
            extension: '.m4a',
            audioQuality: Audio.IOSAudioQuality.HIGH,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
          web: {
            mimeType: 'audio/webm',
            bitsPerSecond: 128000,
          },
        });
        recordingRef.current = recording;

        await recording.startAsync();

        // Record for a short duration (e.g., 500ms for lower latency)
        await new Promise(resolve => setTimeout(resolve, 500));

        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();

        if (uri) {
          const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
          socketRef.current.emit('audio-chunk', base64);
          addLog(`Sent chunk: ${base64.length} chars`);
          // Clean up file
          await FileSystem.deleteAsync(uri, { idempotent: true });
        }

      } catch (error) {
        console.log('Recording error', error);
        addLog('Rec Error: ' + error.message);
      }
    };

    // Loop indefinitely while isRecording is true
    // We use a while loop inside an async function wrapper to keep it going
    recordingLoopRef.current = true;
    while (recordingLoopRef.current) {
      await recordAndSend();
    }
  };

  const stopRecording = async () => {
    recordingLoopRef.current = false;
    setIsRecording(false);
    setStatusMsg('Broadcasting stopped');

    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch (e) { }
      recordingRef.current = null;
    }
  };

  // --- Listener Logic ---

  const handleIncomingAudio = async (base64Chunk) => {
    // Write to a temp file
    const filename = `${FileSystem.cacheDirectory}audio_${Date.now()}_${Math.random()}.m4a`;
    await FileSystem.writeAsStringAsync(filename, base64Chunk, { encoding: 'base64' });

    soundQueueRef.current.push(filename);
    processSoundQueue();
  };

  const processSoundQueue = async () => {
    if (isProcessingQueueRef.current) return;
    if (soundQueueRef.current.length === 0) return;

    isProcessingQueueRef.current = true;
    const uri = soundQueueRef.current.shift();

    try {
      const { sound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: true });

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          await sound.unloadAsync();
          await FileSystem.deleteAsync(uri, { idempotent: true });
          isProcessingQueueRef.current = false;
          processSoundQueue(); // Play next
        }
      });
    } catch (error) {
      console.log('Playback error', error);
      isProcessingQueueRef.current = false;
      processSoundQueue();
    }
  };

  const stopPlayback = () => {
    soundQueueRef.current = [];
    isProcessingQueueRef.current = false;
  };

  // --- UI Components ---

  const renderRoleSelection = () => (
    <View style={styles.card}>
      <Text style={styles.title}>Select Your Role</Text>
      <TouchableOpacity style={styles.button} onPress={() => joinAs('broadcaster')}>
        <Text style={styles.buttonText}>üéôÔ∏è Start Broadcasting</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => joinAs('listener')}>
        <Text style={styles.buttonText}>üéß Join as Listener</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBroadcaster = () => (
    <View style={styles.card}>
      <Text style={styles.roleTitle}>You are the Muazin</Text>
      <View style={[styles.indicator, isRecording ? styles.indicatorActive : styles.indicatorInactive]} />
      <Text style={styles.statusText}>{statusMsg}</Text>

      <TouchableOpacity
        style={[styles.actionButton, isRecording ? styles.stopButton : styles.startButton]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.actionButtonText}>{isRecording ? 'Stop Live' : 'Go Live'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => { stopRecording(); setRole(null); }}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );

  const renderListener = () => (
    <View style={styles.card}>
      <Text style={styles.roleTitle}>Listening to Live Feed</Text>
      <View style={[styles.indicator, connected ? styles.indicatorActive : styles.indicatorInactive]} />
      <Text style={styles.statusText}>{statusMsg}</Text>

      <TouchableOpacity style={styles.backButton} onPress={() => { stopPlayback(); setRole(null); }}>
        <Text style={styles.backButtonText}>Leave Stream</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={['#1a2a6c', '#b21f1f', '#fdbb2d']} style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Mauzin</Text>
      </View>

      <View style={styles.content}>
        {!role && (
          <View style={styles.config}>
            <Text style={styles.label}>Server URL:</Text>
            <TextInput
              style={styles.input}
              value={serverUrl}
              onChangeText={setServerUrl}
              placeholder="http://192.168.x.x:3000"
              placeholderTextColor="#ccc"
            />
          </View>
        )}

        {!role && renderRoleSelection()}
        {role === 'broadcaster' && renderBroadcaster()}
        {role === 'listener' && renderListener()}

        <View style={styles.logsContainer}>
          <Text style={styles.logsTitle}>Debug Logs:</Text>
          <ScrollView style={styles.logsScroll}>
            {logs.map((log, i) => (
              <Text key={i} style={styles.logText}>{log}</Text>
            ))}
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 40,
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  logsContainer: {
    marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 10,
    height: 150,
  },
  logsTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  logsScroll: {
    flex: 1,
  },
  logText: {
    color: '#0f0',
    fontSize: 10,
    fontFamily: 'monospace',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 30,
    color: '#333',
  },
  roleTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#1a2a6c',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  secondaryButton: {
    backgroundColor: '#b21f1f',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  config: {
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 15,
    borderRadius: 10,
  },
  label: {
    color: '#fff',
    marginBottom: 5,
    fontSize: 14,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  indicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  indicatorActive: {
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  indicatorInactive: {
    backgroundColor: '#ccc',
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  actionButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 5,
    borderColor: '#fff',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
  },
});
ò *cascade08òô*cascade08ôú *cascade08ú°*cascade08°¢ *cascade08¢§*cascade08§• *cascade08•®*cascade08®© *cascade08©™*cascade08™œ *cascade08œ–*cascade08–— *cascade08—”*cascade08”‘ *cascade08‘’*cascade08’÷ *cascade08÷◊*cascade08◊ÿ *cascade08ÿ€*cascade08€˙ *cascade08˙∂*cascade08∂˚ *cascade08˚®*cascade08®® *cascade08®»*cascade08»Ÿ *cascade08Ÿî*cascade08î° *cascade08° *cascade08 ¸  *cascade08¸ £!*cascade08£!»! *cascade08»!ò"*cascade08ò"û" *cascade08û"Õ"*cascade08Õ"œ" *cascade08œ"—"*cascade08—"“" *cascade08“"÷"*cascade08÷"ÿ" *cascade08ÿ"€"*cascade08€"‹" *cascade08‹"‰"*cascade08‰"Ê" *cascade08Ê"Á"*cascade08Á"Ë" *cascade08Ë"ˇ"*cascade08ˇ"Ä# *cascade08Ä#£#*cascade08£#§# *cascade08§#´#*cascade08´#¨# *cascade08¨#≠#*cascade08≠#Æ# *cascade08Æ#≈#*cascade08≈#∆# *cascade08∆#¸#*cascade08¸#˝# *cascade08˝#ˇ#*cascade08ˇ#Ä$ *cascade08Ä$Ü$*cascade08Ü$á$ *cascade08á$ó$*cascade08ó$ô$ *cascade08ô$ù$*cascade08ù$û$ *cascade08û$ü$*cascade08ü$•$ *cascade08•$¶$*cascade08¶$ß$ *cascade08ß$´$*cascade08´$¨$ *cascade08¨$‚$*cascade08‚$„$ *cascade08„$ı$*cascade08ı$ˆ$ *cascade08ˆ$¯$*cascade08¯$˘$ *cascade08˘$˝$*cascade08˝$˛$ *cascade08˛$î%*cascade08î%ñ% *cascade08ñ%±%*cascade08±%≤% *cascade08≤%∑%*cascade08∑%∏% *cascade08∏%‘%*cascade08‘%’% *cascade08’%·%*cascade08·%„% *cascade08„%Ë%*cascade08Ë%È% *cascade08È%˘%*cascade08˘%˙% *cascade08˙%Ç&*cascade08Ç&É& *cascade08É&ç&*cascade08ç&é& *cascade08é&…&*cascade08…&À& *cascade08À&Í&*cascade08Í&Î& *cascade08Î&é'*cascade08é'è( *cascade08è(ê(*cascade08ê(ï( *cascade08ï(ó(*cascade08ó(¶( *cascade08¶(ß(*cascade08ß(·( *cascade08·(‚(*cascade08‚(†* *cascade08†*¢**cascade08¢*ß* *cascade08ß*®**cascade08®*Ê* *cascade08Ê*û+*cascade08û+Œ, *cascade08Œ,˝,*cascade08˝,÷3 *cascade08÷3ÿ3*cascade08ÿ3›3 *cascade08›3ﬁ3*cascade08ﬁ3™P *cascade08™P‡R*cascade08‡RÎS *cascade08ÎSÏS*cascade08ÏSõT *cascade08õTúT*cascade08úTƒT *cascade08ƒT≈T*cascade08≈TóV *cascade08óVËV*cascade08ËVÍV *cascade08ÍVáW*cascade08áWâW *cascade08âWòW*cascade08òWôW *cascade08ôW¨W*cascade08¨W≠W *cascade08≠W¡W*cascade08¡W¬W *cascade08¬WÃW*cascade08ÃWœW *cascade08œW–W*cascade08–W—W *cascade08—W‘W*cascade08‘WÿW *cascade08ÿWÄX*cascade08ÄXÅX *cascade08ÅXèX*cascade08èXêX *cascade08êX¡X*cascade08¡X√X *cascade08√X∆X*cascade08∆X«X *cascade08«XÁX*cascade08ÁXÆh *cascade08"(095e6696d2704015339a2a6679ba833d0ff29c8a2Afile:///e:/Projects_2743/MobileApps/Live_Muazin/mobile-app/App.js::file:///e:/Projects_2743/MobileApps/Live_Muazin/mobile-app