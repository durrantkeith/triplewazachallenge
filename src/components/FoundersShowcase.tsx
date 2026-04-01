import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Star } from 'lucide-react';

interface Founder {
  id: string;
  name: string;
  title: string;
  country: string;
  city: string;
  photo_url: string;
  bio: string;
  contribution_type: string;
}

interface FoundersShowcaseProps {
  onNavigate: (page: string) => void;
}

export function FoundersShowcase({ onNavigate }: FoundersShowcaseProps) {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFounders();
  }, []);

  async function loadFounders() {
    try {
      const { data, error } = await supabase
        .from('founders')
        .select('*')
        .order('order_index')
        .limit(10);

      if (error) throw error;
      setFounders(data || []);
    } catch (error) {
      console.error('Error loading founders:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="py-16 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="animate-pulse">Loading founders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (founders.length === 0) {
    return null;
  }

  return (
    <div className="py-16 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 rounded-full mb-4">
            <Star className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            The Founders
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Recognizing the visionaries and early supporters who helped build this global movement
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-8">
          {founders.map((founder) => (
            <div
              key={founder.id}
              className="group cursor-pointer"
              onClick={() => onNavigate('our-journey')}
            >
              <div className="relative mb-3">
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-700 ring-4 ring-slate-700 group-hover:ring-amber-500 transition-all duration-300 transform group-hover:scale-105">
                  {founder.photo_url ? (
                    <img
                      src={founder.photo_url}
                      alt={founder.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-700">
                      <Users className="w-12 h-12 text-slate-400" />
                    </div>
                  )}
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-white text-sm mb-1 group-hover:text-amber-400 transition-colors duration-200">
                  {founder.name}
                </h3>
                {founder.title && (
                  <p className="text-xs text-slate-400 mb-1 line-clamp-2">
                    {founder.title}
                  </p>
                )}
                {(founder.city || founder.country) && (
                  <p className="text-xs text-slate-500">
                    {founder.city && founder.country
                      ? `${founder.city}, ${founder.country}`
                      : founder.city || founder.country}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => onNavigate('our-journey')}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 border-2 border-white/20 hover:border-amber-500 transform hover:scale-105"
          >
            View All Founders & Their Stories
          </button>
          <p className="mt-4 text-sm text-slate-400 italic">
            These are the leaders who believed in the vision from the beginning
          </p>
        </div>
      </div>
    </div>
  );
}