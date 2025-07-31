import React from 'react';

const BillingReportTable = ({ report }) => {
  if (!report) return null;
  return (
    <div className="bg-white rounded shadow p-4 mt-6">
      <h2 className="text-lg font-bold mb-4">Billing Report</h2>
      <div className="mb-2 font-semibold">Employee: {report.employeeName}</div>
      <div className="mb-2">Pay Period: {report.payPeriod}</div>
      <div className="mb-2">Work Days: {report.workDays}</div>
      <div className="mb-2">Leave Days: {Object.entries(report.leaveDays || {}).map(([type, days]) => `${type}: ${days}`).join(', ')}</div>
      <table className="w-full border mt-4 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Project</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Units</th>
            <th className="border p-2">Rate</th>
            <th className="border p-2">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {report.projects.map((p, i) => (
            <tr key={i}>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">{p.type}</td>
              <td className="border p-2">{p.units}</td>
              <td className="border p-2">{p.rate}</td>
              <td className="border p-2">${p.subtotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="font-bold text-right">Total Earnings: ${report.totalEarnings}</div>
      <div className="text-sm text-gray-600 mt-2">Status: {report.status}</div>
    </div>
  );
};

export default BillingReportTable;
