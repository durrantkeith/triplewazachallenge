import { useState, useEffect, FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { AlertCircle, CheckCircle, Upload, Youtube } from 'lucide-react';

interface Kata {
  id: string;
  name: string;
}

interface KataSet {
  id: string;
  kata_id: string;
  set_number: number;
  name: string;
  techniques: string[];
}

export default function VideoSubmissionPage() {
  const [formData, setFormData] = useState({
    country: '',
    city: '',
    dojoName: '',
    email: '',
    joinMailingList: false,
    youtubeUrl: '',
    level: '1',
    kataId: '',
    kataSetId: '',
    dojoNameOptional: '',
    message: '',
  });

  const [katas, setKatas] = useState<Kata[]>([]);
  const [kataSets, setKataSets] = useState<KataSet[]>([]);
  const [filteredKataSets, setFilteredKataSets] = useState<KataSet[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchKatas();
  }, []);

  useEffect(() => {
    if (formData.kataId) {
      const filtered = kataSets.filter(set => set.kata_id === formData.kataId);
      setFilteredKataSets(filtered);
      if (filtered.length > 0 && !formData.kataSetId) {
        setFormData(prev => ({ ...prev, kataSetId: filtered[0].id }));
      }
    }
  }, [formData.kataId, kataSets]);

  const fetchKatas = async () => {
    const [katasData, kataSetsData] = await Promise.all([
      supabase.from('katas').select('id, name').order('order_index'),
      supabase.from('kata_sets').select('*').order('set_number')
    ]);

    if (katasData.data) {
      setKatas(katasData.data);
      if (katasData.data.length > 0) {
        setFormData(prev => ({ ...prev, kataId: katasData.data[0].id }));
      }
    }
    if (kataSetsData.data) setKataSets(kataSetsData.data);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
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
    setSuccess(false);

    try {
      if (!extractYouTubeId(formData.youtubeUrl)) {
        throw new Error('Please enter a valid YouTube URL');
      }

      let dojoId: string;

      const { data: existingDojo } = await supabase
        .from('dojos')
        .select('id')
        .eq('name', formData.dojoName.trim())
        .eq('country', formData.country.trim())
        .eq('city', formData.city.trim())
        .maybeSingle();

      if (existingDojo) {
        dojoId = existingDojo.id;
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
          .single();

        if (dojoError) throw dojoError;
        dojoId = newDojo.id;
      }

      const { error: submissionError } = await supabase.from('submissions').insert({
        dojo_id: dojoId,
        country: formData.country.trim(),
        email: formData.email.trim(),
        youtube_url: formData.youtubeUrl.trim(),
        level: parseInt(formData.level),
        kata_id: formData.kataId || null,
        kata_set_id: formData.kataSetId || null,
        participant_names: formData.dojoNameOptional.trim() || null,
        message: formData.message.trim() || null,
        status: 'pending',
      });

      if (submissionError) throw submissionError;

      setSuccess(true);
      const firstKataId = katas.length > 0 ? katas[0].id : '';
      setFormData({
        country: '',
        city: '',
        dojoName: '',
        email: '',
        joinMailingList: false,
        youtubeUrl: '',
        level: '1',
        kataId: firstKataId,
        kataSetId: '',
        dojoNameOptional: '',
        message: '',
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24">
      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {success && (
          <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-lg p-5 flex items-start space-x-3 shadow-md animate-scale-in">
            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <h3 className="font-semibold text-green-900 text-base mb-1">Success! You're In!</h3>
              <p className="text-green-800 text-sm">
                Your video has been submitted. We'll review it and add it to the Hall of Fame soon!
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-300 rounded-lg p-5 flex items-start space-x-3 shadow-md animate-scale-in">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <h3 className="font-semibold text-red-900 text-base mb-1">Oops!</h3>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 border border-slate-200">
          <div className="text-center mb-6">
            <Youtube className="text-red-600 mx-auto mb-3" size={36} />
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">
              Triple Waza Friendship Challenge
            </h2>
            <p className="text-sm text-slate-600 mb-1">
              All fields marked with * are required.
            </p>
            <p className="text-sm text-slate-600 font-medium">
              Everyone's welcome, no experience needed
            </p>
          </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              1. YouTube Video Link *
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
              Paste your YouTube link (public or unlisted)
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              2. Dojo Name *
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
                3. City *
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
              4. Email *
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
                Optional: Add more details
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
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-base hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
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
