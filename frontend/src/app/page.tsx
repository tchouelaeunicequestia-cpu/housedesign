'use client';
import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Home() {
  const [message, setMessage] = useState('Connecting...');

  useEffect(() => {
    api.get('/')
      .then(res => {
        const backendMessage = typeof res.data === 'string' ? res.data : (res.data.message || JSON.stringify(res.data));
        setMessage('Connected! Backend says: ' + backendMessage);
      })
      .catch(err => setMessage('Backend not reachable: ' + err.message));
  }, []);

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">API Connection Status:</h1>
      <p>{message}</p>
    </main>
  );
}
