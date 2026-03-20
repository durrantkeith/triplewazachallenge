/*
  # Add Keith Durrant as First Founder

  1. Data
    - Insert Keith Durrant with his credentials:
      - Name: Keith Durrant
      - Title: Kodokan 7th Dan
      - Location: Vancouver, Canada
      - Bio: Creator. Sustainable Judo education through enjoyable and attainable goals. All Japan Judo Federation, Kodokan 7th Dan
      - Contribution: Creator
      - Order: 0 (first position)

  2. Note
    - Photo URL should be updated via admin dashboard after upload
*/

INSERT INTO founders (
  name,
  title,
  country,
  city,
  bio,
  contribution_type,
  order_index,
  photo_url
) VALUES (
  'Keith Durrant',
  'Kodokan 7th Dan',
  'Canada',
  'Vancouver',
  'Creator. Sustainable Judo education through enjoyable and attainable goals. All Japan Judo Federation (全日本柔道連盟), Kodokan 7th Dan (講道館七段).',
  'Creator',
  0,
  ''
) ON CONFLICT DO NOTHING;