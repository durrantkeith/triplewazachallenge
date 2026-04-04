import { useState, useEffect } from 'react';
import { Play, Star, MapPin, Youtube } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FeaturedSubmission {
  id: string;
  youtube_url: string;
  level: number;
  country: string;
  participant_names: string | null;
  approved_at: string;
  dojo?: {
    name: string;
    city: string;
    country: string;
  } | null;
}

export default function FeaturedContent() {
  const [submissions, setSubmissions] = useState<FeaturedSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedSubmissions();
  }, []);

  const fetchFeaturedSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          id,
          youtube_url,
          level,
          country,
          participant_names,
          approved_at,
          dojo:dojos (
            name,
            city,
            country
          )
        `)
        .eq('status', 'approved')
        .order('approved_at', { ascending: false })
        .limit(18);

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching featured submissions:', error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Star className="text-yellow-500" size={32} />
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Featured Submissions
          </h2>
          <Star className="text-yellow-500" size={32} />
        </div>
        <p className="text-lg text-slate-600">
          Celebrating recent approved submissions from dojos around the world
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {submissions.map((submission) => {
          const videoId = extractYouTubeId(submission.youtube_url);
          const displayName = submission.dojo?.name || submission.participant_names || 'Judo Submission';
          const displayLocation = submission.dojo
            ? `${submission.dojo.city}, ${submission.dojo.country}`
            : submission.country;

          return (
            <div
              key={submission.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-900">
                {videoId && (
                  <>
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                      alt={displayName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 hover:bg-black/50 transition-colors flex items-center justify-center group">
                      <a
                        href={submission.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 group-hover:scale-110"
                      >
                        <Play size={24} fill="white" />
                      </a>
                    </div>
                  </>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Level {submission.level}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(submission.approved_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                  {displayName}
                </h3>

                <div className="flex items-center text-sm text-slate-600 mb-3">
                  <MapPin size={14} className="text-red-600 mr-1 flex-shrink-0" />
                  <span className="line-clamp-1">{displayLocation}</span>
                </div>

                <a
                  href={submission.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Youtube size={18} />
                  <span>Watch Video</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {submissions.length < 18 && (
        <div className="mt-12 text-center">
          <p className="text-slate-600 text-lg mb-4">
            Want to see your dojo featured here?
          </p>
          <a
            href="#submit"
            className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Submit Your Video
          </a>
        </div>
      )}
    </div>
  );
}
