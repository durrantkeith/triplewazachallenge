export default function FeaturedDojos() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-osp-dark via-osp-navy to-osp-dark text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-osp-blue/10 to-osp-light-blue/10"></div>
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text">
            Featured Dojos
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 mb-4">
            Celebrating dojos from around the world who are enjoying a simple drill as a group.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <h2 className="text-3xl font-semibold text-slate-800 mb-6">
            Featured Dojos Coming Soon
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            We're celebrating dojos from around the world who enjoy this simple 5-minute group drill! Nominate your dojo to be featured on our Featured Dojos page — then check back soon to see if you made the list!
          </p>
        </div>
      </div>
    </div>
  );
}
