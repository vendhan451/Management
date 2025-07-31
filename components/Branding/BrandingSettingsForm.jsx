import React, { useState, useEffect } from 'react';
import { apiGetBranding, apiUpdateBranding } from '../../services/api';
import LogoUpload from './LogoUpload';
import { useAuth } from '../../hooks/useAuth';

export default function BrandingSettingsForm() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    logoUrl: '',
    primaryColor: '#2D5016',
    secondaryColor: '#4A7C59',
    mission: '',
    contactEmail: ''
  });
  const [companyId, setCompanyId] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(form);
  useEffect(() => {
    apiGetBranding().then(saved => {
      if (saved) setForm(f => ({ ...f, ...saved }));
    });
    // Fetch companyId from user context if available
    if (user && user.companyId) setCompanyId(user.companyId);
  }, [user]);
  useEffect(() => { setPreview(form); }, [form]);
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleLogoUpload = url => setForm(f => ({ ...f, logoUrl: url }));
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.logoUrl || !form.primaryColor || !form.secondaryColor || !form.contactEmail) {
      setError('All fields except mission are required.');
      return;
    }
    if (!companyId) {
      setError('Company ID missing.');
      return;
    }
    try {
      await apiUpdateBranding({ companyId, settings: form });
      alert('Branding settings saved!');
    } catch (err) {
      setError('Failed to save branding settings.');
    }
  };
  if (!user || user.role !== 'ADMIN') return <div className="text-red-500">Only admins can update branding.</div>;
  return (
    <form className="max-w-md mx-auto p-4 bg-white rounded shadow" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Branding Settings</h2>
      {error && <div className="mb-2 text-red-500">{error}</div>}
      <LogoUpload onUpload={handleLogoUpload} currentLogo={form.logoUrl} />
      <label className="block mb-2">Primary Color
        <input name="primaryColor" value={form.primaryColor} onChange={handleChange} className="w-full border rounded p-2" type="color" />
      </label>
      <label className="block mb-2">Secondary Color
        <input name="secondaryColor" value={form.secondaryColor} onChange={handleChange} className="w-full border rounded p-2" type="color" />
      </label>
      <label className="block mb-2">Mission Statement
        <textarea name="mission" value={form.mission} onChange={handleChange} className="w-full border rounded p-2" />
      </label>
      <label className="block mb-2">Contact Email
        <input name="contactEmail" value={form.contactEmail} onChange={handleChange} className="w-full border rounded p-2" type="email" />
      </label>
      <div className="mb-4">
        <h3 className="font-semibold mb-1">Live Preview</h3>
        <div style={{ background: preview.primaryColor, color: preview.secondaryColor, padding: 10, borderRadius: 4 }}>
          {preview.logoUrl && <img src={preview.logoUrl} alt="Logo Preview" className="h-10 mb-2" />}
          <div>{preview.mission}</div>
          <div>{preview.contactEmail}</div>
        </div>
      </div>
      <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded">Save</button>
    </form>
  );
}
