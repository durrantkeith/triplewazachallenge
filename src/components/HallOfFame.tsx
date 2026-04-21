import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ChevronDown, ChevronRight, MapPin, Award, BookOpen, Search, Video, TrendingUp } from 'lucide-react';

interface Submission {
  id: string;
  country: string;
  email: string;
  youtube_url: string;
  level: number;
  participant_names: string | null;
  message: string | null;
  submitted_at: string;
  dojos: {
    name: string;
    country: string;
  } | null;
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

interface LatestSubmission {
  id: string;
  youtube_url: string;
  level: number;
  submitted_at: string;
  country: string;
  dojos: {
    name: string;
    city: string;
  } | null;
}

interface HallOfFameProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function HallOfFame({ onNavigate }: HallOfFameProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set());
  const [katas, setKatas] = useState<Kata[]>([]);
  const [kataSets, setKataSets] = useState<KataSet[]>([]);
  const [latestSubmissions, setLatestSubmissions] = useState<LatestSubmission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKata, setSelectedKata] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const [submissionsData, katasData, kataSetsData, latestSubmissionsData, countriesData] = await Promise.all([
        supabase
          .from('submissions')
          .select('id, country, email, youtube_url, level, participant_names, message, submitted_at, dojos(name, country)')
          .eq('status', 'approved')
          .order('submitted_at', { ascending: false }),
        supabase.from('katas').select('*').order('order_index'),
        supabase.from('kata_sets').select('*').order('set_number'),
        supabase.from('submissions').select('id, youtube_url, level, submitted_at, country, dojos(name, city)').eq('status', 'approved').order('submitted_at', { ascending: false }).limit(12),
        supabase.from('submissions').select('country').eq('status', 'approved')
      ]);

      if (submissionsData.error) throw submissionsData.error;
      setSubmissions((submissionsData.data || []) as unknown as Submission[]);

      if (katasData.data) setKatas(katasData.data);
      if (kataSetsData.data) setKataSets(kataSetsData.data);
      if (latestSubmissionsData.data) setLatestSubmissions((latestSubmissionsData.data) as unknown as LatestSubmission[]);

      if (countriesData.data) {
        const uniqueCountries = [...new Set(countriesData.data.map(s => s.country))].sort();
        setCountries(uniqueCountries);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupByCountry = () => {
    const grouped: Record<string, Submission[]> = {};
    submissions.forEach((submission) => {
      if (!grouped[submission.country]) {
        grouped[submission.country] = [];
      }
      grouped[submission.country].push(submission);
    });
    return grouped;
  };

  const toggleCountry = (country: string) => {
    const newSet = new Set(expandedCountries);
    if (newSet.has(country)) {
      newSet.delete(country);
    } else {
      newSet.add(country);
    }
    setExpandedCountries(newSet);
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

  const getTotalStats = () => {
    const countries = new Set(submissions.map((s) => s.country)).size;
    return { countries, submissions: submissions.length };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading Hall of Fame...</p>
        </div>
      </div>
    );
  }

  const countriesGrouped = groupByCountry();
  const stats = getTotalStats();

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-osp-dark via-osp-navy to-osp-dark text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-osp-blue/10 to-osp-light-blue/10"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent animate-fade-in-up">
            Triple Waza Hall Of Fame
          </h1>
          <h2 className="text-3xl md:text-4xl mb-8 text-blue-200 animate-fade-in-up">A living record of cooperation<br />and the shared work of Judo dojos worldwide.</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 card-hover">
              <div className="text-5xl md:text-6xl font-bold text-emerald-400 mb-3">{stats.countries}</div>
              <div className="text-slate-200 text-lg">Countries</div>
            </div>
            <button
              onClick={() => {
                const videoLibrary = document.getElementById('video-library');
                if (videoLibrary) {
                  videoLibrary.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 card-hover cursor-pointer group"
              aria-label="View video library section"
            >
              <div className="text-5xl md:text-6xl font-bold text-amber-400 mb-3 group-hover:scale-110 transition-transform duration-300">{stats.submissions}</div>
              <div className="text-slate-200 text-lg group-hover:text-white transition-colors duration-300">Videos Submitted</div>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative bg-gradient-to-br from-osp-dark via-osp-navy to-osp-dark rounded-2xl p-8 md:p-12 border-2 border-blue-400/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-osp-blue/30 to-osp-navy/30"></div>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-red-600 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-blue-600 to-transparent"></div>
            </div>
            <div className="relative z-10">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center space-x-3 mb-4">
                  <BookOpen className="text-yellow-400" size={40} />
                  <h3 className="text-3xl md:text-4xl font-bold text-white">
                    Triple Waza Archive
                  </h3>
                </div>
              </div>
              <div className="max-w-3xl mx-auto">
                <p className="text-lg text-white leading-relaxed mb-6">
                  This library serves as a living global archive of judoka preserving their part of Judo history through traditional techniques. By sharing our practice, dojos around the world connect through a common learning experience. Each submission becomes part of a living record—honouring the effort of participating dojos and preserving this knowledge for future generations.
                </p>
                <button
                  onClick={() => onNavigate('video-submit')}
                  className="text-xl font-bold text-yellow-300 text-center hover:text-yellow-200 transition-colors duration-300 cursor-pointer"
                >
                  Join us in creating a living record of global Judo cooperation.
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 mb-16">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
          <div className="flex items-center space-x-3 mb-6">
            <Search className="text-blue-600" size={28} />
            <h2 className="text-2xl font-bold text-slate-900">Search & Filter Kata Collection</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by dojo, technique..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Kata</label>
              <select
                value={selectedKata}
                onChange={(e) => setSelectedKata(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="all">All Kata</option>
                {katas.map(kata => (
                  <option key={kata.id} value={kata.id}>{kata.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="all">All Levels</option>
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
                <option value="4">Level 4</option>
                <option value="5">Level 5</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="all">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              {submissions.length} total kata videos in the collection
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Latest Submissions</h2>
          <a
            href="https://www.youtube.com/feed/playlists"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center space-x-1"
          >
            <span>View All</span>
            <TrendingUp size={20} />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {latestSubmissions.map(submission => {
            const videoId = extractYouTubeId(submission.youtube_url);
            return (
              <a
                key={submission.id}
                href="https://www.youtube.com/feed/playlists"
                target="_blank"
                rel="noopener noreferrer"
                className="group cursor-pointer block"
              >
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
              </a>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Browse by Kata</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {katas.map(kata => {
            const kataSetsForKata = kataSets.filter(set => set.kata_id === kata.id);
            return (
              <div
                key={kata.id}
                onClick={() => onNavigate('kata-detail', { kata: kata.slug })}
                className="bg-white rounded-xl shadow-lg p-6 border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors">
                    <BookOpen className="text-blue-600" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{kata.name}</h3>
                </div>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">{kata.description}</p>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>{kataSetsForKata.length} Levels</span>
                  <span className="text-blue-600 group-hover:text-blue-700 font-semibold">Explore →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div id="video-library" className="max-w-7xl mx-auto px-4 py-12">
        <div className="relative bg-gradient-to-br from-osp-dark via-osp-navy to-osp-dark rounded-2xl p-8 md:p-12 border-2 border-amber-400/50 overflow-hidden mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-osp-blue/30 to-osp-navy/30"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-amber-600 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-blue-600 to-transparent"></div>
          </div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center space-x-3 mb-6">
                <div className="bg-amber-400 p-3 rounded-full shadow-xl">
                  <Award className="text-blue-900" size={44} />
                </div>
              </div>

              <div className="max-w-4xl mx-auto space-y-4">
                <p className="text-base md:text-lg text-blue-200" style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}>
                  Be a part of Judo history and the inaugural
                </p>

                <h3 className="text-3xl md:text-5xl font-bold text-white leading-tight" style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic', textShadow: '0 0 20px rgba(255, 215, 0, 0.5), 0 0 30px rgba(255, 215, 0, 0.3)' }}>
                  Triple Waza Friendship Challenge Level 1
                </h3>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 max-w-2xl mx-auto">
                  <p className="text-lg md:text-xl text-emerald-300 font-semibold mb-3">
                    Perfection is not required. Participation is all we ask!
                  </p>
                  <button
                    onClick={() => onNavigate('video-submit')}
                    className="text-base md:text-lg text-slate-400 hover:text-slate-300 transition-colors duration-300 cursor-pointer underline decoration-slate-400 hover:decoration-slate-300"
                  >
                    Send us your video and be a part of Judo history!
                  </button>
                </div>

                <div className="bg-amber-400/10 backdrop-blur-md rounded-xl p-4 border border-amber-400/30 inline-block">
                  <p className="text-xl md:text-2xl font-bold text-amber-300" style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}>
                    Uki Otoshi • Seoi Nage • Kata Guruma
                  </p>
                </div>
              </div>
            </div>

            <div className="max-w-3xl mx-auto mt-8">
              <p className="text-base md:text-lg text-white leading-relaxed text-center">
                Each submission becomes part of a living archive of traditional Judo practice. We will preserve your dojo's work for the world judo community and for future generations!
              </p>
            </div>
          </div>
        </div>

        {Object.keys(countriesGrouped).length === 0 ? (
          <div className="text-center py-20">
            <Award size={64} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-2xl font-semibold text-slate-700 mb-2">
              No submissions yet
            </h3>
            <p className="text-slate-600">
              Be the first to join the Hall of Fame!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(countriesGrouped)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([country, countrySubmissions]) => {
                const isCountryExpanded = expandedCountries.has(country);

                return (
                  <div key={country} className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 hover:shadow-2xl transition-all duration-300">
                    <button
                      onClick={() => toggleCountry(country)}
                      className="w-full px-6 py-5 flex items-center justify-between hover:bg-gradient-to-r hover:from-slate-50 hover:to-white transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        {isCountryExpanded ? (
                          <ChevronDown className="text-blue-600 transition-transform duration-300" size={28} />
                        ) : (
                          <ChevronRight className="text-slate-600 transition-transform duration-300" size={28} />
                        )}
                        <MapPin className="text-blue-600" size={28} />
                        <span className="text-xl md:text-2xl font-bold text-slate-900">{country}</span>
                        <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                          {countrySubmissions.length} {countrySubmissions.length === 1 ? 'Video' : 'Videos'}
                        </span>
                      </div>
                    </button>

                    {isCountryExpanded && (
                      <div className="px-6 pb-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {countrySubmissions.map((submission) => {
                            const videoId = extractYouTubeId(submission.youtube_url);

                            return (
                              <div key={submission.id} className="group">
                                <a
                                  href="https://www.youtube.com/feed/playlists"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="relative aspect-video rounded-xl overflow-hidden w-full shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105 block"
                                >
                                  {videoId ? (
                                    <>
                                      <img
                                        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                                        alt={`${submission.dojos?.name || submission.country} - Level ${submission.level}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                                        }}
                                      />
                                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
                                        <div className="bg-red-600 text-white rounded-full p-4 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                                          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M8 5v14l11-7z"/>
                                          </svg>
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                                      <Award className="text-slate-400" size={32} />
                                    </div>
                                  )}
                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                                    <div className="flex items-center justify-between">
                                      <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                                        Level {submission.level}
                                      </span>
                                    </div>
                                  </div>
                                </a>
                                <div className="mt-2 px-1">
                                  <p className="text-sm font-semibold text-slate-900 truncate">
                                    {submission.dojos?.name || 'Independent'}
                                  </p>
                                  <p className="text-xs text-slate-600 truncate">
                                    {submission.participant_names || 'Participants'}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>

    </div>
  );
}
