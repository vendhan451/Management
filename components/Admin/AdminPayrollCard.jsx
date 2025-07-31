import React, { useEffect, useState } from 'react';
import { getData } from '../../utils/localStorageHelpers';

const AdminPayrollCard = () => {
  const [summary, setSummary] = useState({ totalPayout: 0, billableRevenue: 0, unpaid: 0 });

  useEffect(() => {
    const reports = getData('billingReports');
    let totalPayout = 0, billableRevenue = 0, unpaid = 0;
    for (const r of reports) {
      if (r.status === 'processed' || r.status === 'sent') totalPayout += r.totalEarnings || 0;
      for (const p of r.projects || []) {
        if (p.type === 'hourly' || p.type === 'count-based' || p.type === 'hybrid') billableRevenue += p.subtotal || 0;
        if (r.status === 'pending') unpaid += p.subtotal || 0;
      }
    }
    setSummary({ totalPayout, billableRevenue, unpaid });
  }, []);

  return (
    <div className="bg-[#E8F5E8] rounded shadow p-6 mt-6">
      <div className="bg-[#2D5016] text-white text-lg font-bold px-4 py-2 rounded-t">Payroll Summary</div>
      <div className="p-4">
        <div className="mb-2">Total Payout: <span className="font-bold">${summary.totalPayout}</span></div>
        <div className="mb-2">Billable Revenue: <span className="font-bold">${summary.billableRevenue}</span></div>
        <div className="mb-2">Unpaid Invoices: <span className="font-bold">${summary.unpaid}</span></div>
        <button className="bg-[#2D5016] text-white px-4 py-2 rounded mt-2">Process All</button>
      </div>
    </div>
  );
};

export default AdminPayrollCard;
