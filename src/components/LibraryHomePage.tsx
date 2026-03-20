import { useState, useEffect } from 'react';
import { Trophy, Globe, Target, Users, Gift, BookOpen } from 'lucide-react';

interface LibraryHomePageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function LibraryHomePage({ onNavigate }: LibraryHomePageProps) {
  const [bounceOnMount, setBounceOnMount] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBounceOnMount(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div
        onClick={() => {
          document.getElementById('challenge-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-16 cursor-pointer hover:opacity-95 transition-opacity duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-3xl md:text-5xl font-bold mb-12 text-yellow-300 leading-tight">
            Traditional Judo. Smaller steps. Deeper understanding. Attainable goals for all.
          </p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Trophy className="text-amber-400 mx-auto mb-3" size={40} />
              <h3 className="font-bold text-xl mb-2">Recognition</h3>
              <p className="text-slate-300 text-sm">Every dojo's practice is permanently preserved and honored</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <BookOpen className="text-blue-400 mx-auto mb-3" size={40} />
              <h3 className="font-bold text-xl mb-2">Education</h3>
              <p className="text-slate-300 text-sm">Learn from dojos worldwide and improve your understanding</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Globe className="text-emerald-400 mx-auto mb-3" size={40} />
              <h3 className="font-bold text-xl mb-2">Connection</h3>
              <p className="text-slate-300 text-sm">Join a global community dedicated to kata preservation</p>
            </div>
          </div>
        </div>
      </div>

      <div
        id="challenge-section"
        onClick={() => onNavigate('challenge-friend')}
        className="bg-gradient-to-br from-blue-900 via-slate-900 to-blue-900 text-white py-16 cursor-pointer hover:opacity-95 transition-opacity duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-3xl md:text-5xl font-bold mb-12 text-emerald-300 leading-tight">
            Fun, friendship, and achievable goals<br />for everyone
          </p>
          <h3 className="text-2xl md:text-3xl font-bold mb-6">The Challenge</h3>
          <p className="text-lg md:text-xl text-slate-200 max-w-4xl mx-auto mb-8 leading-relaxed">
            Submit a video demonstrating the first 3 techniques of the Nage no Kata as a group.
            <br />
            This simple format makes traditional judo accessible to practitioners of all levels and ages, fostering growth through repetition and building connections across the global judo community.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Target className="text-rose-400 mx-auto mb-3" size={40} />
              <h3 className="font-bold text-xl mb-2">Achievable</h3>
              <p className="text-slate-300 text-sm">Three techniques, three repetitions each - a format designed for success</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Users className="text-cyan-400 mx-auto mb-3" size={40} />
              <h3 className="font-bold text-xl mb-2">Friendship</h3>
              <p className="text-slate-300 text-sm">Connect with dojos worldwide and challenge your friends to participate</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Gift className="text-violet-400 mx-auto mb-3" size={40} />
              <h3 className="font-bold text-xl mb-2">Fun</h3>
              <p className="text-slate-300 text-sm">Enjoy the journey of learning and earn recognition for your dedication</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
