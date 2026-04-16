import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface JourneyContent {
  id: string;
  section_key: string;
  title: string;
  content: string;
  order_index: number;
}

interface OurJourneyPageProps {
  onNavigate: (page: string) => void;
}

export default function OurJourneyPage({ onNavigate }: OurJourneyPageProps) {
  const [content, setContent] = useState<JourneyContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    try {
      const { data, error } = await supabase
        .from('our_journey_content')
        .select('*')
        .eq('section_key', 'main_story')
        .maybeSingle();

      if (error) throw error;
      setContent(data);
    } catch (error) {
      console.error('Error loading journey content:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  const paragraphs = content?.content.split('\n\n') || [];

  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg px-12 py-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">{content?.title || 'Our Journey'}</h1>

          <div className="space-y-6">
            {paragraphs.map((paragraph, index) => {
              const lines = paragraph.split('\n');

              return (
                <p key={index} className="text-slate-700 text-base leading-relaxed">
                  {lines.map((line, lineIndex) => (
                    <span key={lineIndex}>
                      {line}
                      {lineIndex < lines.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              );
            })}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="flex justify-center">
              <button
                onClick={() => onNavigate('submit')}
                className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Submit Your Video
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
