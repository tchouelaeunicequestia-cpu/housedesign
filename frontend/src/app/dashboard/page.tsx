"use client";

import React, { useState } from 'react';
import styles from './dashboard.module.css';
import GoogleTranslate from '@/components/GoogleTranslate';

export default function DashboardPage() {
  // Since we don't have full client authentication yet, this serves as a Tracking Portal
  const [email, setEmail] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  
  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTracking(true);
    // In a real scenario, this would fetch from a new endpoint like GET /appointments/track?email=...
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Client Portal</h1>
          <GoogleTranslate />
        </div>

        {!isTracking ? (
          <div className={styles.section} style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <h2 className={styles.sectionTitle} style={{ justifyContent: 'center' }}>Track Your Status</h2>
            <p className={styles.emptyState} style={{ padding: '20px 0' }}>
              Enter your email address to view the status of your appointments and marketplace offers.
            </p>
            <form onSubmit={handleTrack} style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="email" 
                required 
                placeholder="client@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ 
                  flex: 1, padding: '15px', borderRadius: '8px', 
                  background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' 
                }}
              />
              <button 
                type="submit"
                style={{
                  padding: '15px 25px', borderRadius: '8px', border: 'none',
                  background: 'linear-gradient(to right, #38bdf8, #2563eb)', color: 'white',
                  fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                View Dashboard
              </button>
            </form>
          </div>
        ) : (
          <div className={styles.grid}>
            {/* Appointments Section */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                🗓️ Your Appointments
              </h2>
              <div className={styles.list}>
                {/* Mock Data */}
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>Initial Consultation</span>
                    <span className={`${styles.badge} ${styles.badgePending}`}>Pending</span>
                  </div>
                  <div className={styles.detailRow}>📅 Oct 12, 2026 - 10:00 AM</div>
                  <div className={styles.detailRow}>📍 Online Meeting</div>
                </div>
              </div>
              <p className={styles.emptyState} style={{ fontSize: '0.85rem', marginTop: '20px' }}>
                Note: This is a preview. To manage real appointments, please contact support.
              </p>
            </div>

            {/* Offers Section */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                💼 Marketplace Offers
              </h2>
              <div className={styles.list}>
                <div className={styles.emptyState}>
                  You have not made any offers yet. Head to the Marketplace to explore our assets and designs.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
