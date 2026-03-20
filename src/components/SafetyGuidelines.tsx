import { Shield } from 'lucide-react';

export default function SafetyGuidelines() {
  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-block p-6 bg-green-100 rounded-full mb-6">
            <Shield size={64} className="text-green-600" />
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Safety Guidelines</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Here are some essential safety practices for kata training and demonstration.
          </p>
          <p className="text-2xl font-semibold text-slate-900">
            Your safety and the safety of your training partner is always the top priority.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-green-500">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Warm Up Properly</h2>
            <p className="text-slate-700 mb-6 leading-relaxed">
              Always begin with a thorough warm-up to prepare your body for kata practice. This includes joint rotations, stretching, and light cardio to increase blood flow and reduce the risk of injury.
            </p>
            <p className="text-sm italic text-slate-600 bg-slate-50 p-4 rounded-lg">
              A proper warm-up should last at least 10-15 minutes before practicing throws.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-blue-500">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Know Your Partner</h2>
            <p className="text-slate-700 mb-6 leading-relaxed">
              Communicate with your training partner about experience level, any injuries, and comfort zones. Trust and mutual respect are essential for safe kata practice.
            </p>
            <p className="text-sm italic text-slate-600 bg-slate-50 p-4 rounded-lg">
              Never practice advanced techniques with beginners without proper supervision.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-orange-500">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Control and Precision</h2>
            <p className="text-slate-700 mb-6 leading-relaxed">
              Execute techniques with controlled movements rather than speed or power. Focus on proper form, balance, and precise execution to prevent accidents and injuries.
            </p>
            <p className="text-sm italic text-slate-600 bg-slate-50 p-4 rounded-lg">
              Remember: Kata is about demonstrating perfect form, not competition intensity.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Additional Safety Considerations</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-slate-700">
                  <span className="font-semibold">Proper Matting:</span> Ensure you have adequate mat coverage and that mats are properly secured to prevent slipping.
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-slate-700">
                  <span className="font-semibold">Environment Check:</span> Clear the practice area of obstacles and ensure adequate space for safe practice.
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-slate-700">
                  <span className="font-semibold">Proper Attire:</span> Wear a clean, well-maintained gi that fits properly to prevent entanglement or grip issues.
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-slate-700">
                  <span className="font-semibold">Supervision:</span> Beginners should always practice under the guidance of a qualified instructor.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-slate-700">
                  <span className="font-semibold">Know Your Limits:</span> Don't attempt techniques beyond your current skill level without proper instruction.
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-slate-700">
                  <span className="font-semibold">Break Falls:</span> Both partners should be proficient in ukemi (breakfalls) before practicing throwing techniques.
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-slate-700">
                  <span className="font-semibold">Stay Alert:</span> Maintain focus and awareness throughout practice. Fatigue increases injury risk.
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-slate-700">
                  <span className="font-semibold">Medical Clearance:</span> Consult with a healthcare provider before beginning judo practice if you have any health concerns.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">Remember</h3>
          <p className="text-lg">
            The goal of the Triple Waza Challenge is to preserve and practice traditional judo in a safe, enjoyable way. Never compromise safety for the sake of demonstration or video quality. Practice responsibly and enjoy the journey!
          </p>
        </div>
      </div>
    </div>
  );
}
