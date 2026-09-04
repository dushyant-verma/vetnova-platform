import React, { useState } from 'react';
import { UploadCloud, X, Loader2, FileImage, Check, Search } from 'lucide-react';
import api from '../../lib/axios';
import { Modal } from './Modal';
import { Button } from './button';
import { getMediaUrl, handleImageLoadError } from '@/utils/mediaUtils';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export const ImageUpload = ({ value, onChange, label = "Upload Image" }: ImageUploadProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  const openMediaModal = async () => {
    setSelectedMediaUrl(value || '');
    setIsMediaModalOpen(true);
    setIsLoadingMedia(true);
    try {
      const { data } = await api.get('/media');
      setMediaFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Failed to load media library:', err);
    } finally {
      setIsLoadingMedia(false);
    }
  };

  const handleSelectMediaConfirm = () => {
    if (selectedMediaUrl) {
      onChange(selectedMediaUrl);
    }
    setIsMediaModalOpen(false);
  };

  const filteredMedia = mediaFiles.filter((m: any) =>
    (m.filename || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-semibold text-slate-700">{label}</label>
        <button
          type="button"
          onClick={openMediaModal}
          className="text-xs font-bold text-brand-primary hover:text-brand-secondary flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-primary/10 hover:bg-brand-primary/20 transition-colors"
        >
          <FileImage className="w-3.5 h-3.5" /> Select from Media Library
        </button>
      </div>

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-50 group">
          <img
            src={getMediaUrl(value)}
            alt="Cover Preview"
            onError={(e) => handleImageLoadError(e, value)}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              type="button"
              onClick={openMediaModal}
              className="px-2.5 py-1.5 bg-white/95 backdrop-blur text-slate-700 hover:bg-brand-primary hover:text-white rounded-lg shadow-sm transition-colors text-xs font-bold flex items-center gap-1"
              title="Replace image from Media Library"
            >
              <FileImage className="w-3.5 h-3.5" /> Change Image
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded-lg shadow-sm transition-colors"
              title="Remove Cover Image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-4 pb-4">
              {loading ? (
                <Loader2 className="w-7 h-7 text-brand-primary animate-spin mb-1" />
              ) : (
                <UploadCloud className="w-7 h-7 text-slate-400 mb-1" />
              )}
              <p className="text-xs font-bold text-slate-700">
                {loading ? 'Uploading...' : 'Click to Upload New Image'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG or WEBP (MAX. 5MB)</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={loading} />
          </label>

          <button
            type="button"
            onClick={openMediaModal}
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-brand-primary/30 border-dashed rounded-xl cursor-pointer bg-brand-primary/5 hover:bg-brand-primary/10 transition-colors"
          >
            <FileImage className="w-7 h-7 text-brand-primary mb-1" />
            <p className="text-xs font-bold text-brand-primary">Select from Media Library</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Choose an existing asset</p>
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

      {/* Media Library Selector Modal */}
      <Modal isOpen={isMediaModalOpen} onClose={() => setIsMediaModalOpen(false)} title="Select Cover Image from Media Library">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search images in media library..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-transparent outline-none text-slate-700"
            />
          </div>

          {isLoadingMedia ? (
            <div className="py-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-primary" /></div>
          ) : filteredMedia.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No images found in Media Library.</p>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-h-72 overflow-y-auto p-1">
              {filteredMedia.map((m: any) => {
                const isSelected = selectedMediaUrl === m.url;
                return (
                  <div
                    key={m._id}
                    onClick={() => setSelectedMediaUrl(m.url)}
                    className={`group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                      isSelected ? 'border-brand-primary ring-2 ring-brand-primary/40' : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img
                      src={getMediaUrl(m.url)}
                      alt={m.filename || 'Media'}
                      onError={(e) => handleImageLoadError(e, m.url)}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-slate-900/70 p-1 text-[10px] text-white truncate text-center">
                      {m.filename}
                    </div>
                    {isSelected && (
                      <div className="absolute inset-0 bg-brand-primary/25 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-4 flex justify-between items-center border-t border-slate-100">
            <span className="text-xs text-slate-500 font-mono truncate max-w-[250px]">
              {selectedMediaUrl ? `Selected: ${selectedMediaUrl.split('/').pop()}` : 'No image selected'}
            </span>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setIsMediaModalOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSelectMediaConfirm} disabled={!selectedMediaUrl}>
                Use as Cover Image
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

