export default function TripleWazaDrill() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-base text-slate-600 mb-6">
              Better understanding through attainable goals.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-12 mb-8">
            <h1 className="text-3xl md:text-4xl font-serif text-slate-900 text-center mb-2">
              The Triple Waza Challenge is designed
            </h1>
            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 text-center">
              to be a simple and fun drill for your entire dojo!
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-red-600 mb-3">1</div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Line Up</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed text-left">
                Get everyone in your dojo involved, regardless of rank, age or experience
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-red-600 mb-3">2</div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Opening Bow</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed text-left">
                Begin with a standing bow, heels together, and step in as a group
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-red-600 mb-3">3</div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Perform</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed text-left">
                Perform the 3 techniques simultaneously at half speed as a group. Use a gentle forward breakfall for Uki Otoshi. For Seoi Nage and Kata Guruma, only lifting without throwing is permitted.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-red-600 mb-3">4</div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Closing Bow</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed text-left">
                Return to your starting position, step back right foot then left so heels come together, and conclude with a standing bow.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-red-600 mb-3">5</div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Submit</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed text-left">
                Film and share with the global community
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
