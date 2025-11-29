import React, { useState } from 'react';
import Broadcaster from './components/Broadcaster';
import Listener from './components/Listener';
import { Radio, Headphones } from 'lucide-react';
import './styles/index.css';

function App() {
  const [role, setRole] = useState(null); // 'broadcaster' | 'listener' | null

  if (role === 'broadcaster') {
    return <Broadcaster onBack={() => setRole(null)} />;
  }

  if (role === 'listener') {
    return <Listener onBack={() => setRole(null)} />;
  }

  return (
    <div className="card" style={{ textAlign: 'center', marginTop: '40px' }}>
      <h1>Virtual-Mauzin</h1>
      <p style={{ color: '#94a3b8', marginBottom: '40px' }}>
        Real-time high quality audio broadcasting for everyone.
      </p>

      <button className="btn-primary" onClick={() => setRole('broadcaster')}>
        <Radio size={20} />
        Start Broadcast
      </button>

      <button className="btn-secondary" onClick={() => setRole('listener')}>
        <Headphones size={20} />
        Join Broadcast
      </button>
    </div>
  );
}

export default App;
