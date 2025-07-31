import React, { useState, useEffect } from 'react';
import { apiGetCompanyDetails, apiUpdateCompanyDetails, CompanyDetails } from '../../services/api';

interface CompanyProfileFormProps {
  onBack: () => void;
  onNext: () => void;
}


const CompanyProfileForm: React.FC<CompanyProfileFormProps> = ({ onBack, onNext }) => {
  const [form, setForm] = useState<CompanyDetails>({
    name: '',
    address: '',
    contact: '',
    email: '',
    website: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiGetCompanyDetails()
      .then((data) => {
        if (data) setForm(data);
      })
      .catch(() => setError('Failed to load company details'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await apiUpdateCompanyDetails(form);
      onNext();
    } catch {
      setError('Failed to save company details');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h3>Company Profile</h3>
      {error && <div className="text-red-600">{error}</div>}
      <input name="name" placeholder="Company Name" value={form.name} onChange={handleChange} required />
      <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
      <input name="contact" placeholder="Contact Number" value={form.contact} onChange={handleChange} required />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="website" placeholder="Website" value={form.website || ''} onChange={handleChange} />
      <div>
        <button type="button" onClick={onBack} disabled={saving}>Back</button>
        <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Next'}</button>
      </div>
    </form>
  );
};

export default CompanyProfileForm;
