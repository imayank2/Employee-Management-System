import { FileSpreadsheet, FileText, Download } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const reports = [
  {
    title: 'Employee Directory',
    description: 'Complete list of all employees with details, department, salary and status.',
    icon: FileText,
    actions: [
      { label: 'Download PDF', url: '/reports/employees/pdf', type: 'pdf', mime: 'application/pdf' },
      { label: 'Download Excel', url: '/reports/employees/excel', type: 'excel', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    ],
  },
  {
    title: 'Attendance Report',
    description: 'Full attendance records with check-in/out times and status.',
    icon: FileSpreadsheet,
    actions: [
      { label: 'Download Excel', url: '/reports/attendance/excel', type: 'excel', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    ],
  },
];

export default function ReportsPage() {
  const handleDownload = async (url: string, filename: string, mime: string) => {
    try {
      const res = await api.get(url, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: mime });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      toast.success('Download started');
    } catch {
      toast.error('Failed to generate report');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-500 mt-1">Download reports in PDF or Excel format</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map(({ title, description, icon: Icon, actions }) => (
          <div key={title} className="card">
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-xl">
                <Icon size={24} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 mt-1 mb-4">{description}</p>
                <div className="flex gap-3 flex-wrap">
                  {actions.map(action => (
                    <button
                      key={action.label}
                      onClick={() => handleDownload(
                        action.url,
                        `${title.toLowerCase().replace(/ /g, '_')}.${action.type === 'pdf' ? 'pdf' : 'xlsx'}`,
                        action.mime
                      )}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      <Download size={14} />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
