import { Calendar, Clock, MapPin, Users, Bell, CheckCircle } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  location: string;
  status: 'upcoming' | 'active' | 'completed';
  participants?: number;
}

export default function UpcomingEvents() {
  const events: Event[] = [
    {
      id: 1,
      title: 'Challenge Launch',
      date: 'April 28, 2026',
      time: '12:00 PM UTC',
      description: 'Official launch of the Triple Waza Friendship Challenge. All dojos worldwide can begin submitting their videos.',
      location: 'Global (Online)',
      status: 'upcoming',
    },
    {
      id: 2,
      title: 'Level 1 Submissions Open',
      date: 'April 28, 2026',
      time: 'All Day',
      description: 'Begin practicing and filming Uki Otoshi, Seoi Nage, and Kata Guruma. Submissions accepted worldwide.',
      location: 'Your Dojo',
      status: 'upcoming',
    },
    {
      id: 3,
      title: 'Monthly Recognition Ceremony',
      date: 'May 31, 2026',
      time: '7:00 PM UTC',
      description: 'Virtual celebration recognizing the first month of participating dojos. Hall of Fame updates and community showcase.',
      location: 'Online Stream',
      status: 'upcoming',
    },
    {
      id: 4,
      title: 'Global Community Webinar',
      date: 'June 15, 2026',
      time: '6:00 PM UTC',
      description: 'Interactive session with technique demonstrations, Q&A, and community connection. Open to all participants.',
      location: 'Zoom Meeting',
      status: 'upcoming',
    },
  ];

  const milestones = [
    { date: 'April 2026', title: 'Challenge Launches', completed: false },
    { date: 'May 2026', title: '100 Dojos Goal', completed: false },
    { date: 'July 2026', title: 'Level 2 Begins', completed: false },
    { date: 'Dec 2026', title: 'Year 1 Celebration', completed: false },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Calendar className="text-red-600" size={36} />
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Upcoming Events
          </h2>
        </div>
        <p className="text-lg text-slate-600">
          Mark your calendar and join us for these important milestones
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 space-y-6">
          {events.map((event, index) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 border-red-600"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-gradient-to-br from-red-600 to-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">
                          {event.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <Calendar size={14} className="text-red-600" />
                          <span>{event.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold uppercase">
                    {event.status}
                  </div>
                </div>

                <p className="text-slate-700 mb-4 leading-relaxed">
                  {event.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Clock size={16} className="text-blue-600" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <MapPin size={16} className="text-green-600" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                  <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-sm flex items-center space-x-2">
                    <Bell size={16} />
                    <span>Set Reminder</span>
                  </button>
                  {event.participants && (
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Users size={16} className="text-slate-400" />
                      <span>{event.participants} interested</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <Calendar size={24} />
              <span>Challenge Timeline</span>
            </h3>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`mt-1 ${milestone.completed ? 'text-green-300' : 'text-white/60'}`}>
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{milestone.title}</p>
                    <p className="text-sm text-blue-200">{milestone.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg p-6 border-2 border-red-200">
            <h3 className="text-xl font-bold mb-3 text-slate-900 flex items-center space-x-2">
              <Bell size={24} className="text-red-600" />
              <span>Stay Updated</span>
            </h3>
            <p className="text-slate-700 text-sm mb-4 leading-relaxed">
              Never miss an important date! Subscribe to receive email reminders for all upcoming events and milestones.
            </p>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-sm">
              Subscribe to Calendar
            </button>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-lg p-6 border-2 border-yellow-200">
            <h3 className="text-lg font-bold mb-3 text-slate-900">Quick Facts</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start space-x-2">
                <span className="text-yellow-600 font-bold">•</span>
                <span>All events are free to attend</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow-600 font-bold">•</span>
                <span>Virtual events open to global participants</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow-600 font-bold">•</span>
                <span>No registration required for most events</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow-600 font-bold">•</span>
                <span>Event recordings available afterward</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 text-white text-center shadow-2xl">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">
          Ready for the Launch?
        </h3>
        <p className="text-lg text-slate-300 mb-6 max-w-2xl mx-auto">
          Prepare your dojo for the April 28, 2026 launch. Start practicing the three techniques and gathering your team!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105">
            View Preparation Guide
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105">
            Download Calendar File
          </button>
        </div>
      </div>
    </div>
  );
}
