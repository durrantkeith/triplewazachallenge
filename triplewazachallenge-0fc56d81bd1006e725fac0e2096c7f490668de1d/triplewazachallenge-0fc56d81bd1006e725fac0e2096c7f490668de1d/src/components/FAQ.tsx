import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Do I need professional video equipment?',
    answer: 'No! Any smartphone, tablet, or basic camera works perfectly. We want authentic moments, not Hollywood productions. Just make sure the lighting is decent and you can see the students performing the techniques.'
  },
  {
    question: 'What if my students aren\'t perfect at the techniques?',
    answer: 'That\'s completely fine! This movement is about participation, effort, and fun - not perfection. We want to see real students, real dojos, and real judo. Imperfection is part of the journey!'
  },
  {
    question: 'How long should the video be?',
    answer: 'Keep it short and sweet! 1-3 minutes is perfect. Show your students performing the three techniques (O Soto Gari, Tai Otoshi, Ko Uchi Gari). You can show multiple students or just focus on a few - whatever works for your dojo.'
  },
  {
    question: 'Do we have to participate every Friday?',
    answer: 'No pressure! Participate as often as you can. Some dojos submit weekly, others monthly. The goal is to make it fun and sustainable for your dojo, not create another obligation. Join when it works for you!'
  },
  {
    question: 'What do we get out of this?',
    answer: 'You get featured in our Hall of Fame, earn achievement badges, connect with a global judo community, and most importantly - you bring fresh energy and excitement to your Friday classes! Students love seeing themselves online and being part of something bigger.'
  },
  {
    question: 'Is there a cost to participate?',
    answer: 'Absolutely FREE! This is a grassroots movement to bring the judo community together. No hidden fees, no subscriptions - just pure judo fun.'
  },
  {
    question: 'Can beginners participate?',
    answer: 'YES! All skill levels are welcome. Whether your students are learning breakfalls or competing internationally, they can participate. This is about showing up, not showing off.'
  },
  {
    question: 'What if we don\'t practice on Fridays?',
    answer: 'No problem! Film whenever you do Triple Waza and submit it as your "Friday" video. The spirit of the movement is what matters, not the exact day you record.'
  },
  {
    question: 'Do we get points towards a promotion for doing this?',
    answer: 'Absolutely not! This is about doing something fun, with your entire dojo as a group.'
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggleQuestion(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <div className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Got questions? We've got answers!
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-100 transition-colors duration-200"
              >
                <span className="font-bold text-lg text-gray-900 pr-4">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-6 h-6 text-red-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border-2 border-green-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
            Still Have Questions?
          </h3>
          <p className="text-gray-700 text-center text-lg">
            The best way to understand the movement is to jump in and try it!
            Your first submission is the hardest - after that, it becomes part of your dojo's Friday tradition.
          </p>
        </div>
      </div>
    </div>
  );
}