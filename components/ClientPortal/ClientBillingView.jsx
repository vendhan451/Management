import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { apiFetchClientBilling } from '../../services/api';

export default function ClientBillingView() {
  const { user } = useAuth();
  const [billing, setBilling] = useState([]);
  useEffect(() => {
    if (user && user.clientId) {
      apiFetchClientBilling(user.clientId).then(setBilling);
    }
  }, [user]);
  if (!user || !user.clientId) return <div>Not authorized.</div>;
  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Billing Records</h2>
      {billing.length === 0 ? <div>No billing records found.</div> : (
        <table className="w-full border">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {billing.map(b => (
              <tr key={b.id}>
                <td>{b.date}</td>
                <td>{b.calculatedAmount}</td>
                <td>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
