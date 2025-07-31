import React, { useState } from 'react';
import { THEME } from '../../constants';
import { DocumentArrowDownIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

type ReportType = 'employee_productivity' | 'project_billing' | 'attendance';

const AdvancedReports: React.FC = () => {
  const [reportType, setReportType] = useState<ReportType>('employee_productivity');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [generatedReport, setGeneratedReport] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // In a real app, you would fetch data from the API based on the report type and date range
    console.log(`Generating ${reportType} report from ${startDate} to ${endDate}`);
    // Mock data for now
    setTimeout(() => {
      let mockData: any[] = [];
      if (reportType === 'employee_productivity') {
        mockData = [
          { employee: 'John Doe', tasksCompleted: 25, hoursWorked: 40 },
          { employee: 'Jane Smith', tasksCompleted: 30, hoursWorked: 42 },
        ];
      } else if (reportType === 'project_billing') {
        mockData = [
          { project: 'Website Redesign', billableHours: 120, amount: 9000 },
          { project: 'Mobile App Development', billableHours: 200, amount: 18000 },
        ];
      } else if (reportType === 'attendance') {
        mockData = [
          { employee: 'John Doe', daysPresent: 20, daysAbsent: 2 },
          { employee: 'Jane Smith', daysPresent: 22, daysAbsent: 0 },
        ];
      }
      setGeneratedReport(mockData);
      setLoading(false);
    }, 1000);
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    if (!generatedReport) return;

    if (format === 'csv') {
      const csv = Papa.unparse(generatedReport);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `${reportType}_report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      const tableColumn = Object.keys(generatedReport[0]);
      const tableRows = generatedReport.map(row => Object.values(row));
      (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
      });
      doc.save(`${reportType}_report.pdf`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className={`text-3xl font-semibold text-${THEME.primary} mb-6`}>Advanced Reporting</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <form onSubmit={handleGenerateReport} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">Report Type</label>
            <select
              id="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="employee_productivity">Employee Productivity</option>
              <option value="project_billing">Project Billing</option>
              <option value="attendance">Attendance</option>
            </select>
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center justify-center px-4 py-2 bg-${THEME.primary} text-${THEME.primaryText} text-sm font-medium rounded-md hover:bg-opacity-85 transition disabled:opacity-50`}
          >
            <ChartBarIcon className="h-5 w-5 mr-2" />
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </form>
      </div>

      {generatedReport && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Report Results</h2>
            <div className="space-x-2">
              <button onClick={() => handleExport('csv')} className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Export CSV
              </button>
              <button onClick={() => handleExport('pdf')} className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Export PDF
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(generatedReport[0]).map(key => (
                    <th key={key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {key.replace('_', ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {generatedReport.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value: any, i) => (
                      <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedReports;
