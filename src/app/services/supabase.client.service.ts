// filepath: src/app/services/supabase-client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pdacsaorfjzlqrftlxcl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkYWNzYW9yZmp6bHFyZnRseGNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0OTMyMDEsImV4cCI6MjA2NTA2OTIwMX0.ppEyDanf_AMxb8PNVKAO50fk2UMxrCMSgNr4VxvseNk';


export const supabase = createClient(supabaseUrl, supabaseKey);