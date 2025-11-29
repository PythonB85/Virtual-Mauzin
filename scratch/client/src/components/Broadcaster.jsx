import React, { useEffect, useState, useRef } from 'react';
import Peer from 'peerjs';
import { Mic, MicOff, Users, LogOut } from 'lucide-react';
import { PEER_CONFIG } from '../config/peerConfig';

// Generate random durations outside component to avoid impure function calls
const BAR_DURATIONS = [...Array(5)].map(() => `${0.5 + Math.random()}s`);

const Broadcaster = ({ onBack }) => {
    const [isStreaming, setIsStreaming] = useState(false);
    const [listenerCount, setListenerCount] = useState(0);
    const [error, setError] = useState('');
    const [isConnecting, setIsConnecting] = useState(true);

    const peerRef = useRef(null);
    const streamRef = useRef(null);
    const connectionsRef = useRef([]);

    // Fixed broadcaster ID - only one broadcaster at a time
    const BROADCASTER_ID = 'main-broadcast';

    useEffect(() => {
        // Use fixed ID instead of auto-generated
        const peer = new Peer(BROADCASTER_ID, PEER_CONFIG);

        peer.on('open', (id) => {
            console.log('Broadcaster connected with ID:', id);
            setIsConnecting(false);
        });

        peer.on('connection', (conn) => {
            connectionsRef.current.push(conn);
            setListenerCount(prev => prev + 1);

            // If we are already streaming, call the new peer immediately
            if (streamRef.current) {
                peer.call(conn.peer, streamRef.current);
            }

            conn.on('close', () => {
                connectionsRef.current = connectionsRef.current.filter(c => c !== conn);
                setListenerCount(prev => Math.max(0, prev - 1));
            });
        });

        peer.on('error', (err) => {
            console.error(err);
            setError('Connection error: ' + err.type);
        });

        peerRef.current = peer;

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            peer.destroy();
        };
    }, []);

    const toggleBroadcast = async () => {
        if (isStreaming) {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            setIsStreaming(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                streamRef.current = stream;
                setIsStreaming(true);
                setError('');

                // Call all connected peers
                connectionsRef.current.forEach(conn => {
                    peerRef.current.call(conn.peer, stream);
                });

            } catch (err) {
                console.error('Failed to get local stream', err);
                setError('Could not access microphone. Please allow permissions.');
            }
        }
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Broadcaster</h2>
                <button onClick={onBack} style={{ width: 'auto', padding: '8px', background: 'transparent', color: '#94a3b8' }}>
                    <LogOut size={20} />
                </button>
            </div>

            {error && <div style={{ color: '#ef4444', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}

            {isConnecting && (
                <div style={{ color: '#94a3b8', marginBottom: '20px', textAlign: 'center' }}>
                    Connecting to broadcast server...
                </div>
            )}

            <div className="visualizer">
                {BAR_DURATIONS.map((duration, i) => (
                    <div
                        key={i}
                        className="bar"
                        style={{
                            animationDuration: duration,
                            opacity: isStreaming ? 1 : 0.3,
                            height: isStreaming ? '100%' : '20%'
                        }}
                    />
                ))}
            </div>

            <div style={{ textAlign: 'center', marginBottom: '20px', color: '#94a3b8' }}>
                <Users size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                {listenerCount} Listener{listenerCount !== 1 ? 's' : ''} connected
            </div>

            <button
                className={isStreaming ? 'btn-danger' : 'btn-primary'}
                onClick={toggleBroadcast}
            >
                {isStreaming ? <MicOff /> : <Mic />}
                {isStreaming ? 'Stop Broadcast' : 'Start Broadcast'}
            </button>
        </div>
    );
};

export default Broadcaster;
