import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Globe, TrendingUp } from 'lucide-react';

interface CountryStats {
  country: string;
  count: number;
  flag: string;
}

export function GlobalParticipation() {
  const [countries, setCountries] = useState<CountryStats[]>([]);
  const [totalDojos, setTotalDojos] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCountryStats();
  }, []);

  const getCountryFlag = (country: string): string => {
    const flagEmojis: { [key: string]: string } = {
      'Canada': '🇨🇦',
      'USA': '🇺🇸',
      'United States': '🇺🇸',
      'United Kingdom': '🇬🇧',
      'UK': '🇬🇧',
      'Japan': '🇯🇵',
      'France': '🇫🇷',
      'Germany': '🇩🇪',
      'Brazil': '🇧🇷',
      'Australia': '🇦🇺',
      'Mexico': '🇲🇽',
      'Italy': '🇮🇹',
      'Spain': '🇪🇸',
      'Netherlands': '🇳🇱',
      'Belgium': '🇧🇪',
      'Portugal': '🇵🇹',
      'Argentina': '🇦🇷',
      'Chile': '🇨🇱',
      'Poland': '🇵🇱',
      'Russia': '🇷🇺',
      'South Africa': '🇿🇦',
      'India': '🇮🇳',
      'China': '🇨🇳',
      'South Korea': '🇰🇷',
      'New Zealand': '🇳🇿',
      'Sweden': '🇸🇪',
      'Norway': '🇳🇴',
      'Denmark': '🇩🇰',
      'Finland': '🇫🇮',
      'Ireland': '🇮🇪',
      'Austria': '🇦🇹',
      'Switzerland': '🇨🇭',
    };
    return flagEmojis[country] || '🌍';
  };

  async function fetchCountryStats() {
    try {
      const { data, error } = await supabase
        .from('dojos')
        .select('country');

      if (error) throw error;

      const countryMap = new Map<string, number>();
      data?.forEach(dojo => {
        if (dojo.country) {
          countryMap.set(dojo.country, (countryMap.get(dojo.country) || 0) + 1);
        }
      });

      const countryStats = Array.from(countryMap.entries())
        .map(([country, count]) => ({
          country,
          count,
          flag: getCountryFlag(country)
        }))
        .sort((a, b) => b.count - a.count);

      setCountries(countryStats);
      setTotalDojos(data?.length || 0);
    } catch (error) {
      console.error('Error fetching country stats:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading || countries.length === 0) {
    return null;
  }

  return (
    <div className="py-12 bg-white border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center space-x-2 bg-red-100 text-red-800 px-4 py-2 rounded-full mb-4">
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold">Live Participation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Dojos Joining Today
          </h2>
          <p className="text-lg text-slate-600">
            Judoka from <span className="font-bold text-red-600">{countries.length}</span> {countries.length === 1 ? 'country' : 'countries'} are already part of the movement
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {countries.map((country) => (
            <div
              key={country.country}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200 hover:border-red-400 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
            >
              <span className="text-2xl">{country.flag}</span>
              <div className="text-left">
                <div className="font-bold text-slate-900 text-sm">{country.country}</div>
                <div className="text-xs text-slate-600">
                  {country.count} {country.count === 1 ? 'dojo' : 'dojos'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalDojos > 0 && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 text-slate-600">
              <Globe className="w-5 h-5 text-red-600" />
              <span className="text-sm">
                <span className="font-bold text-red-600">{totalDojos}</span> total {totalDojos === 1 ? 'dojo has' : 'dojos have'} joined the challenge
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}