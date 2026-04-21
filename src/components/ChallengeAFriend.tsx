import { useState } from 'react';
import { Mail, UserPlus, Send, Plus, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ChallengeAFriendProps {
  onNavigate: (page: string) => void;
}

export default function ChallengeAFriend({ onNavigate }: ChallengeAFriendProps) {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [recipientEmails, setRecipientEmails] = useState(['']);
  const [message, setMessage] = useState(
    `Subject: Your Dojo is Invited: Triple Waza Friendship Challenge

Greetings from the Triple Waza Friendship Challenge!

We invite your dojo to join a growing global movement of judo practitioners preserving traditional kata through simple, attainable goals. This is a grassroots initiative—no organizations, no fees, just fun!

The Triple Waza Friendship Challenge is a 5-minute group drill featuring the first three techniques of Nage-no-Kata:
• Uki Otoshi
• Seoi Nage
• Kata Guruma

Why participate?
✓ Practice traditional judo kata together as a group
✓ Add your dojo to a living global archive
✓ Connect with dojos worldwide
✓ Preserve judo history for future generations
✓ Have fun with attainable goals!

Ready to join? Visit triplewazachallenge.com to:
• Watch demonstration videos
• Learn the techniques
• Submit your dojo's video
• See the growing global community

We challenge your dojo to participate—and then challenge 2 more dojos to join the movement!

Let's preserve traditional Judo together, 3 techniques at a time.

For full details and resources, visit: triplewazachallenge.com`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const addEmailField = () => {
    setRecipientEmails([...recipientEmails, '']);
  };

  const removeEmailField = (index: number) => {
    const newEmails = recipientEmails.filter((_, i) => i !== index);
    setRecipientEmails(newEmails.length > 0 ? newEmails : ['']);
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...recipientEmails];
    newEmails[index] = value;
    setRecipientEmails(newEmails);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!senderName.trim()) {
      setError('Please enter your name');
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
    const validEmails = recipientEmails.filter(email => email.trim() && emailRegex.test(email.trim()));

    if (validEmails.length === 0) {
      setError('Please enter at least one valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      const referrals = validEmails.map(email => ({
        sender_name: senderName.trim(),
        sender_email: senderEmail.trim(),
        recipient_email: email.trim(),
        message: message.trim(),
      }));

      const { error: insertError } = await supabase
        .from('friend_referrals')
        .insert(referrals);

      if (insertError) throw insertError;

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-challenge-emails`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const emailPromises = validEmails.map(email =>
        fetch(apiUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            sender_name: senderName.trim(),
            sender_email: senderEmail.trim(),
            recipient_email: email.trim(),
            message: message.trim(),
          }),
        })
      );

      await Promise.all(emailPromises);

      onNavigate('thankyou');
    } catch (err) {
      setError('Failed to send invitations. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-800 to-blue-900">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="mb-12">
          <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-2xl p-12 border-2 border-yellow-500/50 shadow-2xl">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <UserPlus size={56} className="text-yellow-400 mr-3" />
                <h1 className="text-5xl md:text-6xl font-bold text-yellow-400">Challenge other Dojos!</h1>
              </div>
              <p className="text-2xl text-yellow-400 font-semibold mb-8">
                Reintroducing traditional Judo through attainable goals.
              </p>
            </div>

            <div className="space-y-6 max-w-3xl mx-auto text-white">
              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-600">
                <p className="text-lg leading-relaxed">
                  <span className="text-yellow-400 font-bold">Everyone is included.</span> Practice together, share your video, and add your dojo to a living archive of Judo communities worldwide united by a simple, attainable challenge.
                </p>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-600">
                <p className="text-lg leading-relaxed">
                  <span className="text-yellow-400 font-bold">Challenge your Judo friends!</span> We encourage each dojo to challenge 2 more dojos and continue to make one submission from their own dojo every six months. Let's preserve traditional Judo 3 techniques at a time — and have fun doing it!
                </p>
              </div>

              <div className="text-center pt-4">
                <p className="text-xl text-yellow-300 font-medium">
                  Take your place in Judo history and invite your Judo friends to join you!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">

            <h2 className="text-3xl font-bold text-slate-900 mb-8">Challenge other Dojos!</h2>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-base font-semibold text-slate-800 mb-2">
                  Your Name or Dojo Name <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-slate-600 mb-3">This will appear as "Introduced by [Your Name/Dojo]"</p>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your name or dojo name"
                  required
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-slate-800 mb-2">
                  Your Email <span className="text-slate-500">(Optional)</span>
                </label>
                <p className="text-sm text-slate-600 mb-3">Must be different from the dojo email addresses below</p>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-slate-800 mb-3">
                  Dojo Email Address(es) <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {recipientEmails.map((email, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Mail className="text-slate-400 flex-shrink-0" size={20} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => updateEmail(index, e.target.value)}
                        className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="dojo@email.com"
                        required
                      />
                      {recipientEmails.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEmailField(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Remove email field"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addEmailField}
                  className="mt-3 flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  <Plus size={20} />
                  <span>Add another email</span>
                </button>
              </div>

              <div>
                <label className="block text-base font-semibold text-slate-800 mb-3">
                  Email Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none font-serif"
                  rows={10}
                  placeholder="Subject: Your Dojo is Invited: Triple Waza Friendship Challenge

Greetings from the Triple Waza Friendship Challenge!
We invite your dojo to join a growing global movement of judo practitioners preserving traditional kata..."
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Send size={22} />
                  <span className="text-lg">{isSubmitting ? 'Sending Challenge...' : 'Send Challenge'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
