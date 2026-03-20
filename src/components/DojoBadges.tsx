import { getBadgesForSubmissionCount, getProgressToNextBadge } from '../utils/badges';

interface DojoBadgesProps {
  submissionCount: number;
  dojoName?: string;
  compact?: boolean;
}

export function DojoBadges({ submissionCount, dojoName, compact = false }: DojoBadgesProps) {
  const earnedBadges = getBadgesForSubmissionCount(submissionCount);
  const progress = getProgressToNextBadge(submissionCount);

  if (compact && earnedBadges.length === 0) return null;

  if (compact) {
    const highestBadge = earnedBadges[earnedBadges.length - 1];
    return (
      <div className="flex items-center gap-1">
        <span className="text-lg" title={highestBadge.description}>
          {highestBadge.icon}
        </span>
        {earnedBadges.length > 1 && (
          <span className="text-xs text-gray-500">+{earnedBadges.length - 1}</span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      {dojoName && (
        <h3 className="font-bold text-lg text-gray-900 mb-3">{dojoName}</h3>
      )}

      {earnedBadges.length > 0 ? (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2 font-semibold">Earned Badges:</p>
          <div className="flex flex-wrap gap-2">
            {earnedBadges.map(badge => (
              <div
                key={badge.id}
                className={`bg-gradient-to-br ${badge.color} text-white rounded-lg px-3 py-2 flex items-center gap-2 shadow-md hover:scale-105 transition-transform duration-200`}
                title={badge.description}
              >
                <span className="text-xl">{badge.icon}</span>
                <div>
                  <p className="font-bold text-sm">{badge.name}</p>
                  <p className="text-xs opacity-90">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-4 text-center py-4">
          <p className="text-gray-600">Submit your first video to earn badges!</p>
        </div>
      )}

      {progress && (
        <div>
          <p className="text-sm text-gray-600 mb-2 font-semibold">Next Badge:</p>
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">
                {progress.current} / {progress.target} submissions
              </span>
              <span className="text-sm text-gray-600">{progress.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="mt-3 text-center">
        <p className="text-xs text-gray-500">
          Total Submissions: <span className="font-bold text-gray-700">{submissionCount}</span>
        </p>
      </div>
    </div>
  );
}