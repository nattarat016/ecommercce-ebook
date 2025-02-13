import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hquudroimsefgtfhptxf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxdXVkcm9pbXNlZmd0ZmhwdHhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0NDU3ODAsImV4cCI6MjA1NTAyMTc4MH0.UO75FyD9GUREVOPB_HcAPcD84x0jroMTmAE1XgHPsFU'

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);