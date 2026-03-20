import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mhjdzgzyqlvdubmxqvio.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oamR6Z3p5cWx2ZHVibXhxdmlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMDUwNTQsImV4cCI6MjA4MDc4MTA1NH0.V_8FyZ_L3blv_sYNudvQsmrAm8S4ccUMNyJoMAZ-J8w';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdmin() {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'durrantkeith@gmail.com',
      password: 'Fudoshin###0131',
      options: {
        emailRedirectTo: undefined,
      }
    });

    if (error) {
      console.error('Error creating user:', error.message);
      return;
    }

    console.log('Admin user created successfully!');
    console.log('Email:', 'durrantkeith@gmail.com');
    console.log('User ID:', data.user?.id);
    console.log('\nYou can now login with these credentials.');
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

createAdmin();
