import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Globe, Video } from 'lucide-react';

interface Stats {
  totalDojos: number;
  totalCountries: number;
  totalSubmissions: number;
}

export function ParticipationStats() {
  const [stats, setStats] = useState<Stats>({ totalDojos: 0, totalCountries: 0, totalSubmissions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const [dojosResult, submissionsResult] = await Promise.all([
        supabase.from('dojos').select('country', { count: 'exact' }),
        supabase.from('submissions').select('id', { count: 'exact' })
      ]);

      const uniqueCountries = new Set(
        dojosResult.data?.map(d => d.country).filter(Boolean) || []
      ).size;

      setStats({
        totalDojos: dojosResult.count || 0,
        totalCountries: uniqueCountries,
        totalSubmissions: submissionsResult.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg font-semibold animate-pulse">Loading participation data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center transform hover:scale-105 transition-transform duration-200">
            <div className="flex justify-center mb-4">
              <Globe className="w-16 h-16" />
            </div>
            <div className="text-5xl font-bold mb-3">{stats.totalCountries}</div>
            <div className="text-red-100 font-bold text-lg">Countries Participating</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center transform hover:scale-105 transition-transform duration-200">
            <div className="flex justify-center mb-4">
              <Users className="w-16 h-16" />
            </div>
            <div className="text-5xl font-bold mb-3">{stats.totalDojos}</div>
            <div className="text-red-100 font-bold text-lg">Dojos Worldwide</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center transform hover:scale-105 transition-transform duration-200">
            <div className="flex justify-center mb-4">
              <Video className="w-16 h-16" />
            </div>
            <div className="text-5xl font-bold mb-3">{stats.totalSubmissions}</div>
            <div className="text-red-100 font-bold text-lg">Kata Videos Submitted</div>
          </div>
        </div>
      </div>
    </div>
  );
}