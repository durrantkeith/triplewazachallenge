import { useState, useEffect } from 'react';
import { BookOpen, Award, Video, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface KataCollectionsPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

interface Kata {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface KataSet {
  id: string;
  kata_id: string;
  set_number: number;
  name: string;
  description: string;
  techniques: string[];
}

interface SubmissionCount {
  kata_id: string;
  count: number;
}

export default function KataCollectionsPage({ onNavigate }: KataCollectionsPageProps) {
  const [katas, setKatas] = useState<Kata[]>([]);
  const [kataSets, setKataSets] = useState<KataSet[]>([]);
  const [submissionCounts, setSubmissionCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [katasData, kataSetsData, submissionsData] = await Promise.all([
        supabase.from('katas').select('*').order('order_index'),
        supabase.from('kata_sets').select('*').order('set_number'),
        supabase.from('submissions').select('kata_id').eq('status', 'approved')
      ]);

      if (katasData.data) setKatas(katasData.data);
      if (kataSetsData.data) setKataSets(kataSetsData.data);

      if (submissionsData.data) {
        const counts: Record<string, number> = {};
        submissionsData.data.forEach(sub => {
          if (sub.kata_id) {
            counts[sub.kata_id] = (counts[sub.kata_id] || 0) + 1;
          }
        });
        setSubmissionCounts(counts);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading kata collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-osp-dark via-osp-navy to-osp-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Triple Waza Levels</h1>
          <p className="text-xl md:text-2xl text-slate-200 max-w-4xl mx-auto leading-relaxed">
            Just 3 techniques.
            <br />
            Let's connect the Judo world!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Triple Waza Kata Library</h2>
          <p className="text-lg text-slate-600 mb-8">
            Help us strengthen and sustain traditional Judo education worldwide.
          </p>

          <div className="grid grid-cols-1 gap-8">
            {katas.map(kata => {
              const kataSetsForKata = kataSets.filter(set => set.kata_id === kata.id);
              const submissionCount = submissionCounts[kata.id] || 0;

              return (
                <div key={kata.id} className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-white/20 p-4 rounded-full">
                          <BookOpen size={40} />
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold mb-2">{kata.name}</h3>
                          <p className="text-blue-100">{kataSetsForKata.length} Levels • {submissionCount} Videos</p>
                        </div>
                      </div>
                      <button
                        onClick={() => onNavigate('kata-detail', { kata: kata.slug })}
                        className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-all duration-300 inline-flex items-center space-x-2"
                      >
                        <span>Explore</span>
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="p-8">
                    <p className="text-slate-700 text-lg mb-8 leading-relaxed">{kata.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {kataSetsForKata.map(set => (
                        <div
                          key={set.id}
                          className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer"
                          onClick={() => onNavigate('kata-detail', { kata: kata.slug })}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-bold text-slate-900">Triple Waza Level {set.set_number}</h4>
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                              {set.techniques.length} Tech.
                            </span>
                          </div>
                          <h5 className="text-sm font-semibold text-blue-600 mb-3">{set.name}</h5>
                          <div className="space-y-1">
                            {set.techniques.slice(0, 3).map((technique, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                <span className="text-xs text-slate-700">{technique}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-10 border-2 border-blue-200">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-blue-600 p-4 rounded-full">
              <Video className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Ready to be a part of a global Judo education movement?</h2>
          </div>
          <p className="text-slate-700 mb-6">
            Join dojos from around the world in preserving and sharing kata practice. Your submission becomes
            part of a permanent global archive.
          </p>
          <button
            onClick={() => onNavigate('video-submit')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
          >
            <Video size={24} />
            <span>Submit Video</span>
          </button>
        </div>
      </div>
    </div>
  );
}
