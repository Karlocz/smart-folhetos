import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ongdxywgxszpxopxqfyq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uZ2R4eXdneHN6cHhvcHhxZnlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NzQ5OTYsImV4cCI6MjA2MTM1MDk5Nn0.Z3utIhlvB4lbb3GghbwDiLno8EEmLqcthVhxiguI70c';

export const supabase = createClient(supabaseUrl, supabaseKey);
