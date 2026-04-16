export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  requiredSubmissions: number;
  color: string;
}

export const badges: Badge[] = [
  {
    id: 'first_step',
    name: 'First Step',
    icon: '🥋',
    description: 'Submitted your first video!',
    requiredSubmissions: 1,
    color: 'from-green-400 to-green-500'
  },
  {
    id: 'committed',
    name: 'Committed',
    icon: '⭐',
    description: '5 submissions - You\'re committed!',
    requiredSubmissions: 5,
    color: 'from-blue-400 to-blue-500'
  },
  {
    id: 'dedicated',
    name: 'Dedicated',
    icon: '🔥',
    description: '10 submissions - Dedication on display!',
    requiredSubmissions: 10,
    color: 'from-orange-400 to-orange-500'
  },
  {
    id: 'champion',
    name: 'Champion',
    icon: '🏆',
    description: '20 submissions - A true champion!',
    requiredSubmissions: 20,
    color: 'from-yellow-400 to-yellow-500'
  },
  {
    id: 'legend',
    name: 'Legend',
    icon: '👑',
    description: '50 submissions - Legendary status!',
    requiredSubmissions: 50,
    color: 'from-purple-400 to-purple-500'
  },
  {
    id: 'master',
    name: 'Master',
    icon: '💎',
    description: '100 submissions - Master of the movement!',
    requiredSubmissions: 100,
    color: 'from-cyan-400 to-cyan-500'
  }
];

export function getBadgesForSubmissionCount(count: number): Badge[] {
  return badges.filter(badge => count >= badge.requiredSubmissions);
}

export function getNextBadge(count: number): Badge | null {
  const nextBadge = badges.find(badge => count < badge.requiredSubmissions);
  return nextBadge || null;
}

export function getProgressToNextBadge(count: number): { current: number; target: number; percentage: number } | null {
  const nextBadge = getNextBadge(count);
  if (!nextBadge) return null;

  const previousBadge = badges
    .filter(b => b.requiredSubmissions < nextBadge.requiredSubmissions)
    .sort((a, b) => b.requiredSubmissions - a.requiredSubmissions)[0];

  const start = previousBadge?.requiredSubmissions || 0;
  const target = nextBadge.requiredSubmissions;
  const progress = count - start;
  const range = target - start;
  const percentage = Math.min(100, Math.round((progress / range) * 100));

  return {
    current: count,
    target,
    percentage
  };
}