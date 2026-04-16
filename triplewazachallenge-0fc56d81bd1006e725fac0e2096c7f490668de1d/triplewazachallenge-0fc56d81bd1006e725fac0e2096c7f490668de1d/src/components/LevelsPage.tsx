import { useState, useEffect } from 'react';
import { Award, TrendingUp, Target, Star, Trophy } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LevelsPageProps {
  onNavigate: (page: string) => void;
}

interface Level {
  id: string;
  level_number: number;
  name: string;
  description: string;
  requirements: string;
}

export default function LevelsPage({ onNavigate }: LevelsPageProps) {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      const { data } = await supabase
        .from('levels')
        .select('*')
        .order('level_number');

      if (data) setLevels(data);
    } catch (error) {
      console.error('Error fetching levels:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelIcon = (levelNumber: number) => {
    switch (levelNumber) {
      case 1: return <Target className="text-slate-600" size={48} />;
      case 2: return <TrendingUp className="text-blue-600" size={48} />;
      case 3: return <Award className="text-green-600" size={48} />;
      case 4: return <Star className="text-amber-600" size={48} />;
      case 5: return <Trophy className="text-red-600" size={48} />;
      default: return <Award className="text-slate-600" size={48} />;
    }
  };

  const getLevelColor = (levelNumber: number) => {
    switch (levelNumber) {
      case 1: return { bg: 'from-slate-50 to-slate-100', border: 'border-slate-300', accent: 'bg-slate-600' };
      case 2: return { bg: 'from-blue-50 to-blue-100', border: 'border-blue-300', accent: 'bg-blue-600' };
      case 3: return { bg: 'from-green-50 to-green-100', border: 'border-green-300', accent: 'bg-green-600' };
      case 4: return { bg: 'from-amber-50 to-amber-100', border: 'border-amber-300', accent: 'bg-amber-600' };
      case 5: return { bg: 'from-red-50 to-red-100', border: 'border-red-300', accent: 'bg-red-600' };
      default: return { bg: 'from-slate-50 to-slate-100', border: 'border-slate-300', accent: 'bg-slate-600' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading levels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-osp-dark via-osp-navy to-osp-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-blue-300 to-emerald-300">
            Let's connect the Judo world!
          </h1>
          <div className="max-w-5xl mx-auto mb-8 bg-white/5 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-extrabold mb-6 text-center tracking-wide">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400">
                Triple Waza Friendship Challenge
              </span>
              <br />
              <span className="text-blue-300 text-xl md:text-2xl">World Archive</span>
            </h3>
            <div className="text-base md:text-lg text-slate-100 leading-relaxed text-left ml-6 md:ml-8 space-y-3 font-light">
              <p className="hover:text-yellow-200 transition-colors duration-300">
                This library stands as a living global archive. It celebrates individuals who dedicate themselves to the practice and preservation of traditional Judo kata. We salute you.
              </p>
              <p className="hover:text-yellow-200 transition-colors duration-300">
                Each contribution carries a piece of Judo's living history. These submissions unite dojos across the world through shared learning and mutual respect. Together, they form an enduring record—honoring the commitment of today's practitioners while safeguarding this knowledge for generations to come.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-16">
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-10 border-2 border-blue-200 mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How the Level System Works</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Self-Assessment Based</h3>
                <p className="text-slate-700 leading-relaxed">
                  Levels are self-reported by each dojo based on their current understanding and execution. This system encourages honest reflection and continuous improvement without external judgment.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-emerald-900 mb-3">Progressive Learning</h3>
                <p className="text-slate-700 leading-relaxed">
                  Each level builds upon the previous one. Dojos can revisit techniques at higher levels as their understanding deepens, demonstrating growth over time.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-amber-900 mb-3">No Time Limits</h3>
                <p className="text-slate-700 leading-relaxed">
                  Advance when your dojo is ready. Some may progress quickly through early levels, while others may spend more time refining fundamentals. Both approaches are valued.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-red-900 mb-3">Recognition of Effort</h3>
                <p className="text-slate-700 leading-relaxed">
                  Every submission at every level is celebrated and preserved. The goal is to honor your dojo's dedication to kata practice, not to create competition.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {levels.map((level, index) => {
            const colors = getLevelColor(level.level_number);
            return (
              <div
                key={level.id}
                className={`bg-gradient-to-br ${colors.bg} rounded-2xl shadow-xl border-2 ${colors.border} overflow-hidden hover:shadow-2xl transition-all duration-300`}
              >
                <div className="flex flex-col md:flex-row items-center">
                  <div className={`${colors.accent} text-white p-8 md:p-12 flex-shrink-0`}>
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-white/20 p-6 rounded-full mb-4">
                        {getLevelIcon(level.level_number)}
                      </div>
                      <div className="text-5xl font-bold mb-2">Level {level.level_number}</div>
                      <div className="text-xl opacity-90">{level.name.replace(`Level ${level.level_number}`, '').trim()}</div>
                    </div>
                  </div>

                  <div className="flex-1 p-8 md:p-12">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{level.name}</h3>
                    <p className="text-slate-700 text-lg mb-6 leading-relaxed">{level.description}</p>

                    <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-3 flex items-center space-x-2">
                        <Target className="text-blue-600" size={20} />
                        <span>Requirements & Expectations</span>
                      </h4>
                      <p className="text-slate-700 leading-relaxed">{level.requirements}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl p-10 text-white text-center">
          <Trophy className="text-amber-400 mx-auto mb-4" size={56} />
          <h2 className="text-3xl font-bold mb-4">Start Your Journey</h2>
          <p className="text-lg text-slate-200 mb-8 max-w-2xl mx-auto">
            Begin at any level that matches your dojo's current understanding. Every submission contributes to the global kata archive and honors your practice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('submit')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              The Challenge
            </button>
            <button
              onClick={() => onNavigate('hall-of-fame')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 border-2 border-white/30"
            >
              View Practice Library
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
