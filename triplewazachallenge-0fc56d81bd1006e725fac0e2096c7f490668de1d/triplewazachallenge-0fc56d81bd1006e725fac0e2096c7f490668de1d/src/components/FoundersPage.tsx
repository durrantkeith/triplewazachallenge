import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ChevronDown } from 'lucide-react';

interface Founder {
  id: string;
  name: string;
  title: string;
  country: string;
  city: string;
  photo_url: string;
  bio: string;
  contribution_type: string;
  order_index: number;
}

export default function FoundersPage() {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadFounders();
  }, []);

  async function loadFounders() {
    try {
      const { data, error } = await supabase
        .from('founders')
        .select('*')
        .order('name');

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-light text-slate-800 mb-6">Triple Waza FC Ambassadors</h1>
          <p className="text-lg text-slate-600 mb-3">
            This archive honors the original contributors to the Triple Waza Friendship Challenge.
          </p>
          <p className="text-base text-slate-600">
            Your commitment to traditional judo kata strengthens our movement. We salute you!
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <p className="text-center text-sm text-slate-500 mb-6">In alphabetical order.</p>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 bg-gray-50 px-6 py-4 border-b border-gray-200 text-sm font-medium text-slate-600 uppercase tracking-wider">
            <div>Name</div>
            <div>Prov./State</div>
            <div>Country</div>
            <div>Dojo</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-200">
            {founders.map((founder) => (
              <div key={founder.id}>
                <div
                  className="grid grid-cols-4 gap-4 px-6 py-5 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setExpandedId(expandedId === founder.id ? null : founder.id)}
                >
                  <div className="flex items-center gap-3">
                    {founder.photo_url && (
                      <img
                        src={founder.photo_url}
                        alt={founder.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <span className="text-slate-800">{founder.name}</span>
                  </div>
                  <div className="text-slate-600 flex items-center">{founder.city || '-'}</div>
                  <div className="text-slate-600 flex items-center">{founder.country}</div>
                  <div className="text-slate-600 flex items-center justify-between">
                    <span>{founder.title || '-'}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform ${
                        expandedId === founder.id ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>

                {expandedId === founder.id && founder.bio && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <p className="text-slate-600 text-sm leading-relaxed">{founder.bio}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto px-4 pb-12 text-center">
        <p className="text-sm italic text-slate-500">
          Triple Waza Friendship Challenge — A grassroots judo education initiative
        </p>
      </div>
    </div>
  );
}
