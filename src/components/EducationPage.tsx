import { useState, useEffect } from 'react';
import { Video, BookOpen, Users, Upload, X, CheckCircle, Film as FilmIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface EducationPageProps {
  onNavigate: (page: string) => void;
}

interface EducationalVideo {
  id: string;
  title: string;
  description: string;
  video_url: string;
  category: 'drill' | 'uki-otoshi' | 'seoi-nage' | 'kata-guruma' | 'general';
  order_index: number;
  created_at: string;
}

export default function EducationPage({ onNavigate }: EducationPageProps) {
  const [videos, setVideos] = useState<EducationalVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    video_url: '',
    category: 'general' as EducationalVideo['category'],
    order_index: 0
  });

  useEffect(() => {
    checkAdminStatus();
    fetchVideos();

    setTimeout(() => {
      const overviewSection = document.getElementById('overview-section');
      if (overviewSection) {
        overviewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAdmin(!!user);
  };

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from('educational_videos')
      .select('*')
      .order('category')
      .order('order_index');

    if (!error && data) {
      setVideos(data);
    }
    setLoading(false);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from('educational_videos')
      .insert([uploadForm]);

    if (!error) {
      alert('Video added successfully!');
      setUploadForm({
        title: '',
        description: '',
        video_url: '',
        category: 'general',
        order_index: 0
      });
      setShowUploadForm(false);
      fetchVideos();
    } else {
      alert('Error adding video: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    const { error } = await supabase
      .from('educational_videos')
      .delete()
      .eq('id', id);

    if (!error) {
      fetchVideos();
    } else {
      alert('Error deleting video: ' + error.message);
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const VideoSection = ({ title, category, icon }: { title: string; category: EducationalVideo['category']; icon: React.ReactNode }) => {
    const categoryVideos = videos.filter(v => v.category === category);

    if (categoryVideos.length === 0 && !isAdmin) return null;

    return (
      <div className="mb-12">
        <div className="flex items-center space-x-3 mb-6">
          <div className="text-blue-600">{icon}</div>
          <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
        </div>

        {categoryVideos.length === 0 ? (
          <p className="text-slate-600 italic">No videos yet. Add your first video above!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoryVideos.map((video) => {
              const embedUrl = getYouTubeEmbedUrl(video.video_url);
              return (
                <div key={video.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {embedUrl ? (
                    <div className="relative pb-[56.25%]">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={embedUrl}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="bg-slate-200 h-48 flex items-center justify-center">
                      <Video className="text-slate-400" size={48} />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{video.title}</h3>
                    <p className="text-slate-600">{video.description}</p>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="mt-4 text-red-600 hover:text-red-700 text-sm font-semibold"
                      >
                        Delete Video
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-osp-dark via-osp-navy to-osp-dark text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <button
            onClick={() => onNavigate('home')}
            className="text-blue-200 hover:text-white mb-6 flex items-center space-x-2"
          >
            <span>← Back to Home</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {isAdmin && (
          <div className="mb-8">
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Upload size={20} />
              <span>{showUploadForm ? 'Cancel' : 'Add Educational Video'}</span>
            </button>

            {showUploadForm && (
              <div className="mt-6 bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Upload Educational Video</h3>
                  <button onClick={() => setShowUploadForm(false)}>
                    <X className="text-slate-400 hover:text-slate-600" />
                  </button>
                </div>
                <form onSubmit={handleUpload} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Video Title
                    </label>
                    <input
                      type="text"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      YouTube URL
                    </label>
                    <input
                      type="url"
                      value={uploadForm.video_url}
                      onChange={(e) => setUploadForm({ ...uploadForm, video_url: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="https://youtube.com/watch?v=..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Category
                      </label>
                      <select
                        value={uploadForm.category}
                        onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value as EducationalVideo['category'] })}
                        className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      >
                        <option value="general">General</option>
                        <option value="drill">Drill Organization</option>
                        <option value="uki-otoshi">Uki-otoshi</option>
                        <option value="seoi-nage">Seoi-nage</option>
                        <option value="kata-guruma">Kata-guruma</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Order (for sorting)
                      </label>
                      <input
                        type="number"
                        value={uploadForm.order_index}
                        onChange={(e) => setUploadForm({ ...uploadForm, order_index: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        min="0"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
                  >
                    Add Video
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        <div id="overview-section" className="mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-8 md:p-12 border-2 border-blue-200 mb-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center space-x-3 mb-4">
                <BookOpen className="text-blue-600" size={40} />
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900">
                  Triple Waza World Archive
                </h3>
              </div>
            </div>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                This library serves as a global archive of individuals practicing and preserving their piece of Judo history through traditional techniques. The movement connects dojos worldwide through shared learning, and every submission becomes part of a living record honoring participating dojos and making this knowledge accessible for future generations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h4 className="font-bold text-slate-900 text-lg mb-2">Recognition</h4>
                <p className="text-slate-600 text-sm">Every dojo's practice is permanently preserved and honored</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h4 className="font-bold text-slate-900 text-lg mb-2">Education</h4>
                <p className="text-slate-600 text-sm">Learn from dojos worldwide and improve your understanding</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h4 className="font-bold text-slate-900 text-lg mb-2">Connection</h4>
                <p className="text-slate-600 text-sm">Join a global community dedicated to kata preservation</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8 border-2 border-yellow-200">
            <p className="font-semibold text-slate-800 mb-6 text-lg text-center">The Triple Waza Challenge is designed to be simple and fun for your entire dojo</p>

            <div className="grid md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mb-3 mx-auto">
                <span className="text-blue-700 font-bold text-lg">1</span>
              </div>
              <h3 className="font-bold text-slate-900 text-center mb-2 text-sm">Line Up</h3>
              <p className="text-slate-600 text-xs text-left">Get everyone in your dojo involved, regardless of rank, age or experience</p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mb-3 mx-auto">
                <span className="text-green-700 font-bold text-lg">2</span>
              </div>
              <h3 className="font-bold text-slate-900 text-center mb-2 text-sm">Opening Bow</h3>
              <p className="text-slate-600 text-xs text-left">Begin with a standing bow, heels together, and step in as a group</p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="bg-yellow-100 w-10 h-10 rounded-full flex items-center justify-center mb-3 mx-auto">
                <span className="text-yellow-700 font-bold text-lg">3</span>
              </div>
              <h3 className="font-bold text-slate-900 text-center mb-2 text-sm">Perform</h3>
              <p className="text-slate-600 text-xs text-left">Perform the 3 techniques simultaneously at half speed as a group. Use a gentle forward breakfall for Uki Otoshi. For Seoi Nage and Kata Guruma, only lifting, without throwing, is permitted.</p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="bg-red-100 w-10 h-10 rounded-full flex items-center justify-center mb-3 mx-auto">
                <span className="text-red-700 font-bold text-lg">4</span>
              </div>
              <h3 className="font-bold text-slate-900 text-center mb-2 text-sm">Closing Bow</h3>
              <p className="text-slate-600 text-xs text-left">Return to the position where you stepped into the demonstration area and stand in normal posture facing your partner. Step back with your right foot, then left foot so your heels come together. Conclude with a standing bow.</p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center mb-3 mx-auto">
                <span className="text-purple-700 font-bold text-lg">5</span>
              </div>
              <h3 className="font-bold text-slate-900 text-center mb-2 text-sm">Submit</h3>
              <p className="text-slate-600 text-xs text-left">Film and share with the global community</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border-l-4 border-yellow-500">
            <div className="flex items-start space-x-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
              <p className="text-slate-700 text-sm italic">
                Remember: This is about learning together and having fun. Perfection is not required - participation and effort are what matter!
              </p>
            </div>
          </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-slate-600 mt-4">Loading educational content...</p>
          </div>
        ) : (
          <>
            <VideoSection
              title="How to Organize Your Dojo Drill"
              category="drill"
              icon={<Users size={32} />}
            />

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FilmIcon className="text-blue-600" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900">The Three Techniques</h2>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 mb-8 border-2 border-blue-200">
                <p className="text-slate-800 text-center font-semibold">
                  Below you'll find instructional resources for each of the three techniques in Level 1 of the Nage-no-kata.
                </p>
              </div>

              <VideoSection
                title="1. Uki-otoshi (Floating Drop)"
                category="uki-otoshi"
                icon={<span className="text-2xl font-bold">1</span>}
              />

              <VideoSection
                title="2. Seoi-nage (Shoulder Throw)"
                category="seoi-nage"
                icon={<span className="text-2xl font-bold">2</span>}
              />

              <VideoSection
                title="3. Kata-guruma (Shoulder Wheel)"
                category="kata-guruma"
                icon={<span className="text-2xl font-bold">3</span>}
              />
            </div>

            <VideoSection
              title="Additional Resources"
              category="general"
              icon={<BookOpen size={32} />}
            />
          </>
        )}

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center mt-12">
          <h2 className="text-2xl font-bold mb-4">Stay Connected</h2>
          <p className="text-blue-100 mb-6">
            Join our community and stay informed about upcoming challenges and events!
          </p>
          <button
            onClick={() => onNavigate('video-submit')}
            className="bg-white text-blue-700 px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors"
          >
            Submit Your Video
          </button>
        </div>
      </div>
    </div>
  );
}
