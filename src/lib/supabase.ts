import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ybswogixbemsasmpnrse.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlic3dvZ2l4YmVtc2FzbXBucnNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg4MTY2NTksImV4cCI6MjA1NDM5MjY1OX0.w2z6X25M3bgcr9F3JzAGy4rF-O-QxmNmytCf3UpR6Us'

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);