import { Trophy, BookOpen, Globe } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 pt-32 pb-20 px-4">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url("/challengecall001.gif")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay'
          }}
        ></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Welcome to the<br />
            Triple Waza Friendship Challenge!
          </h1>

          <p className="text-2xl text-yellow-400 font-semibold mb-4">
            Reintroducing traditional Judo through attainable goals.
          </p>

          <p className="text-xl text-white font-medium mb-8">
            No judging. No scoring. Just fun.
          </p>

          <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            The Triple Waza Challenge takes just 5 minutes of group practice to become a regular part of your dojo activities. Regardless of rank or experience, the only requirement is that you do it together. Practice as a group, learn from one another, and share your experience in our Hall of Fame! It doesn't matter if you do it perfectly or not. What matters is that you do it together.
          </p>

          <button
            onClick={() => onNavigate('challenge')}
            className="bg-red-600 hover:bg-red-700 text-white text-xl font-bold px-12 py-4 rounded-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            Go to the Challenge
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800 rounded-lg p-8 text-center border-2 border-slate-700 hover:border-yellow-500 transition-all duration-300">
            <Trophy className="text-yellow-500 mx-auto mb-4" size={48} />
            <h3 className="text-2xl font-bold text-white mb-4">Recognition</h3>
            <p className="text-slate-300">
              Every dojo's practice is permanently recorded in our Hall of Fame—a living archive that preserves your collective efforts and honors your commitment to traditional Judo.
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-8 text-center border-2 border-slate-700 hover:border-blue-400 transition-all duration-300">
            <BookOpen className="text-blue-400 mx-auto mb-4" size={48} />
            <h3 className="text-2xl font-bold text-white mb-4">Education</h3>
            <p className="text-slate-300">
              Learn from dojos worldwide and access comprehensive kata resources. Master the fundamentals step by step, with clear guidance and community support.
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-8 text-center border-2 border-slate-700 hover:border-green-400 transition-all duration-300">
            <Globe className="text-green-400 mx-auto mb-4" size={48} />
            <h3 className="text-2xl font-bold text-white mb-4">Connection</h3>
            <p className="text-slate-300">
              Join a global community dedicated to preserving and sharing traditional Judo kata. Connect with practitioners across continents who share your passion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}