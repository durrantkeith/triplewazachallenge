import { Calendar, Rocket, Trophy, Users } from 'lucide-react';

export function EventTimeline() {
  const phases = [
    {
      icon: Rocket,
      title: 'Launch Phase',
      date: 'April 28, 2026',
      description: 'Challenge officially begins! Submit your first video and start earning badges.',
      status: 'upcoming',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Users,
      title: 'Community Building',
      date: 'Ongoing',
      description: 'Dojos join from around the world. Watch submissions, connect with other clubs, and inspire each other.',
      status: 'current',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Trophy,
      title: 'Hall of Fame',
      date: 'Continuous Recognition',
      description: 'All participating dojos featured permanently. Earn progressive badges as your club advances through levels.',
      status: 'ongoing',
      color: 'from-amber-500 to-amber-600'
    }
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'current') {
      return (
        <span className="inline-flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span>Active Now</span>
        </span>
      );
    }
    if (status === 'upcoming') {
      return (
        <span className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase">
          Coming Soon
        </span>
      );
    }
    return (
      <span className="inline-flex items-center bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold uppercase">
        Ongoing
      </span>
    );
  };

  return (
    <div className="py-16 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Challenge Timeline
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            This is an ongoing initiative with continuous participation
          </p>
        </div>

        <div className="space-y-8">
          {phases.map((phase, index) => {
            const Icon = phase.icon;
            return (
              <div
                key={index}
                className="relative bg-white rounded-xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${phase.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <h3 className="text-2xl font-bold text-slate-900">
                        {phase.title}
                      </h3>
                      {getStatusBadge(phase.status)}
                    </div>

                    <p className="text-red-600 font-semibold mb-3 flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{phase.date}</span>
                    </p>

                    <p className="text-slate-600 text-lg leading-relaxed">
                      {phase.description}
                    </p>
                  </div>
                </div>

                {index < phases.length - 1 && (
                  <div className="hidden md:block absolute left-8 bottom-0 w-0.5 h-8 bg-gradient-to-b from-slate-300 to-transparent transform translate-y-full"></div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">No Deadlines. No Pressure.</h3>
          <p className="text-lg text-red-100 max-w-2xl mx-auto leading-relaxed">
            This is a continuous, open challenge. Join anytime, progress at your own pace,
            and be part of a growing global community forever.
          </p>
        </div>
      </div>
    </div>
  );
}