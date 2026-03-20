interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const handleClick = () => {
    onComplete();
  };

  return (
    <div
      className="fixed inset-0 bg-[#0a0e1a] flex flex-col items-center justify-center z-50 cursor-pointer"
      onClick={handleClick}
      style={{ background: 'linear-gradient(135deg, #0a0e1a 0%, #1a2540 50%, #0a0e1a 100%)' }}
    >
      <div className="text-center px-4">
        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          Triple Waza Challenge
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-slate-200 mb-2">
          Just 3 techniques.
        </p>
        <p className="text-xl md:text-2xl text-slate-200 mb-32">
          Let's connect the Judo world!
        </p>

        {/* Click to continue */}
        <p className="text-slate-400 text-lg animate-pulse">
          Click to continue
        </p>
      </div>
    </div>
  );
}
