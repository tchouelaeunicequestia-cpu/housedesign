'use client';
import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Home() {
  const [message, setMessage] = useState('Connecting...');

  useEffect(() => {
    api.get('/')
      .then(res => setMessage('Connected! Backend says: ' + res.data))
      .catch(err => setMessage('Backend not reachable: ' + err.message));
  }, []);

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">API Connection Status:</h1>
      <p>{message}</p>
    </main>
  );
}
