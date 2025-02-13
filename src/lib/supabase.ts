import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hquudroimsefgtfhptxf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxdXVkcm9pbXNlZmd0ZmhwdHhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0NDU3ODAsImV4cCI6MjA1NTAyMTc4MH0.UO75FyD9GUREVOPB_HcAPcD84x0jroMTmAE1XgHPsFU';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
    console.error('Supabase error:', error);
    throw new Error(error.message || 'An error occurred while connecting to the database');
}; 