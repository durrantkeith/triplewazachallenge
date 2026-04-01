import { Video, Upload, Award } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      number: '1',
      icon: Video,
      title: 'Learn 3 techniques as a dojo.',
      description: 'Gather your dojo and perform the first three Nage-no-kata techniques together.',
      color: 'from-red-600 to-red-700'
    },
    {
      number: '2',
      icon: Upload,
      title: 'Submit a cell phone video.',
      description: 'Film it with your phone and upload to YouTube. Submit the link through our form.',
      color: 'from-slate-700 to-slate-800'
    },
    {
      number: '3',
      icon: Award,
      title: 'Challenge other dojos to do the same.',
      description: 'Get featured in our Hall of Fame and inspire other dojos to join the movement.',
      color: 'from-amber-600 to-amber-700'
    }
  ];

  return (
    <div id="how-it-works" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight uppercase" style={{ letterSpacing: '0.03em', textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-semibold">
            Three simple steps to join the movement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative group"
              >
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${step.color} text-white text-3xl font-bold mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-200`}>
                    {step.number}
                  </div>

                  <div className="flex justify-center mb-4">
                    <div className="bg-white rounded-full p-4 shadow-md">
                      <Icon className="w-10 h-10 text-gray-700" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight uppercase" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', letterSpacing: '0.02em', textShadow: '1px 1px 0px rgba(0,0,0,0.1)' }}>
                    {step.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {step.number !== '3' && (
                  <div className="hidden md:block absolute top-10 -right-6 lg:-right-10 w-12 lg:w-20 h-1 bg-gradient-to-r from-gray-300 to-gray-400">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent border-l-gray-400"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 max-w-2xl">
            <p className="text-lg font-semibold text-gray-900 mb-2">
              No Perfect Videos Required!
            </p>
            <p className="text-gray-700">
              This is about participation and fun, not perfection. Your students don't need to be flawless. The movement is about showing up and being part of something bigger!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}