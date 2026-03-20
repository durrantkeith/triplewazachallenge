import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Check } from 'lucide-react';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [dojoName, setDojoName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const { error: submitError } = await supabase
        .from('newsletter_signups')
        .insert({
          email: email.trim().toLowerCase(),
          dojo_name: dojoName.trim() || null
        });

      if (submitError) {
        if (submitError.code === '23505') {
          setError('This email is already subscribed!');
        } else {
          throw submitError;
        }
      } else {
        setIsSuccess(true);
        setEmail('');
        setDojoName('');
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch (err) {
      console.error('Error subscribing:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="py-16 bg-gradient-to-r from-orange-600 to-red-600 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            Not ready to submit yet? Subscribe to get updates about the movement, success stories, and reminders!
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-green-500 text-white rounded-lg p-8 text-center shadow-xl transform scale-105 transition-transform duration-200">
            <Check className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">You're Subscribed!</h3>
            <p className="text-green-100">
              Thank you for your interest. We'll keep you updated on the movement!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="newsletter-email" className="block text-sm font-semibold mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="newsletter-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  placeholder="sensei@dojo.com"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="newsletter-dojo" className="block text-sm font-semibold mb-2">
                  Dojo Name (Optional)
                </label>
                <input
                  type="text"
                  id="newsletter-dojo"
                  value={dojoName}
                  onChange={(e) => setDojoName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  placeholder="Your Dojo Name"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-red-500 text-white px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-orange-600 font-bold py-4 px-8 rounded-lg hover:bg-orange-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg text-lg"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe for Updates'}
            </button>

            <p className="text-xs text-orange-100 mt-4 text-center">
              We respect your privacy. Unsubscribe anytime. No spam, just judo love!
            </p>
          </form>
        )}
      </div>
    </div>
  );
}