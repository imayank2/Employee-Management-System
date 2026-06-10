import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Employee } from '../types';

interface Props {
  employee?: Employee | null;
  onSave: (data: Partial<Employee>) => void;
  onClose: () => void;
}

const DEPARTMENTS = ['Engineering', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations', 'Legal'];

export default function EmployeeModal({ employee, onSave, onClose }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Partial<Employee>>();

  useEffect(() => {
    if (employee) {
      reset({
        ...employee,
        joinDate: employee.joinDate?.split('T')[0],
      });
    } else {
      reset({ isActive: true, joinDate: new Date().toISOString().split('T')[0] });
    }
  }, [employee, reset]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">{employee ? 'Edit Employee' : 'Add New Employee'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input {...register('firstName', { required: 'Required' })} className="input" placeholder="John" />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input {...register('lastName', { required: 'Required' })} className="input" placeholder="Doe" />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} className="input" placeholder="john@company.com" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input {...register('phone')} className="input" placeholder="+91 9000000000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
              <select {...register('department', { required: 'Required' })} className="input">
                <option value="">Select department</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
              <input {...register('position', { required: 'Required' })} className="input" placeholder="Software Engineer" />
              {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary (₹)</label>
              <input {...register('salary', { valueAsNumber: true })} type="number" className="input" placeholder="50000" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
              <input {...register('joinDate')} type="date" className="input" />
            </div>
            {employee && (
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input {...register('isActive')} type="checkbox" className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-700">Active Employee</span>
                </label>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">
              {employee ? 'Update Employee' : 'Add Employee'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
