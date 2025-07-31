import React, { useState } from 'react';
import { THEME } from '../../constants';
import { apiUpdateCompanyDetails, CompanyDetails } from '../../services/api';
import ImageUpload from '../Common/ImageUpload';

const CompanyRegistrationForm: React.FC = () => {
  const [companyDetails, setCompanyDetails] = useState<Partial<CompanyDetails>>({
    name: '',
    address: '',
    contact: '',
    email: '',
    website: '',
  });
  const [logo, setLogo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoSelect = (base64: string | null) => {
    setLogo(base64);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // In a real app, you would upload the logo and get a URL
      const logoUrl = logo; // Using base64 string for mock
      const updatedDetails = await apiUpdateCompanyDetails({ ...companyDetails, logoUrl: logoUrl ?? undefined });
      setSuccess('Company details saved successfully!');
      setCompanyDetails(updatedDetails);
    } catch (err: any) {
      setError(err.message || 'Failed to save company details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10">
      <h2 className={`text-2xl font-semibold text-${THEME.primary} mb-6`}>Company Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className={`block text-sm font-medium text-${THEME.accentText}`}>Company Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={companyDetails.name}
            onChange={handleChange}
            className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-${THEME.secondary} focus:border-${THEME.secondary}`}
            required
          />
        </div>
        <div>
          <label htmlFor="address" className={`block text-sm font-medium text-${THEME.accentText}`}>Address</label>
          <textarea
            id="address"
            name="address"
            rows={3}
            value={companyDetails.address}
            onChange={handleChange}
            className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-${THEME.secondary} focus:border-${THEME.secondary}`}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="contact" className={`block text-sm font-medium text-${THEME.accentText}`}>Contact Number</label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={companyDetails.contact}
              onChange={handleChange}
              className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-${THEME.secondary} focus:border-${THEME.secondary}`}
            />
          </div>
          <div>
            <label htmlFor="email" className={`block text-sm font-medium text-${THEME.accentText}`}>Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={companyDetails.email}
              onChange={handleChange}
              className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-${THEME.secondary} focus:border-${THEME.secondary}`}
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="website" className={`block text-sm font-medium text-${THEME.accentText}`}>Website</label>
          <input
            type="url"
            id="website"
            name="website"
            value={companyDetails.website}
            onChange={handleChange}
            className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-${THEME.secondary} focus:border-${THEME.secondary}`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium text-${THEME.accentText}`}>Company Logo</label>
          <ImageUpload onImageSelected={handleLogoSelect} currentImageUrl={logo} />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-${THEME.primaryText} bg-${THEME.primary} hover:bg-opacity-85 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${THEME.primary} disabled:opacity-50`}
          >
            {loading ? 'Saving...' : 'Save Company Details'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyRegistrationForm;
