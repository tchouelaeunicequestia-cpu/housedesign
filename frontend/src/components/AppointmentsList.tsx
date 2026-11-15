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
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-700" />
            {t('title')}
          </h2>
          <p className="text-xs text-slate-600 mt-1">{t('subtitle')}</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
        <div className="text-center py-20 text-slate-600 text-sm bg-slate-50 border border-slate-200 rounded-2xl">
          {t('loading')}
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-20 text-slate-600 text-sm bg-slate-50 border border-slate-200 rounded-2xl">
          {t('empty')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAppointments.map((app) => (
            <div
              key={app.id}
              className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-lg flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-700" />
                    <h3 className="text-base font-bold text-slate-900">{app.name}</h3>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold uppercase ${getStatusBadge(app.status)}`}>
                    {t(`status.${app.status}` as any) || app.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-600" />
                    <a href={`mailto:${app.email}`} className="hover:text-blue-700 truncate">
                      {app.email}
                    </a>
                  </div>
                  {app.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-600" />
                      <a href={`tel:${app.phone}`} className="hover:text-blue-700">
                        {app.phone}
                      </a>
                    </div>
                  )}
                </div>

                <div className="bg-white border border-slate-200/80 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-blue-700 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {new Date(app.appointmentDate).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                  {app.serviceType && (
                    <div className="text-xs text-slate-700 font-medium">
                      <span className="text-slate-500">Service:</span> {app.serviceType}
                    </div>
                  )}
                  {app.notes && (
                    <div className="text-xs text-slate-600 flex items-start gap-1.5 pt-1 border-t border-slate-200">
                      <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                      <p className="line-clamp-2">{app.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  {app.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(app.id, 'confirmed')}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{t('actions.confirm')}</span>
                    </button>
                  )}
                  {app.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusChange(app.id, 'completed')}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t('actions.complete')}</span>
                    </button>
                  )}
                  {app.status !== 'cancelled' && (
                    <button
                      onClick={() => handleStatusChange(app.id, 'cancelled')}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs rounded-lg font-medium flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5 text-amber-700" />
                      <span>{t('actions.cancel')}</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(app.id)}
                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg transition-colors cursor-pointer"
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