import { useEffect, useState } from 'react';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../services/api';
import { Stats } from '../types';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/employees/stats').then(r => {
      setStats(r.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!stats) return null;

  const cards = [
    { label: 'Total Employees', value: stats.total, icon: Users, color: 'bg-blue-500' },
    { label: 'Active', value: stats.active, icon: UserCheck, color: 'bg-green-500' },
    { label: 'Inactive', value: stats.inactive, icon: UserX, color: 'bg-red-500' },
    { label: 'Avg Salary', value: `₹${Math.round(stats.avgSalary).toLocaleString()}`, icon: TrendingUp, color: 'bg-purple-500' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card flex items-center gap-4">
            <div className={`${color} p-3 rounded-xl`}>
              <Icon size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Employees by Department</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.deptCounts}
                dataKey="count"
                nameKey="department"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ department, percent }) => `${department} (${(percent * 100).toFixed(0)}%)`}
              >
                {stats.deptCounts.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Department Headcount</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.deptCounts}>
              <XAxis dataKey="department" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Employees" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
