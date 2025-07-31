import React, { useRef } from 'react';

interface LogoUploadProps {
  onUpload: (url: string) => void;
  currentLogo?: string;
}

export default function LogoUpload({ onUpload, currentLogo }: LogoUploadProps) {
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      // Replace with your real API endpoint
      const res = await fetch('/api/v1/camera/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.url) onUpload(data.url);
    }
  };

  return (
    <div className="mb-4">
      {currentLogo && <img src={currentLogo} alt="Logo" className="h-16 mb-2" />}
      <label htmlFor="logo-upload" className="block text-sm font-medium text-gray-700 mb-2">
        Upload Logo
      </label>
      <input
        id="logo-upload"
        type="file"
        accept="image/*"
        ref={fileInput}
        onChange={handleFileChange}
        aria-label="Upload logo file"
        title="Select a logo file to upload"
      />
    </div>
  );
}
