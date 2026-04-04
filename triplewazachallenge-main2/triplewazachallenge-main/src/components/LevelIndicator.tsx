import { Tv } from 'lucide-react';

interface LevelIndicatorProps {
  completedLevels: number[];
  size?: 'sm' | 'md' | 'lg';
}

export default function LevelIndicator({ completedLevels, size = 'md' }: LevelIndicatorProps) {
  const levels = [1, 2, 3, 4, 5];

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="flex items-center gap-2">
      {levels.map((level) => {
        const isCompleted = completedLevels.includes(level);
        return (
          <div
            key={level}
            className="relative flex items-center justify-center"
            title={`Level ${level}${isCompleted ? ' - Completed' : ''}`}
          >
            <div
              className={`${sizeClasses[size]} ${
                isCompleted
                  ? 'text-green-600'
                  : 'text-gray-300'
              } transition-colors`}
            >
              <Tv className="w-full h-full" strokeWidth={isCompleted ? 2.5 : 1.5} />
            </div>
            <span
              className={`absolute inset-0 flex items-center justify-center font-bold ${textSizeClasses[size]} ${
                isCompleted ? 'text-white' : 'text-gray-400'
              }`}
            >
              {level}
            </span>
          </div>
        );
      })}
    </div>
  );
}
