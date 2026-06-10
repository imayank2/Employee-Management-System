import { useEffect, useState } from 'react';
import { Plus, Search, Trash2, Edit2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { Employee } from '../types';
import EmployeeModal from '../components/EmployeeModal';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filtered, setFiltered] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; employee?: Employee | null }>({ open: false });
  const [selected, setSelected] = useState<number[]>([]);
  const [viewEmp, setViewEmp] = useState<Employee | null>(null);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
      setFiltered(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  useEffect(() => {
    let data = employees;
    if (search) data = data.filter(e =>
      `${e.firstName} ${e.lastName} ${e.email} ${e.position}`.toLowerCase().includes(search.toLowerCase())
    );
    if (deptFilter) data = data.filter(e => e.department === deptFilter);
    setFiltered(data);
  }, [search, deptFilter, employees]);

  const departments = [...new Set(employees.map(e => e.department))];

  const handleSave = async (data: Partial<Employee>) => {
    try {
      if (modal.employee) {
        await api.put(`/employees/${modal.employee.id}`, data);
        toast.success('Employee updated');
      } else {
        await api.post('/employees', data);
        toast.success('Employee added');
      }
      setModal({ open: false });
      fetchEmployees();
    } catch {
      toast.error('Failed to save employee');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this employee?')) return;
    await api.delete(`/employees/${id}`);
    toast.success('Employee deleted');
    fetchEmployees();
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.length} employees?`)) return;
    await api.delete('/employees/bulk', { data: selected });
    toast.success('Employees deleted');
    setSelected([]);
    fetchEmployees();
  };

  const toggleSelect = (id: number) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-500 text-sm">{filtered.length} records</p>
        </div>
        <div className="flex gap-3">
          {selected.length > 0 && (
            <button onClick={handleBulkDelete} className="btn-danger flex items-center gap-2">
              <Trash2 size={16} /> Delete ({selected.length})
            </button>
          )}
          <button onClick={() => setModal({ open: true, employee: null })} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Employee
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9"
            placeholder="Search employees..."
          />
        </div>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="input w-48">
          <option value="">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="w-10 px-4 py-3"><input type="checkbox" onChange={e => setSelected(e.target.checked ? filtered.map(e => e.id) : [])} /></th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Name</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Department</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Position</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Salary</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(emp => (
              <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.includes(emp.id)} onChange={() => toggleSelect(emp.id)} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                      {emp.firstName[0]}{emp.lastName[0]}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{emp.firstName} {emp.lastName}</div>
                      <div className="text-xs text-gray-500">{emp.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700">{emp.department}</td>
                <td className="px-4 py-3 text-gray-700">{emp.position}</td>
                <td className="px-4 py-3 text-gray-700">₹{emp.salary.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${emp.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {emp.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => setViewEmp(emp)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500">
                      <Eye size={15} />
                    </button>
                    <button onClick={() => setModal({ open: true, employee: emp })} className="p-1.5 hover:bg-blue-50 rounded text-blue-500">
                      <Edit2 size={15} />
                    </button>
                    <button onClick={() => handleDelete(emp.id)} className="p-1.5 hover:bg-red-50 rounded text-red-500">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400">No employees found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Employee Detail View */}
      {viewEmp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl mx-auto mb-3">
                {viewEmp.firstName[0]}{viewEmp.lastName[0]}
              </div>
              <h2 className="text-xl font-bold">{viewEmp.firstName} {viewEmp.lastName}</h2>
              <p className="text-gray-500">{viewEmp.position}</p>
            </div>
            <div className="space-y-3 text-sm">
              {[
                ['Email', viewEmp.email],
                ['Phone', viewEmp.phone || '-'],
                ['Department', viewEmp.department],
                ['Salary', `₹${viewEmp.salary.toLocaleString()}`],
                ['Join Date', new Date(viewEmp.joinDate).toLocaleDateString()],
                ['Status', viewEmp.isActive ? 'Active' : 'Inactive'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setViewEmp(null)} className="btn-secondary w-full mt-6">Close</button>
          </div>
        </div>
      )}

      {modal.open && (
        <EmployeeModal
          employee={modal.employee}
          onSave={handleSave}
          onClose={() => setModal({ open: false })}
        />
      )}
    </div>
  );
}
