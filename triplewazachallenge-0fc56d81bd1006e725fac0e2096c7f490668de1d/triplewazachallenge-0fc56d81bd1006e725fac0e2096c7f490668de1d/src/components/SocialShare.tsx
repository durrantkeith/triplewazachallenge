import { Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
}

export function SocialShare({
  url = window.location.href,
  title = 'Triple Waza Friendship Challenge',
  description = 'Join dojos worldwide in the Triple Waza Friendship Challenge! Submit your Nage-no-kata video and earn Hall of Fame recognition.'
}: SocialShareProps) {

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + ' - ' + description)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="py-12 bg-gradient-to-r from-blue-600 to-blue-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <Share2 className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Help Spread The Word!
          </h2>
          <p className="text-xl text-blue-100">
            Share this challenge with your judo community and help grow the movement
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={shareOnFacebook}
            className="inline-flex items-center space-x-2 bg-white hover:bg-blue-50 text-blue-600 font-semibold px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            aria-label="Share on Facebook"
          >
            <Facebook className="w-5 h-5" />
            <span>Facebook</span>
          </button>

          <button
            onClick={shareOnTwitter}
            className="inline-flex items-center space-x-2 bg-white hover:bg-blue-50 text-blue-600 font-semibold px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            aria-label="Share on Twitter"
          >
            <Twitter className="w-5 h-5" />
            <span>Twitter</span>
          </button>

          <button
            onClick={shareOnLinkedIn}
            className="inline-flex items-center space-x-2 bg-white hover:bg-blue-50 text-blue-600 font-semibold px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
            <span>LinkedIn</span>
          </button>

          <button
            onClick={copyToClipboard}
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 border-2 border-white/30"
            aria-label="Copy link"
          >
            <Share2 className="w-5 h-5" />
            <span>Copy Link</span>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-blue-100 text-sm italic">
            Every share helps more dojos discover this community initiative
          </p>
        </div>
      </div>
    </div>
  );
}