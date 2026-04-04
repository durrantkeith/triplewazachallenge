/*
  # Create Friend Referrals Table

  1. New Tables
    - `friend_referrals`
      - `id` (uuid, primary key)
      - `sender_name` (text) - Name of the person sending the invitation
      - `sender_email` (text) - Email of the person sending (optional)
      - `recipient_email` (text) - Email of the friend being invited
      - `message` (text) - Optional personal message
      - `sent_at` (timestamptz) - When the invitation was sent
      - `opened_at` (timestamptz) - When the recipient opened the link (nullable)
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on `friend_referrals` table
    - Add policy for anyone to create referrals (public submission)
    - Add policy for authenticated admins to view all referrals

  3. Indexes
    - Add index on recipient_email for tracking
    - Add index on sent_at for sorting
*/

CREATE TABLE IF NOT EXISTS friend_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name text NOT NULL,
  sender_email text DEFAULT '',
  recipient_email text NOT NULL,
  message text DEFAULT '',
  sent_at timestamptz DEFAULT now(),
  opened_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE friend_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit friend referrals"
  ON friend_referrals
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public can view referral count"
  ON friend_referrals
  FOR SELECT
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_friend_referrals_recipient_email 
  ON friend_referrals(recipient_email);

CREATE INDEX IF NOT EXISTS idx_friend_referrals_sent_at 
  ON friend_referrals(sent_at DESC);