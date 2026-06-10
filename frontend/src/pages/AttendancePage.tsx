import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { Attendance, Employee } from '../types';

const STATUS_COLORS: Record<string, string> = {
  Present: 'bg-green-100 text-green-700',
  Absent: 'bg-red-100 text-red-700',
  Late: 'bg-yellow-100 text-yellow-700',
  'Half-Day': 'bg-blue-100 text-blue-700',
};

export default function AttendancePage() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ employeeId: '', date: new Date().toISOString().split('T')[0], status: 'Present', checkIn: '', checkOut: '' });

  const fetchData = async () => {
    const [att, emp] = await Promise.all([api.get('/attendance'), api.get('/employees')]);
    setRecords(att.data);
    setEmployees(emp.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async () => {
    try {
      await api.post('/attendance', {
        employeeId: parseInt(form.employeeId),
        date: form.date,
        status: form.status,
        checkIn: form.checkIn || null,
        checkOut: form.checkOut || null,
      });
      toast.success('Attendance recorded');
      setShowAdd(false);
      setForm({ employeeId: '', date: new Date().toISOString().split('T')[0], status: 'Present', checkIn: '', checkOut: '' });
      fetchData();
    } catch {
      toast.error('Failed to record attendance');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Mark Attendance
        </button>
      </div>

      {showAdd && (
        <div className="card mb-6">
          <h2 className="font-semibold mb-4">Record Attendance</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee *</label>
              <select value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })} className="input">
                <option value="">Select employee</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="input">
                {['Present', 'Absent', 'Late', 'Half-Day'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
              <input type="time" value={form.checkIn} onChange={e => setForm({ ...form, checkIn: e.target.value })} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
              <input type="time" value={form.checkOut} onChange={e => setForm({ ...form, checkOut: e.target.value })} className="input" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleAdd} disabled={!form.employeeId} className="btn-primary">Save</button>
            <button onClick={() => setShowAdd(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Employee', 'Department', 'Date', 'Check In', 'Check Out', 'Status'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {records.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">
                  {r.employee ? `${r.employee.firstName} ${r.employee.lastName}` : `#${r.employeeId}`}
                </td>
                <td className="px-4 py-3 text-gray-600">{r.employee?.department || '-'}</td>
                <td className="px-4 py-3 text-gray-600">{new Date(r.date).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-gray-600">{r.checkIn || '-'}</td>
                <td className="px-4 py-3 text-gray-600">{r.checkOut || '-'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[r.status] || ''}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400">No attendance records yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
