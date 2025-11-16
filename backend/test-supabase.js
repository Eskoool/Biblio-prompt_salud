import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://erlfovrvvhdadvepokdh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVybGZvdnJ2dmhkYWR2ZXBva2RoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMxNDkyMCwiZXhwIjoyMDc4ODkwOTIwfQ.GbLwVm1IbjRNIiQTdVcQnUn9W9ocm__NHVGLzJcgTjI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Probando conexión a Supabase...');

  // Test simple query
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .limit(1);

  if (error) {
    console.log('❌ Error:', error.message);
    console.log('💡 Probablemente necesitas ejecutar el schema SQL primero');
    return false;
  }

  console.log('✅ Conexión exitosa!');
  console.log('📊 Datos actuales:', data);
  return true;
}

testConnection();
