'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AppImage from '@/components/ui/AppImage';

interface ImageUploadProps {
    currentImageUrl?: string;
    onUploadComplete: (url: string) => void;
    userId: string;
}

export default function ImageUpload({ currentImageUrl, onUploadComplete, userId }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImageUrl);
    const [error, setError] = useState<string | null>(null);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            setError(null);

            if (!event.target.files || event.target.files.length === 0) {
                return;
            }

            const file = event.target.files[0];

            // Validate file
            if (!file.type.startsWith('image/')) {
                setError('Please upload an image file');
                return;
            }

            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('Image must be less than 5MB');
                return;
            }

            // Create unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}/${Date.now()}.${fileExt}`;

            // Upload to Supabase Storage
            const { data, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            setPreview(publicUrl);
            onUploadComplete(publicUrl);

        } catch (error: any) {
            console.error('Error uploading image:', error);
            setError(error.message || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            {/* Avatar Preview */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-muted border-4 border-border">
                {preview ? (
                    <AppImage src={preview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-text-secondary">
                        👤
                    </div>
                )}
            </div>

            {/* Upload Button */}
            <label className="btn-hover px-6 py-3 bg-accent text-white rounded-lg cursor-pointer hover:bg-success transition-smooth shadow-md hover:shadow-lg">
                {uploading ? 'Uploading...' : 'Upload Photo'}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    disabled={uploading}
                    className="hidden"
                />
            </label>

            {/* Error Message */}
            {error && (
                <p className="text-sm text-error">{error}</p>
            )}

            {/* Helper Text */}
            <p className="text-xs text-text-secondary text-center">
                Max file size: 5MB<br />
                Supported formats: JPG, PNG, GIF
            </p>
        </div>
    );
}
