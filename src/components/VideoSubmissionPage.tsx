import { useState, FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { AlertCircle, Upload, Youtube } from 'lucide-react';

interface VideoSubmissionPageProps {
  onNavigate: (page: string) => void;
}

export default function VideoSubmissionPage({ onNavigate }: VideoSubmissionPageProps) {
  const [formData, setFormData] = useState({
    country: '',
    city: '',
    dojoName: '',
    email: '',
    joinMailingList: false,
    youtubeUrl: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!extractYouTubeId(formData.youtubeUrl.trim())) {
        throw new Error('Please enter a valid YouTube URL (e.g. https://youtube.com/watch?v=...)');
      }

      let dojoId: string | null = null;

      const { data: existingDojos, error: lookupError } = await supabase
        .from('dojos')
        .select('id')
        .eq('name', formData.dojoName.trim())
        .eq('country', formData.country.trim())
        .eq('city', formData.city.trim())
        .limit(1);

      if (lookupError) throw lookupError;

      if (existingDojos && existingDojos.length > 0) {
        dojoId = existingDojos[0].id;
      } else {
        const { data: newDojo, error: dojoError } = await supabase
          .from('dojos')
          .insert({
            name: formData.dojoName.trim(),
            country: formData.country.trim(),
            city: formData.city.trim(),
            email: formData.email.trim(),
            instructor_name: '',
            mailing_list: formData.joinMailingList,
          })
          .select('id')
          .maybeSingle();

        if (dojoError) throw dojoError;
        if (newDojo) dojoId = newDojo.id;
      }

      const { error: submissionError } = await supabase.from('submissions').insert({
        dojo_id: dojoId,
        country: formData.country.trim(),
        email: formData.email.trim(),
        youtube_url: formData.youtubeUrl.trim(),
        level: 1,
        participant_names: formData.dojoName.trim() || null,
        message: formData.message.trim() || null,
        status: 'pending',
      });

      if (submissionError) throw submissionError;

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      await fetch(`${supabaseUrl}/functions/v1/send-submission-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          dojo_name: formData.dojoName.trim(),
          city: formData.city.trim(),
          country: formData.country.trim(),
        }),
      });

      onNavigate('video-thankyou');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-300 rounded-lg p-5 flex items-start space-x-3 shadow-md">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <h3 className="font-semibold text-red-900 text-base mb-1">Submission failed</h3>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 border border-slate-200">
          <div className="text-center mb-8">
            <Youtube className="text-red-600 mx-auto mb-3" size={40} />
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Submit Your Video
            </h2>
            <p className="text-slate-500 text-sm">
              All fields marked with * are required
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                YouTube Video Link *
              </label>
              <input
                type="url"
                name="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={handleChange}
                required
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              <p className="mt-1.5 text-xs text-slate-500">
                Your video can be public or unlisted on YouTube
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Dojo Name *
              </label>
              <input
                type="text"
                name="dojoName"
                value={formData.dojoName}
                onChange={handleChange}
                required
                placeholder="Your dojo's name"
                className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Tokyo"
                  className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  placeholder="Japan"
                  className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="sensei@dojo.com"
                className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              <p className="mt-1.5 text-xs text-slate-500">
                We'll notify you when your video is live
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <details className="cursor-pointer">
                <summary className="text-sm font-semibold text-slate-700 select-none hover:text-blue-600 transition-colors">
                  Optional: Add a message
                </summary>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Message to the Judo World
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Share a message with other dojos..."
                      className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <input
                      type="checkbox"
                      id="joinMailingList"
                      name="joinMailingList"
                      checked={formData.joinMailingList}
                      onChange={handleChange}
                      className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                    />
                    <label htmlFor="joinMailingList" className="text-sm text-slate-700 leading-tight">
                      Get updates on future challenges
                    </label>
                  </div>
                </div>
              </details>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-lg font-semibold text-base hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
            >
              <Upload size={20} />
              <span>{loading ? 'Submitting...' : 'Submit Video'}</span>
            </button>

            <p className="text-center text-xs text-slate-500 leading-relaxed">
              By submitting, you agree to have your video featured in the Hall of Fame
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
