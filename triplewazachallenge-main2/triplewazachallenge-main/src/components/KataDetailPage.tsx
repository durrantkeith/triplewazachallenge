import { useState, useEffect } from 'react';
import { BookOpen, Award, ArrowLeft, Video } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface KataDetailPageProps {
  kataSlug: string;
  onNavigate: (page: string) => void;
}

interface Kata {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface KataSet {
  id: string;
  set_number: number;
  name: string;
  description: string;
  techniques: string[];
}

interface Submission {
  id: string;
  youtube_url: string;
  level: number;
  country: string;
  submitted_at: string;
  dojos: {
    name: string;
    city: string;
  } | null;
}

export default function KataDetailPage({ kataSlug, onNavigate }: KataDetailPageProps) {
  const [kata, setKata] = useState<Kata | null>(null);
  const [kataSets, setKataSets] = useState<KataSet[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSet, setSelectedSet] = useState<string | null>(null);

  useEffect(() => {
    fetchKataData();
  }, [kataSlug]);

  const fetchKataData = async () => {
    setLoading(true);
    try {
      const { data: kataData } = await supabase
        .from('katas')
        .select('*')
        .eq('slug', kataSlug)
        .single();

      if (kataData) {
        setKata(kataData);

        const { data: setsData } = await supabase
          .from('kata_sets')
          .select('*')
          .eq('kata_id', kataData.id)
          .order('set_number');

        if (setsData) setKataSets(setsData);

        const { data: submissionsData } = await supabase
          .from('submissions')
          .select('id, youtube_url, level, country, submitted_at, dojos(name, city)')
          .eq('kata_id', kataData.id)
          .eq('status', 'approved')
          .order('submitted_at', { ascending: false })
          .limit(24);

        if (submissionsData) setSubmissions(submissionsData);
      }
    } catch (error) {
      console.error('Error fetching kata data:', error);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading kata details...</p>
        </div>
      </div>
    );
  }

  if (!kata) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Kata Not Found</h2>
          <button
            onClick={() => onNavigate('home')}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Return to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-osp-dark via-osp-navy to-osp-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center space-x-2 text-blue-200 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Library</span>
          </button>

          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-blue-600 p-4 rounded-full">
              <BookOpen size={48} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">{kata.name}</h1>
              <p className="text-blue-200 text-lg mt-2">{kataSets.length} Levels • {submissions.length} Videos</p>
            </div>
          </div>

          <p className="text-xl text-slate-200 max-w-4xl leading-relaxed">{kata.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Triple Waza Levels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kataSets.map((set) => (
              <div
                key={set.id}
                onClick={() => setSelectedSet(selectedSet === set.id ? null : set.id)}
                className="bg-white rounded-xl shadow-lg p-6 border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Triple Waza Level {set.set_number}</h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                    {set.techniques.length} Techniques
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-blue-600 mb-3">{set.name}</h4>
                <p className="text-slate-600 text-sm mb-4">{set.description}</p>

                <div className="border-t border-slate-200 pt-4">
                  <p className="text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">Techniques:</p>
                  <div className="space-y-1">
                    {set.techniques.map((technique, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-slate-700">{technique}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-8 border-2 border-blue-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Understanding the Level System</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map(level => (
                <div key={level} className="bg-white rounded-lg p-4 shadow-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="text-blue-600" size={20} />
                    <span className="font-bold text-slate-900">Level {level}</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {level === 1 && 'Introduction'}
                    {level === 2 && 'Developing'}
                    {level === 3 && 'Intermediate'}
                    {level === 4 && 'Advanced'}
                    {level === 5 && 'Mastery'}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-slate-600 mt-4 text-sm">
              Progress through the levels at your own pace. Each level represents improved understanding and execution of the techniques.
            </p>
          </div>
        </div>

        {submissions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-slate-900">Recent Submissions</h2>
              <button
                onClick={() => onNavigate('hall-of-fame')}
                className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center space-x-1"
              >
                <span>View All</span>
                <Video size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {submissions.map(submission => {
                const videoId = extractYouTubeId(submission.youtube_url);
                return (
                  <div key={submission.id} className="group cursor-pointer" onClick={() => onNavigate('hall-of-fame')}>
                    <div className="relative aspect-video rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
                      {videoId ? (
                        <>
                          <img
                            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                            alt={`${submission.dojos?.name || submission.country} - Level ${submission.level}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                            <div className="bg-red-600 text-white rounded-full p-2 group-hover:scale-110 transition-transform duration-300">
                              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                          <Video className="text-slate-400" size={24} />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                        <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                          L{submission.level}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {submission.dojos?.name || submission.country}
                      </p>
                      <p className="text-xs text-slate-600 truncate">
                        {submission.dojos?.city || submission.country}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
