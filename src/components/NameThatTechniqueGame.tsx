import { useState } from 'react';
import { Trophy, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

interface Technique {
  name: string;
  romanji: string;
  translation: string;
  videoUrl?: string;
  imageUrl?: string;
  description: string;
}

const techniques: Technique[] = [
  {
    name: 'O Soto Gari',
    romanji: 'おおそとがり',
    translation: 'Major Outer Reap',
    description: 'A throwing technique where you reap your opponent\'s leg from the outside while maintaining upper body control.'
  },
  {
    name: 'Tai Otoshi',
    romanji: 'たいおとし',
    translation: 'Body Drop',
    description: 'A hand throwing technique where you drop your body and use your leg as a blocking point to throw your opponent forward.'
  },
  {
    name: 'Ko Uchi Gari',
    romanji: 'こうちがり',
    translation: 'Minor Inner Reap',
    description: 'A foot sweeping technique that reaps the opponent\'s leg from the inside while controlling their upper body.'
  },
  {
    name: 'Seoi Nage',
    romanji: 'せおいなげ',
    translation: 'Shoulder Throw',
    description: 'A shoulder throw where you load your opponent onto your back and throw them over your shoulder.'
  },
  {
    name: 'Uchi Mata',
    romanji: 'うちまた',
    translation: 'Inner Thigh Throw',
    description: 'A throwing technique where you lift and throw your opponent by driving your leg into their inner thigh.'
  },
  {
    name: 'Harai Goshi',
    romanji: 'はらいごし',
    translation: 'Sweeping Hip Throw',
    description: 'A hip throw combined with a sweeping action of your leg against your opponent\'s leg.'
  },
  {
    name: 'O Uchi Gari',
    romanji: 'おおうちがり',
    translation: 'Major Inner Reap',
    description: 'A reaping throw where you reap your opponent\'s leg from the inside while maintaining upper body control.'
  },
  {
    name: 'Ko Soto Gari',
    romanji: 'こそとがり',
    translation: 'Minor Outer Reap',
    description: 'A reaping technique where you reap your opponent\'s heel from the outside.'
  },
  {
    name: 'Tomoe Nage',
    romanji: 'ともえなげ',
    translation: 'Circle Throw',
    description: 'A sacrifice throw where you fall backwards and throw your opponent over you using your foot in their abdomen.'
  },
  {
    name: 'Uki Goshi',
    romanji: 'うきごし',
    translation: 'Floating Hip',
    description: 'A hip throw where you lift your opponent onto your hip and throw them.'
  }
];

export default function NameThatTechniqueGame() {
  const [currentTechnique, setCurrentTechnique] = useState<Technique | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const generateQuestion = () => {
    setFeedback(null);
    setSelectedAnswer(null);

    const randomTechnique = techniques[Math.floor(Math.random() * techniques.length)];
    setCurrentTechnique(randomTechnique);

    const wrongAnswers = techniques
      .filter(t => t.name !== randomTechnique.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(t => t.name);

    const allOptions = [randomTechnique.name, ...wrongAnswers].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  };

  const handleAnswer = (answer: string) => {
    if (feedback !== null) return;

    setSelectedAnswer(answer);
    setTotalQuestions(prev => prev + 1);

    if (answer === currentTechnique?.name) {
      setFeedback('correct');
      setScore(prev => prev + 1);
    } else {
      setFeedback('incorrect');
    }
  };

  const nextQuestion = () => {
    generateQuestion();
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTotalQuestions(0);
    generateQuestion();
  };

  const resetGame = () => {
    setGameStarted(false);
    setScore(0);
    setTotalQuestions(0);
    setFeedback(null);
    setSelectedAnswer(null);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Name That Technique!
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Test your Judo knowledge! Read the description and choose the correct technique name.
              Perfect for students learning the fundamentals or advanced practitioners brushing up on their terminology.
            </p>

            <div className="bg-blue-50 rounded-lg p-6 mb-8 border-2 border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">How to Play:</h3>
              <ul className="text-left text-gray-700 space-y-2 max-w-md mx-auto">
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">1.</span>
                  Read the technique description carefully
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">2.</span>
                  Choose the correct technique name from four options
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">3.</span>
                  Get instant feedback and learn as you go
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">4.</span>
                  Challenge yourself to improve your score
                </li>
              </ul>
            </div>

            <button
              onClick={startGame}
              className="bg-red-600 hover:bg-red-700 text-white text-xl font-bold px-12 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-blue-600 p-6">
            <div className="flex justify-between items-center text-white">
              <div className="text-center">
                <div className="text-3xl font-bold">{score}</div>
                <div className="text-sm opacity-90">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{totalQuestions}</div>
                <div className="text-sm opacity-90">Total</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%
                </div>
                <div className="text-sm opacity-90">Accuracy</div>
              </div>
            </div>
          </div>

          {currentTechnique && (
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  What technique is this?
                </h2>
                <div className="bg-slate-50 rounded-lg p-6 border-2 border-slate-200">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {currentTechnique.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {options.map((option, index) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === currentTechnique.name;
                  const showResult = feedback !== null;

                  let buttonClass = 'bg-white border-2 border-gray-300 hover:border-blue-500 text-gray-900';

                  if (showResult) {
                    if (isCorrect) {
                      buttonClass = 'bg-green-100 border-2 border-green-500 text-green-900';
                    } else if (isSelected && !isCorrect) {
                      buttonClass = 'bg-red-100 border-2 border-red-500 text-red-900';
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      disabled={feedback !== null}
                      className={`${buttonClass} p-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 relative`}
                    >
                      <span>{option}</span>
                      {showResult && isCorrect && (
                        <CheckCircle className="inline-block ml-2 text-green-600" size={24} />
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <XCircle className="inline-block ml-2 text-red-600" size={24} />
                      )}
                    </button>
                  );
                })}
              </div>

              {feedback && (
                <div className={`rounded-lg p-6 mb-6 ${
                  feedback === 'correct'
                    ? 'bg-green-50 border-2 border-green-500'
                    : 'bg-red-50 border-2 border-red-500'
                }`}>
                  <div className="flex items-start space-x-3">
                    {feedback === 'correct' ? (
                      <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
                    ) : (
                      <XCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
                    )}
                    <div className="flex-grow">
                      <h3 className={`font-bold text-xl mb-2 ${
                        feedback === 'correct' ? 'text-green-900' : 'text-red-900'
                      }`}>
                        {feedback === 'correct' ? 'Correct!' : 'Incorrect'}
                      </h3>
                      <p className="text-gray-700 mb-2">
                        <span className="font-bold">{currentTechnique.name}</span> ({currentTechnique.romanji})
                      </p>
                      <p className="text-gray-600 italic">
                        Translation: {currentTechnique.translation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-center space-x-4">
                {feedback && (
                  <button
                    onClick={nextQuestion}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <RefreshCw size={20} />
                    <span>Next Question</span>
                  </button>
                )}
                <button
                  onClick={resetGame}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300"
                >
                  End Game
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-3 text-center">Keep Practicing!</h3>
          <p className="text-center text-slate-200">
            Learning technique names is an important part of Judo education. The more you practice,
            the better you'll become at recognizing and remembering these fundamental techniques.
          </p>
        </div>
      </div>
    </div>
  );
}
