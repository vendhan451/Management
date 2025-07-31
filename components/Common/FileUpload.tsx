import React, { useState, ChangeEvent, useRef } from 'react';
import { DocumentIcon, XCircleIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { THEME } from '../../constants';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  currentFileUrl?: string | null;
  label?: string;
  acceptedTypes?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  currentFileUrl,
  label = "Upload File",
  acceptedTypes = "image/*,application/pdf"
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentFileUrl || null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFilePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const preview = getFilePreview(file);
      setPreviewUrl(preview);
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const handleRemoveFile = () => {
    setPreviewUrl(null);
    setFileName(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const renderPreview = () => {
    if (previewUrl) {
      return <img src={previewUrl} alt="Preview" className="mx-auto h-24 w-auto object-contain shadow-md" />;
    }
    if (fileName) {
        return (
            <div className="text-center">
                <DocumentIcon className={`mx-auto h-12 w-12 text-gray-400`} />
                <p className="text-xs text-gray-600 mt-2 truncate">{fileName}</p>
            </div>
        );
    }
    return <ArrowUpTrayIcon className={`mx-auto h-12 w-12 text-gray-400`} />;
  }

  return (
    <div className="space-y-2">
      <label className={`block text-sm font-medium text-${THEME.accentText}`}>{label}</label>
      <div className={`mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md`}>
        <div className="space-y-1 text-center">
          {fileName || previewUrl ? (
            <div className="relative group">
              {renderPreview()}
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove file"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <ArrowUpTrayIcon className={`mx-auto h-12 w-12 text-gray-400`} />
          )}

          <div className="flex text-sm text-gray-600 justify-center">
            <div
              onClick={triggerFileInput}
              className={`relative cursor-pointer bg-white rounded-md font-medium text-${THEME.secondary} hover:text-opacity-80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-${THEME.secondary}`}
            >
              <span>{fileName ? 'Change file' : 'Select a file'}</span>
              <input
                ref={fileInputRef}
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                accept={acceptedTypes}
                aria-label="Upload file"
              />
            </div>
          </div>
          {!fileName && <p className="text-xs text-gray-500">Supports various file types</p>}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
