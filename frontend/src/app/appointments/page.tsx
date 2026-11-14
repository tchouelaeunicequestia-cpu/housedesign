"use client";

import React, { useState } from 'react';
import api from '@/lib/api';
import GoogleTranslate from '@/components/GoogleTranslate';
import styles from './appointments.module.css';

export default function AppointmentsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    appointmentDate: '',
    serviceType: 'Initial Consultation',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await api.post('/appointments', formData);
      setIsSuccess(true);
    } catch (error) {
      console.error('Failed to book appointment:', error);
      alert('Failed to book appointment. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundGlow}></div>
      <div className={styles.backgroundGlow2}></div>
      
      <div className={styles.header}>
        <div className={styles.translate}>
          <GoogleTranslate />
        </div>
        <h1 className={styles.title}>Book a Consultation</h1>
        <p className={styles.subtitle}>
          Schedule a time with our expert engineers to discuss your next big project. 
          We'll get back to you shortly to confirm the details.
        </p>
      </div>

      <div className={styles.card}>
        {isSuccess ? (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✓</div>
            <h2 className={styles.successTitle}>Request Sent!</h2>
            <p className={styles.successText}>
              Thank you, {formData.name}. Your appointment request for {new Date(formData.appointmentDate).toLocaleString()} has been sent to our team. We will contact you soon to confirm.
            </p>
            <button 
              className={styles.button}
              onClick={() => {
                setIsSuccess(false);
                setFormData({ ...formData, appointmentDate: '', notes: '' });
              }}
            >
              Book Another Appointment
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.formGroup + ' ' + styles.col}>
                <label className={styles.label}>Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  className={styles.input} 
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup + ' ' + styles.col}>
                <label className={styles.label}>Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  className={styles.input} 
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup + ' ' + styles.col}>
                <label className={styles.label}>Phone Number (Optional)</label>
                <input 
                  type="tel" 
                  name="phone"
                  className={styles.input} 
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup + ' ' + styles.col}>
                <label className={styles.label}>Service Type</label>
                <select 
                  name="serviceType"
                  className={styles.input}
                  value={formData.serviceType}
                  onChange={handleChange}
                >
                  <option value="Initial Consultation">Initial Consultation</option>
                  <option value="Site Visit">Site Visit</option>
                  <option value="Structural Analysis">Structural Analysis</option>
                  <option value="Project Planning">Project Planning</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Preferred Date & Time</label>
              <input 
                type="datetime-local" 
                name="appointmentDate"
                required
                className={styles.input} 
                value={formData.appointmentDate}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Project Details</label>
              <textarea 
                name="notes"
                className={styles.input} 
                placeholder="Briefly describe your project or what you'd like to discuss..."
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit" className={styles.button} disabled={isSubmitting}>
              {isSubmitting ? 'Sending Request...' : 'Book Appointment'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
