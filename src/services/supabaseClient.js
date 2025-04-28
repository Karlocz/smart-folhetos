// src/services/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// Substitua o URL e a chave abaixo pelos valores do seu projeto Supabase
const supabaseUrl = 'https://ongdxywgxszpxopxqfyq.supabase.co'; // Endereço do seu Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uZ2R4eXdneHN6cHhvcHhxZnlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NzQ5OTYsImV4cCI6MjA2MTM1MDk5Nn0.Z3utIhlvB4lbb3GghbwDiLno8EEmLqcthVhxiguI70c'; // Sua chave de API

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
