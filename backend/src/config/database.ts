import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

// Client for general operations (uses anon key)
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Admin client for operations that bypass RLS (uses service role key)
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

export const connectDB = async (): Promise<void> => {
  try {
    // Test connection
    const { data, error } = await supabase.from('tags').select('count');

    if (error && error.code !== 'PGRST116') { // PGRST116 = empty result is ok
      throw error;
    }

    console.log('✅ Supabase connected successfully');
    console.log(`📦 Database: ${process.env.SUPABASE_URL}`);
  } catch (error: any) {
    // Log warning but don't throw - allow server to start even if network test fails
    // Connection might work fine when actual requests come in
    console.warn('⚠️  Initial Supabase connection test failed (this may be OK in sandbox environments)');
    console.warn(`   Database URL: ${process.env.SUPABASE_URL}`);
    console.warn(`   Error: ${error?.message || error}`);
    console.log('🚀 Server will start anyway - connections will be tested on actual requests');
  }
};
