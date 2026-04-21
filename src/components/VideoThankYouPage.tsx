import { CheckCircle, Home, Trophy, Mail } from 'lucide-react';

interface VideoThankYouPageProps {
  onNavigate: (page: string) => void;
}

export default function VideoThankYouPage({ onNavigate }: VideoThankYouPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-5 shadow-lg">
              <CheckCircle className="text-green-500" size={48} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Submission Received!
            </h1>
            <p className="text-slate-300 text-lg">
              Your video is now part of the global archive
            </p>
          </div>

          <div className="p-8 md:p-10">
            <div className="space-y-5 mb-8">
              <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border border-green-200">
                <Mail className="text-green-600 flex-shrink-0 mt-0.5" size={22} />
                <div>
                  <p className="font-semibold text-green-900 text-sm">Confirmation email sent</p>
                  <p className="text-green-800 text-sm mt-0.5">
                    Check your inbox — we've sent you a confirmation with details about your submission.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <Trophy className="text-blue-600 flex-shrink-0 mt-0.5" size={22} />
                <div>
                  <p className="font-semibold text-blue-900 text-sm">Under review</p>
                  <p className="text-blue-800 text-sm mt-0.5">
                    Our team will review your video and add it to the Hall of Fame. You'll receive another email once it's approved.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-slate-600 text-center text-base leading-relaxed mb-8">
              Thank you for being part of this global celebration of Nage no Kata. Your dojo's practice is now permanently preserved in the Triple Waza World Archive.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => onNavigate('hall-of-fame')}
                className="bg-slate-900 hover:bg-slate-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <Trophy size={18} />
                <span>View Hall of Fame</span>
              </button>

              <button
                onClick={() => onNavigate('home')}
                className="bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 border-2 border-slate-300 flex items-center justify-center space-x-2"
              >
                <Home size={18} />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Together, we preserve Judo for generations to come
        </p>
      </div>
    </div>
  );
}
