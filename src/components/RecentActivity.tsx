import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { MapPin, Calendar, TrendingUp } from 'lucide-react';

interface RecentSubmission {
  id: string;
  submitted_at: string;
  dojo: {
    name: string;
    city: string;
    country: string;
  };
}

export function RecentActivity() {
  const [submissions, setSubmissions] = useState<RecentSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentSubmissions();
  }, []);

  async function fetchRecentSubmissions() {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          id,
          submitted_at,
          dojo:dojos (
            name,
            city,
            country
          )
        `)
        .order('submitted_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching recent submissions:', error);
    } finally {
      setLoading(false);
    }
  }

  function getTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  }

  if (loading) {
    return (
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500 animate-pulse">Loading recent activity...</p>
          </div>
        </div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return null;
  }

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See which dojos are actively participating in the movement right now!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border-2 border-gray-200 hover:border-red-500 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">
                    {submission.dojo.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="line-clamp-1">
                      {submission.dojo.city}, {submission.dojo.country}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center text-xs text-gray-500 bg-white/50 rounded px-2 py-1">
                <Calendar className="w-3 h-3 mr-1" />
                <span>{getTimeAgo(submission.submitted_at)}</span>
              </div>

              <div className="mt-3 flex justify-center">
                <div className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  ✓ Submitted
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-600 text-lg font-semibold">
            Your dojo could be featured here next! 🥋
          </p>
        </div>
      </div>
    </div>
  );
}