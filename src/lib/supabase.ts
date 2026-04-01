import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Dojo {
  id: string;
  name: string;
  city: string;
  province_state: string;
  country: string;
  instructor_name: string;
  instructor_rank: string | null;
  email: string;
  phone: string | null;
  student_count: number | null;
  website: string | null;
  created_at: string;
}

export interface Submission {
  id: string;
  dojo_id: string;
  youtube_url: string;
  level: number;
  participant_names: string | null;
  message: string | null;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  approved_at: string | null;
  admin_notes: string | null;
}

export interface DojoWithSubmissions extends Dojo {
  submissions: Submission[];
}
