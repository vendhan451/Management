import React, { useState, ChangeEvent } from 'react';
import { apiUpdateCompanyDetails, apiGetCompanyDetails } from '../../services/api';

interface LogoUploadProps {
  onNext: () => void;
}

const LogoUpload: React.FC<LogoUploadProps> = ({ onNext }) => {
  const [logo, setLogo] = useState<string | ArrayBuffer | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogo(ev.target?.result || null);
      reader.readAsDataURL(e.target.files[0]);
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      // Upload logo to backend
      const formData = new FormData();
      formData.append('logo', file);
      const token = localStorage.getItem('authToken');
      const res = await fetch('/api/v1/company/logo', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to upload logo');
      const { logoUrl } = await res.json();
      // Update company details with new logo URL
      const company = await apiGetCompanyDetails();
      await apiUpdateCompanyDetails({ ...company, logoUrl });
      onNext();
    } catch (err) {
      setError('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h3>Upload Company Logo</h3>
      {error && <div className="text-red-600">{error}</div>}
      <label htmlFor="company-logo-upload" className="block text-sm font-medium text-gray-700 mb-2">
        Select Company Logo
      </label>
      <input
        id="company-logo-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        aria-label="Upload company logo file"
        title="Select a company logo file to upload"
      />
      {logo && <img src={logo as string} alt="Logo Preview" className="max-w-[200px] max-h-[200px] mt-2" />}
      <button onClick={handleUpload} disabled={!file || uploading}>{uploading ? 'Uploading...' : 'Next'}</button>
    </div>
  );
};

export default LogoUpload;
