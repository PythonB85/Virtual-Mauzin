import React, { useEffect, useState, useRef } from 'react';
import Peer from 'peerjs';
import { Radio, LogOut } from 'lucide-react';
import { PEER_CONFIG } from '../config/peerConfig';

// Generate random durations outside component to avoid impure function calls
const BAR_DURATIONS = [...Array(5)].map(() => `${0.4 + Math.random()}s`);

const Listener = ({ onBack }) => {
    const [targetId, setTargetId] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [status, setStatus] = useState('Disconnected');
    const [error, setError] = useState('');

    const peerRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
        const peer = new Peer(null, PEER_CONFIG);

        peer.on('open', () => {
            // peerId is set but not used in this component
        });

        peer.on('call', (call) => {
            call.answer(); // Answer the call automatically
            call.on('stream', (remoteStream) => {
                if (audioRef.current) {
                    audioRef.current.srcObject = remoteStream;
                    audioRef.current.play().catch(e => console.error("Auto-play failed", e));
                    setStatus('Receiving Audio');
                }
            });
        });

        peer.on('error', (err) => {
            console.error(err);
            setError('Connection error: ' + err.type);
            setIsConnected(false);
            setStatus('Error');
        });

        peerRef.current = peer;

        return () => {
            peer.destroy();
        };
    }, []);

    const connectToBroadcaster = () => {
        if (!targetId) {
            setError('Please enter a Broadcaster ID');
            return;
        }

        setError('');
        setStatus('Connecting...');

        // We connect to the broadcaster so they know we exist.
        // The broadcaster will then call us back with the stream.
        const conn = peerRef.current.connect(targetId);

        conn.on('open', () => {
            setIsConnected(true);
            setStatus('Connected. Waiting for audio...');
        });

        conn.on('close', () => {
            setIsConnected(false);
            setStatus('Disconnected');
        });

        conn.on('error', (err) => {
            console.error("Connection error:", err);
            setError("Could not connect to broadcaster.");
            setIsConnected(false);
        });
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Listener</h2>
                <button onClick={onBack} style={{ width: 'auto', padding: '8px', background: 'transparent', color: '#94a3b8' }}>
                    <LogOut size={20} />
                </button>
            </div>

            {!isConnected ? (
                <>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Broadcaster ID</label>
                        <input
                            type="text"
                            placeholder="Enter ID to join..."
                            value={targetId}
                            onChange={(e) => setTargetId(e.target.value)}
                        />
                    </div>
                    {error && <div style={{ color: '#ef4444', marginBottom: '10px' }}>{error}</div>}
                    <button className="btn-primary" onClick={connectToBroadcaster}>
                        Connect
                    </button>
                </>
            ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div className={`status-indicator ${status.includes('Receiving') ? 'status-connected' : 'status-disconnected'}`} />
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{status}</span>

                    <div className="visualizer" style={{ marginTop: '40px' }}>
                        {(() => {
                            const isReceiving = status.includes('Receiving');
                            return BAR_DURATIONS.map((duration, i) => (
                                <div
                                    key={i}
                                    className="bar"
                                    style={{
                                        animationDuration: duration,
                                        height: isReceiving ? '100%' : '10%',
                                        opacity: isReceiving ? 1 : 0.2
                                    }}
                                />
                            ));
                        })()}
                    </div>

                    <audio ref={audioRef} controls style={{ width: '100%', marginTop: '20px', display: 'none' }} />

                    <div style={{ marginTop: '20px', color: '#94a3b8' }}>
                        <Radio size={24} style={{ marginBottom: '8px' }} />
                        <div>Listening to broadcast</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Listener;
