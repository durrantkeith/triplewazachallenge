import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { MapPin, Globe2 } from 'lucide-react';

interface CountryData {
  country: string;
  dojoCount: number;
  cities: string[];
}

export function GlobalMap() {
  const [countryData, setCountryData] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCountryData();
  }, []);

  async function fetchCountryData() {
    try {
      const { data, error } = await supabase
        .from('dojos')
        .select('country, city, name');

      if (error) throw error;

      const countryMap = new Map<string, { count: number; cities: Set<string> }>();

      data?.forEach(dojo => {
        if (dojo.country) {
          const existing = countryMap.get(dojo.country) || { count: 0, cities: new Set() };
          existing.count += 1;
          if (dojo.city) existing.cities.add(dojo.city);
          countryMap.set(dojo.country, existing);
        }
      });

      const formattedData = Array.from(countryMap.entries()).map(([country, info]) => ({
        country,
        dojoCount: info.count,
        cities: Array.from(info.cities)
      })).sort((a, b) => b.dojoCount - a.dojoCount);

      setCountryData(formattedData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="py-16 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="animate-pulse">Loading global participation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (countryData.length === 0) {
    return null;
  }

  return (
    <div className="py-16 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
            <Globe2 className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            A Global Movement
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Dojos from around the world are joining together every Friday
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {countryData.map((country, index) => (
              <div
                key={country.country}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all duration-200 transform hover:scale-105"
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <MapPin className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <span className="font-bold text-lg truncate">{country.country}</span>
                  </div>
                  <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded-full ml-2 flex-shrink-0">
                    {country.dojoCount}
                  </span>
                </div>

                {country.cities.length > 0 && (
                  <div className="text-sm text-blue-100 mt-2 line-clamp-2">
                    {country.cities.slice(0, 3).join(', ')}
                    {country.cities.length > 3 && '...'}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-blue-100 text-lg">
              <span className="font-bold text-2xl text-white">{countryData.length}</span> countries represented
            </p>
            <p className="text-blue-200 mt-2">
              Be part of this growing international community!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}