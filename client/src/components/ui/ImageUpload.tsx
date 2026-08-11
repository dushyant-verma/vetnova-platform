import React, { useState } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import api from '../../lib/axios';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export const ImageUpload = ({ value, onChange, label = "Upload Image" }: ImageUploadProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await api.post('/upload', formData);
      const imageUrl = data?.url || data?.data?.url;
      if (imageUrl) {
        onChange(imageUrl);
      } else {
        setError('Upload succeeded but no image URL was returned');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-50">
          <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {loading ? (
              <Loader2 className="w-8 h-8 text-brand-primary animate-spin mb-2" />
            ) : (
              <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
            )}
            <p className="text-sm text-slate-500 font-medium">
              {loading ? 'Uploading...' : 'Click to upload image'}
            </p>
            <p className="text-xs text-slate-400 mt-1">PNG, JPG or WEBP (MAX. 5MB)</p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={loading} />
        </label>
      )}
      
      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
    </div>
  );
};
