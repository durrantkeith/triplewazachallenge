import { ChevronRight } from 'lucide-react';

interface ChallengePageProps {
  onNavigate: (page: string) => void;
}

export default function ChallengePage({ onNavigate }: ChallengePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-3">
          <h1 className="text-xl md:text-2xl font-bold text-white mb-1">
            Welcome to the Triple Waza Challenge
          </h1>
        </div>

        <div className="space-y-8 mb-16">
          <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Why Join the Challenge?
            </h2>
            <p className="text-xl text-yellow-400 font-semibold mb-8">
              Traditional Judo doesn't disappear — it gets forgotten. We're changing that.
            </p>
            <p className="text-lg text-slate-300 leading-relaxed">
              The Triple Waza Challenge was born from a simple belief: attainable goals create environments for deeper and more meaningful learning.
              When we achieve those goals together, we experience social bonding in its purest form.
              <br /><br />
              Dojos united by the attainable goal of three techniques will practice and preserve traditional Judo exponentially longer than a small fraction of individuals attempting to master fifteen or twenty-one techniques.
            </p>
          </div>

          <div className="text-center">
            <p className="text-3xl font-bold text-white mb-8">
              Uki-otoshi • Seoi-nage • Kata-guruma
            </p>
            <p className="text-lg text-slate-300 leading-relaxed">
              Dojos are requested to practice and record the first 3 techniques of the Nage no Kata.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 border-2 border-blue-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                1
              </div>
            </div>

            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Practice & Record.</h3>
              <p className="text-sm italic text-gray-600 mb-4">Perfection not required!</p>
              <p className="text-gray-700 leading-relaxed">
                Gather your dojo and film the first three Nage-no-kata techniques together using a cell phone.
              </p>
            </div>

            <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
              <ChevronRight className="text-gray-400" size={32} />
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-8 border-2 border-red-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                2
              </div>
            </div>

            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload to YouTube</h3>
              <p className="text-gray-700 leading-relaxed">
                Upload your video to YouTube (public or unlisted). Copy the link and submit it through our simple form.
              </p>
            </div>

            <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
              <ChevronRight className="text-gray-400" size={32} />
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 border-2 border-green-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                3
              </div>
            </div>

            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Join the Challenge!</h3>
              <p className="text-gray-700 leading-relaxed">
                Our Challenge is to have 1000 dojos learn and show us their kata drill. Take your place in Judo history and our Hall of Fame.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => onNavigate('video-submit')}
            className="bg-red-600 hover:bg-red-700 text-white text-xl font-bold px-12 py-4 rounded-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            Submit Your Video
          </button>
        </div>
      </div>
    </div>
  );
}
