import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Save, Volume2, Upload, Trash2, Play } from 'lucide-react';

interface MusicSettings {
  id: number;
  music_file_path: string | null;
}

export default function MusicManager() {
  const [settings, setSettings] = useState<MusicSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [currentMusicUrl, setCurrentMusicUrl] = useState<string | null>(null);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchSettings();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
  };

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('music_settings')
        .select('*')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings(data);

        if (data.music_file_path) {
          const { data: urlData } = await supabase.storage
            .from('background_music')
            .createSignedUrl(data.music_file_path, 3600);

          if (urlData?.signedUrl) {
            setCurrentMusicUrl(urlData.signedUrl);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching music settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'audio/mpeg') {
      setCurrentFile(file);
    } else {
      alert('Please select a valid MP3 file');
    }
  };

  const uploadMusic = async () => {
    if (!currentFile) return;

    if (!isAuthenticated) {
      alert('You must be logged in to upload music. Please log in to the admin dashboard first.');
      return;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert('Authentication session expired. Please log out and log in again.');
        setUploading(false);
        return;
      }

      const timestamp = Date.now();
      const fileName = `uploads/${timestamp}-${currentFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from('background_music')
        .upload(fileName, currentFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      if (settings?.music_file_path) {
        const { error: deleteError } = await supabase.storage
          .from('background_music')
          .remove([settings.music_file_path]);

        if (deleteError) {
          console.warn('Failed to delete old music file:', deleteError);
        }
      }

      if (!settings?.id) {
        throw new Error('Music settings not found. Please refresh the page and try again.');
      }

      const { error: updateError } = await supabase
        .from('music_settings')
        .update({ music_file_path: fileName, updated_by: user.id, updated_at: new Date().toISOString() })
        .eq('id', settings.id);

      if (updateError) {
        console.error('Update error details:', updateError);
        throw new Error(`Database update failed: ${updateError.message}`);
      }

      alert('Music uploaded successfully! Reload the page to hear the new music.');
      setCurrentFile(null);
      fetchSettings();
    } catch (error: any) {
      console.error('Error uploading music:', error);
      alert(`Failed to upload music: ${error.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const deleteMusic = async () => {
    if (!settings?.music_file_path) return;

    if (!confirm('Are you sure you want to delete the current background music?')) return;

    try {
      await supabase.storage
        .from('background_music')
        .remove([settings.music_file_path]);

      const { error } = await supabase
        .from('music_settings')
        .update({ music_file_path: null })
        .eq('id', settings.id);

      if (error) throw error;

      alert('Music deleted successfully!');
      fetchSettings();
    } catch (error) {
      console.error('Error deleting music:', error);
      alert('Failed to delete music');
    }
  };

  const handlePreview = () => {
    if (!currentMusicUrl) return;

    const audio = new Audio(currentMusicUrl);
    audio.volume = 0.3;
    setPreviewPlaying(true);

    audio.play().catch(err => console.log('Preview failed:', err));

    setTimeout(() => {
      audio.pause();
      setPreviewPlaying(false);
    }, 10000);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-slate-600">Loading music settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Background Music</h2>
          <p className="text-slate-600">Upload your own MP3 file for background music</p>
          {!isAuthenticated && (
            <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 text-sm font-medium">
                You must be logged in to upload music. Please ensure you're logged in to the admin dashboard.
              </p>
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          {currentMusicUrl && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-green-700 mb-2">
                    <Volume2 size={20} />
                    <span className="font-semibold">Current Background Music</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    File: {settings?.music_file_path?.split('/').pop()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handlePreview}
                    disabled={previewPlaying}
                    className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
                  >
                    <Play size={16} />
                    <span>{previewPlaying ? 'Playing...' : 'Preview'}</span>
                  </button>
                  <button
                    onClick={deleteMusic}
                    className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8">
            <div className="text-center">
              <Upload className="mx-auto mb-4 text-slate-400" size={48} />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Upload New Background Music
              </h3>
              <p className="text-slate-600 mb-4">
                Select an MP3 file from your computer
              </p>

              <input
                type="file"
                accept="audio/mpeg"
                onChange={handleFileSelect}
                className="hidden"
                id="music-upload"
              />

              <label
                htmlFor="music-upload"
                className="inline-block bg-slate-900 hover:bg-slate-700 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors"
              >
                Choose MP3 File
              </label>

              {currentFile && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-900 font-medium mb-2">Selected file:</p>
                  <p className="text-blue-700 text-sm mb-3">{currentFile.name}</p>
                  <p className="text-blue-600 text-xs mb-3">
                    Size: {(currentFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    onClick={uploadMusic}
                    disabled={uploading}
                    className="flex items-center space-x-2 mx-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>Upload & Activate</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-2">Instructions</h4>
            <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
              <li>Only MP3 files are supported</li>
              <li>The music will loop continuously</li>
              <li>Users can control playback with the music button</li>
              <li>Reload the page after uploading to hear the new music</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
