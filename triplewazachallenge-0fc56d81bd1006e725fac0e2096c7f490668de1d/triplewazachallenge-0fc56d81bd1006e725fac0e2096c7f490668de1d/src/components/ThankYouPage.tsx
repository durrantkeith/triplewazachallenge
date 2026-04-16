import { CheckCircle, Heart, Users, ArrowRight, Home } from 'lucide-react';

interface ThankYouPageProps {
  onNavigate: (page: string) => void;
}

export default function ThankYouPage({ onNavigate }: ThankYouPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-12 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 animate-scale-in">
              <CheckCircle className="text-green-600" size={56} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Thank You!
            </h1>
            <p className="text-xl text-green-100">
              Your invitations have been sent successfully
            </p>
          </div>

          <div className="p-8 md:p-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center space-x-2 text-slate-700 mb-6">
                <Heart className="text-red-500" size={28} />
                <span className="text-2xl font-semibold">Spreading the Spirit of Judo</span>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                You're helping build bridges between dojos around the world. By inviting others to join the Triple Waza Friendship Challenge, you're strengthening the global Judo community and preserving our traditions for future generations.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-8 mb-8 border border-blue-100">
              <div className="flex items-start space-x-4 mb-6">
                <Users className="text-osp-blue flex-shrink-0 mt-1" size={32} />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">What Happens Next?</h3>
                  <p className="text-slate-700 leading-relaxed">
                    The dojos you invited will receive an email with all the details they need to participate. They'll be able to learn about the challenge, watch educational videos, and submit their own practice videos to join the global archive.
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-slate-700">
                <div className="flex items-start">
                  <div className="bg-green-500 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                  <p>Your invitations have been delivered to the email addresses you provided</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-500 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                  <p>They can respond to you directly if you included your email</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-500 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                  <p>Together, we're creating a living record of Judo practice worldwide</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => onNavigate('challenge-friend')}
                className="bg-osp-blue hover:bg-osp-navy text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
              >
                <span>Invite More Dojos</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>

              <button
                onClick={() => onNavigate('home')}
                className="bg-white hover:bg-slate-50 text-slate-700 font-semibold py-4 px-6 rounded-xl transition-all duration-300 border-2 border-slate-300 flex items-center justify-center space-x-2"
              >
                <Home size={20} />
                <span>Return Home</span>
              </button>
            </div>

            <div className="text-center pt-6 border-t border-slate-200">
              <p className="text-slate-600 mb-4">
                Want to submit your own video to the challenge?
              </p>
              <button
                onClick={() => onNavigate('submit')}
                className="text-osp-blue hover:text-osp-navy font-semibold text-lg underline"
              >
                Submit Your Dojo's Video
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-slate-600 text-sm">
            Together, we strengthen Judo for generations to come
          </p>
        </div>
      </div>
    </div>
  );
}
