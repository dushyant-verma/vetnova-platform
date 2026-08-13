import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Image, Upload, Trash2, Loader2, Copy, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { getMediaUrl, handleImageLoadError } from '@/utils/mediaUtils';

export const MediaLibrary = () => {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: mediaFiles = [], isLoading } = useQuery({
    queryKey: ['admin-media'],
    queryFn: async () => {
      const { data } = await api.get('/media');
      return data;
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await api.post('/upload', formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
      setUploading(false);
    },
    onError: (err: any) => {
      setUploading(false);
      alert(err?.response?.data?.message || 'Upload failed');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/upload/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      uploadMutation.mutate(e.target.files[0]);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('Copied to clipboard');
  };

  const filteredMedia = mediaFiles.filter((m: any) => 
    m.filename?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Media Library</h2>
          <p className="text-slate-500">Manage all uploaded images and assets.</p>
        </div>
        <div>
          <input
            type="file"
            id="media-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <label htmlFor="media-upload">
            <Button asChild disabled={uploading}>
              <span>
                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                Upload New Image
              </span>
            </Button>
          </label>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Search className="text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search files..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow focus:outline-none text-slate-700"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredMedia.map((media: any) => (
              <div key={media._id} className="group relative border border-slate-200 rounded-lg overflow-hidden aspect-square bg-slate-50">
                <img 
                  src={getMediaUrl(media.url)} 
                  alt={media.filename || 'Media'} 
                  onError={(e) => handleImageLoadError(e, media.url)}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <p className="text-white text-xs truncate w-11/12 text-center px-1">{media.filename}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => copyToClipboard(media.url)}
                      className="p-2 bg-white/20 hover:bg-brand-primary rounded-full text-white transition-colors"
                      title="Copy URL"
                    >
                      <Copy size={14} />
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm('Delete this image?')) {
                          deleteMutation.mutate(media._id);
                        }
                      }}
                      className="p-2 bg-white/20 hover:bg-red-500 rounded-full text-white transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredMedia.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500 flex flex-col items-center">
                <Image className="w-12 h-12 mb-2 opacity-50" />
                <p>No media files found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
