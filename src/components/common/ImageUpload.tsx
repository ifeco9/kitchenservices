'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AppImage from '@/components/ui/AppImage';

interface ImageUploadProps {
    currentImageUrl?: string;
    onUploadComplete: (url: string) => void;
    userId: string;
    /** If true, immediately persists the url to profiles.avatar_url in DB */
    persistToProfile?: boolean;
}

export default function ImageUpload({ currentImageUrl, onUploadComplete, userId, persistToProfile = false }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImageUrl);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            setError(null);
            setSaved(false);

            if (!event.target.files || event.target.files.length === 0) return;

            const file = event.target.files[0];

            if (!file.type.startsWith('image/')) {
                setError('Please upload an image file');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError('Image must be less than 5MB');
                return;
            }

            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}/${Date.now()}.${fileExt}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file, { cacheControl: '3600', upsert: true });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            setPreview(publicUrl);
            onUploadComplete(publicUrl);

            // Immediately persist to profiles table if requested
            if (persistToProfile && userId) {
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
                    .eq('id', userId);

                if (updateError) {
                    console.error('Failed to persist avatar to profile:', updateError);
                } else {
                    setSaved(true);
                }
            }

        } catch (err: any) {
            console.error('Error uploading image:', err);
            setError(err.message || 'Failed to upload image');
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
                {uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
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

            {/* Saved confirmation */}
            {saved && (
                <p className="text-sm text-green-500 font-medium">✓ Profile picture updated!</p>
            )}

            {/* Error Message */}
            {error && (
                <p className="text-sm text-error">{error}</p>
            )}

            <p className="text-xs text-text-secondary text-center">
                Max file size: 5MB<br />
                Supported formats: JPG, PNG, GIF
            </p>
        </div>
    );
}
