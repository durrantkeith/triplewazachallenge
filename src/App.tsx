import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { supabase } from './lib/supabase';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import ChallengePage from './components/ChallengePage';
import KataCollectionsPage from './components/KataCollectionsPage';
import KataDetailPage from './components/KataDetailPage';
import EducationPage from './components/EducationPage';
import OurJourneyPage from './components/OurJourneyPage';
import HallOfFame from './components/HallOfFame';
import FeaturedDojos from './components/FeaturedDojos';
import TripleWazaDrill from './components/TripleWazaDrill';
import VideoSubmissionPage from './components/VideoSubmissionPage';
import VideoThankYouPage from './components/VideoThankYouPage';
import AdminDashboard from './components/AdminDashboard';
import ChallengeAFriend from './components/ChallengeAFriend';
import ThankYouPage from './components/ThankYouPage';
import FoundersPage from './components/FoundersPage';
import LevelsPage from './components/LevelsPage';
import SafetyGuidelines from './components/SafetyGuidelines';
import SplashScreen from './components/SplashScreen';
import Footer from './components/Footer';
import { FAQ } from './components/FAQ';
import LibraryHomePage from './components/LibraryHomePage';
import NameThatTechniqueGame from './components/NameThatTechniqueGame';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState<Record<string, string>>({});
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicReady, setMusicReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    const initializeMusic = async () => {
      try {
        const { data } = await supabase
          .from('music_settings')
          .select('*')
          .maybeSingle();

        let musicUrl = null;

        if (data) {
          if (data.music_file_path) {
            const { data: signedUrlData } = await supabase.storage
              .from('background_music')
              .createSignedUrl(data.music_file_path, 3600);

            if (signedUrlData?.signedUrl) {
              musicUrl = signedUrlData.signedUrl;
            }
          } else if (data.custom_track_1_url) {
            musicUrl = data.custom_track_1_url;
          }
        }

        if (musicUrl) {
          console.log('Loading music from:', musicUrl);
          const audio = new Audio(musicUrl);
          audio.loop = true;
          audio.volume = 0.3;
          audio.preload = 'auto';

          const handleCanPlay = () => {
            console.log('Audio can play - ready');
            setMusicReady(true);
          };

          const handleError = (e: Event) => {
            console.error('Audio loading error:', e);
            console.error('Failed to load audio from:', musicUrl);
          };

          const handlePlay = () => {
            console.log('Music playing - setting state to true');
            setIsMusicPlaying(true);
          };

          const handlePause = () => {
            console.log('Music paused - setting state to false');
            setIsMusicPlaying(false);
          };

          const handleEnded = () => {
            console.log('Music ended');
            setIsMusicPlaying(false);
          };

          audio.addEventListener('canplay', handleCanPlay);
          audio.addEventListener('error', handleError);
          audio.addEventListener('play', handlePlay);
          audio.addEventListener('pause', handlePause);
          audio.addEventListener('ended', handleEnded);

          audioRef.current = audio;

          return () => {
            audio.removeEventListener('canplay', handleCanPlay);
            audio.removeEventListener('error', handleError);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
          };
        } else {
          console.log('No music URL found in database');
        }
      } catch (error) {
        console.error('Error loading music settings:', error);
      }
    };

    initializeMusic();
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) {
      console.log('No audio ref available');
      return;
    }

    const audio = audioRef.current;
    console.log('Toggle music - currently paused?', audio.paused);

    if (audio.paused) {
      console.log('Attempting to play music...');
      audio.play().catch(err => {
        console.error('Play failed:', err);
        setIsMusicPlaying(false);
      });
    } else {
      console.log('Pausing music...');
      audio.pause();
    }
  };

  const handleNavigate = (page: string, params?: Record<string, string>) => {
    setCurrentPage(page);
    if (params) {
      setPageParams(params);
    } else {
      setPageParams({});
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'challenge':
        return <ChallengePage onNavigate={handleNavigate} />;
      case 'library-home':
        return <LibraryHomePage onNavigate={handleNavigate} />;
      case 'kata-collections':
        return <KataCollectionsPage onNavigate={handleNavigate} />;
      case 'kata-detail':
        return <KataDetailPage kataSlug={pageParams.kata || 'nage-no-kata'} onNavigate={handleNavigate} />;
      case 'education':
        return <EducationPage onNavigate={handleNavigate} />;
      case 'triple-waza-drill':
        return <TripleWazaDrill />;
      case 'name-game':
        return <NameThatTechniqueGame />;
      case 'our-journey':
        return <OurJourneyPage onNavigate={handleNavigate} />;
      case 'hall-of-fame':
        return <HallOfFame onNavigate={handleNavigate} />;
      case 'faq':
        return <FAQ />;
      case 'featured-dojos':
        return <FeaturedDojos />;
      case 'video-submit':
        return <VideoSubmissionPage onNavigate={handleNavigate} />;
      case 'video-thankyou':
        return <VideoThankYouPage onNavigate={handleNavigate} />;
      case 'challenge-friend':
        return <ChallengeAFriend onNavigate={handleNavigate} />;
      case 'safety':
        return <SafetyGuidelines />;
      case 'thankyou':
        return <ThankYouPage onNavigate={handleNavigate} />;
      case 'founders':
        return <FoundersPage />;
      case 'levels':
        return <LevelsPage onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
    if (audioRef.current) {
      console.log('Attempting to autoplay music after splash...');
      audioRef.current.play().catch(err => {
        console.log('Autoplay blocked by browser:', err);
        console.log('User will need to click the music button to start playback');
      });
    } else {
      console.log('No audio reference available');
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer onNavigate={handleNavigate} />

      {!showSplash && musicReady && (
        <button
          onClick={toggleMusic}
          className={`fixed bottom-4 left-4 ${
            isMusicPlaying ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-900 hover:bg-slate-700'
          } text-white p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-110 z-50`}
          aria-label={isMusicPlaying ? 'Pause music' : 'Play music'}
        >
          {isMusicPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      )}

      {!showSplash && (
        <div className="fixed bottom-4 right-4 flex flex-col gap-2 items-end">
          <button
            onClick={() => setCurrentPage('admin')}
            className="bg-slate-900 hover:bg-slate-700 text-slate-400 hover:text-white px-4 py-2 rounded-lg text-xs transition-all duration-300 shadow-lg opacity-30 hover:opacity-100"
          >
            Admin
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
