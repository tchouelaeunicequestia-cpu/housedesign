'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getTranslator } from '@/lib/translations';
import { Calendar, CheckCircle2, Clock, XCircle, Trash2, Mail, Phone, User, FileText, Check } from 'lucide-react';
import api from '@/lib/api';

interface Appointment {
  id: string;
  name: string;
  email: string;
  phone?: string;
  appointmentDate: string;
  serviceType?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function AppointmentsList() {
  const t = getTranslator('AdminPage.appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/appointment');
      setAppointments(response.data);
    } catch (error) {
      console.error('Failed to load appointments:', error);
      toast.error(t('loading'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.patch(`/appointment/${id}/status`, { status });
      toast.success(t('updateSuccess'));
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment record?')) return;
    try {
      await api.delete(`/appointment/${id}`);
      toast.success(t('deleteSuccess'));
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to delete appointment');
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-cyan-950 text-cyan-400 border-cyan-800/50';
      case 'completed':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800/50';
      case 'cancelled':
        return 'bg-red-950 text-red-400 border-red-800/50';
      default:
        return 'bg-amber-950 text-amber-400 border-amber-800/50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            {t('title')}
          </h2>
          <p className="text-xs text-slate-400 mt-1">{t('subtitle')}</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">All Appointments ({appointments.length})</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-slate-400 text-sm bg-slate-900 border border-slate-800 rounded-2xl">
          {t('loading')}
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-20 text-slate-400 text-sm bg-slate-900 border border-slate-800 rounded-2xl">
          {t('empty')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAppointments.map((app) => (
            <div
              key={app.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-base font-bold text-white">{app.name}</h3>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold uppercase ${getStatusBadge(app.status)}`}>
                    {t(`status.${app.status}` as any) || app.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`mailto:${app.email}`} className="hover:text-cyan-400 truncate">
                      {app.email}
                    </a>
                  </div>
                  {app.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <a href={`tel:${app.phone}`} className="hover:text-cyan-400">
                        {app.phone}
                      </a>
                    </div>
                  )}
                </div>

                <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {new Date(app.appointmentDate).toLocaleString('fr-FR', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                  {app.serviceType && (
                    <div className="text-xs text-slate-300 font-medium">
                      <span className="text-slate-500">Service:</span> {app.serviceType}
                    </div>
                  )}
                  {app.notes && (
                    <div className="text-xs text-slate-400 flex items-start gap-1.5 pt-1 border-t border-slate-900">
                      <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                      <p className="line-clamp-2">{app.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  {app.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(app.id, 'confirmed')}
                      className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-400 border border-cyan-800 text-xs rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{t('actions.confirm')}</span>
                    </button>
                  )}
                  {app.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusChange(app.id, 'completed')}
                      className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 text-xs rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t('actions.complete')}</span>
                    </button>
                  )}
                  {app.status !== 'cancelled' && (
                    <button
                      onClick={() => handleStatusChange(app.id, 'cancelled')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs rounded-lg font-medium flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t('actions.cancel')}</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(app.id)}
                  className="p-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-800/50 rounded-lg transition-colors cursor-pointer"
                  title={t('actions.delete')}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
