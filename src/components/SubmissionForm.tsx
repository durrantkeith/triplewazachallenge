import { CheckCircle, Play, Upload } from 'lucide-react';

export default function SubmissionForm() {

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-10 mb-12 border border-slate-200 shadow-xl">
        <div className="bg-white rounded-xl p-8 mb-8 border border-slate-200 shadow-md">
          <h3 className="text-2xl md:text-3xl font-bold text-osp-blue mb-4 text-center">
            Triple Waza World Archive
          </h3>
          <p className="text-slate-700 text-base md:text-lg leading-relaxed text-left mb-6">
            This library serves as a global archive of individuals practicing and preserving their piece of Judo history through traditional techniques. The movement connects dojos worldwide through shared learning, and every submission becomes part of a living record honoring participating dojos and making this knowledge accessible for future generations.
          </p>
          <p className="text-xl md:text-2xl text-slate-900 font-light leading-relaxed tracking-wide text-center">
            Join us in creating a living record of global Judo cooperation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-center mb-4">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="text-osp-blue" size={32} />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Recognition</h4>
            </div>
            <p className="text-slate-600 text-left">
              Every dojo's practice is permanently preserved and honored
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-center mb-4">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Play className="text-green-600" size={32} />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Education</h4>
            </div>
            <p className="text-slate-600 text-left">
              Learn from dojos worldwide and improve your understanding
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-center mb-4">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Upload className="text-yellow-600" size={32} />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Connection</h4>
            </div>
            <p className="text-slate-600 text-left">
              Join a global community dedicated to kata preservation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
