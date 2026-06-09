import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wcctupquldbknqvsmaes.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjY3R1cHF1bGRia25xdnNtYWVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NjY5NzMsImV4cCI6MjA5NjU0Mjk3M30.f5eAdDHtxptiL95rPO2xkK3mMA-EESjXhqwJgbdE9m8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
