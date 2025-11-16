import { supabaseAdmin } from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

const setupSupabase = async () => {
  console.log('🚀 Iniciando configuración de Supabase...\n');

  try {
    // Verificar conexión
    console.log('1️⃣ Verificando conexión...');
    const { data: testData, error: testError } = await supabaseAdmin
      .from('tags')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Error de conexión. ¿Ejecutaste el schema SQL?');
      console.error('   Ve a: Supabase Dashboard → SQL Editor');
      console.error('   Ejecuta: backend/supabase-schema.sql\n');
      throw testError;
    }

    console.log('✅ Conexión exitosa\n');

    // Verificar si ya hay datos
    const { count: tagCount } = await supabaseAdmin
      .from('tags')
      .select('*', { count: 'exact', head: true });

    if (tagCount && tagCount > 0) {
      console.log('⚠️  La base de datos ya tiene datos');
      console.log(`   Tags existentes: ${tagCount}`);
      const response = await new Promise<string>((resolve) => {
        process.stdin.once('data', (data) => resolve(data.toString().trim()));
        console.log('\n¿Deseas continuar y agregar más datos? (y/n): ');
      });

      if (response.toLowerCase() !== 'y') {
        console.log('❌ Setup cancelado');
        process.exit(0);
      }
    }

    console.log('\n2️⃣ Insertando Tags...');
    const { data: tags, error: tagsError } = await supabaseAdmin
      .from('tags')
      .insert([
        {
          name: 'Cardiología',
          description: 'Prompts relacionados con cardiología',
          color: '#ef4444',
          category: 'specialty',
        },
        {
          name: 'Medicina Interna',
          description: 'Prompts para medicina interna general',
          color: '#3b82f6',
          category: 'specialty',
        },
        {
          name: 'Pediatría',
          description: 'Prompts específicos para pediatría',
          color: '#ec4899',
          category: 'specialty',
        },
        {
          name: 'Diagnóstico',
          description: 'Ayuda en diagnóstico diferencial',
          color: '#8b5cf6',
          category: 'use-case',
        },
        {
          name: 'Tratamiento',
          description: 'Recomendaciones de tratamiento',
          color: '#14b8a6',
          category: 'use-case',
        },
        {
          name: 'Investigación',
          description: 'Búsqueda de literatura científica',
          color: '#f59e0b',
          category: 'use-case',
        },
        {
          name: 'Documentación',
          description: 'Ayuda con documentación clínica',
          color: '#10b981',
          category: 'use-case',
        },
        {
          name: 'Principiante',
          description: 'Prompts fáciles de usar',
          color: '#84cc16',
          category: 'difficulty',
        },
        {
          name: 'Avanzado',
          description: 'Prompts para usuarios experimentados',
          color: '#f97316',
          category: 'difficulty',
        },
      ])
      .select();

    if (tagsError) throw tagsError;
    console.log(`✅ ${tags.length} tags insertados`);

    console.log('\n3️⃣ Insertando Plataformas IA...');
    const { data: platforms, error: platformsError } = await supabaseAdmin
      .from('ai_platforms')
      .insert([
        {
          name: 'ChatGPT',
          description: 'Modelo de lenguaje de OpenAI',
          url: 'https://chat.openai.com',
        },
        {
          name: 'Claude',
          description: 'Asistente de IA de Anthropic',
          url: 'https://claude.ai',
        },
        {
          name: 'Google Gemini',
          description: 'Modelo de IA de Google',
          url: 'https://gemini.google.com',
        },
        {
          name: 'Perplexity',
          description: 'Motor de búsqueda con IA',
          url: 'https://perplexity.ai',
        },
      ])
      .select();

    if (platformsError) throw platformsError;
    console.log(`✅ ${platforms.length} plataformas IA insertadas`);

    console.log('\n4️⃣ Insertando Prompts de ejemplo...');
    const { data: prompts, error: promptsError } = await supabaseAdmin
      .from('prompts')
      .insert([
        {
          title: 'Diagnóstico Diferencial en Dolor Torácico',
          description:
            'Ayuda a establecer un diagnóstico diferencial completo para pacientes con dolor torácico agudo.',
          content: `Actúa como un médico especialista en medicina de urgencias. Tengo un paciente con las siguientes características:

[Edad, sexo, antecedentes relevantes]
Síntomas: [Descripción del dolor torácico]
Signos vitales: [TA, FC, FR, SatO2, Temperatura]
Exploración física: [Hallazgos relevantes]

Por favor, proporciona:
1. Diagnóstico diferencial ordenado por probabilidad
2. Estudios complementarios necesarios para cada diagnóstico
3. Criterios de gravedad y necesidad de ingreso
4. Tratamiento inicial según cada posibilidad diagnóstica

Enfócate en las patologías que requieren intervención urgente.`,
          votes: 45,
          is_recommended: true,
          author: 'admin@biblioprompt.com',
        },
        {
          title: 'Interpretación de Gasometría Arterial',
          description:
            'Prompt para ayudar en la interpretación sistemática de gasometrías arteriales.',
          content: `Actúa como un médico internista experto en interpretación de gasometrías.

Datos de la gasometría arterial:
- pH: [valor]
- PaCO2: [valor] mmHg
- PaO2: [valor] mmHg
- HCO3-: [valor] mEq/L
- BE: [valor]
- SatO2: [valor] %

Por favor, realiza:
1. Evaluación del estado ácido-base (acidosis/alcalosis, metabólica/respiratoria)
2. Identificación de compensación (completa, parcial, o sin compensar)
3. Cálculo del anion gap si corresponde
4. Evaluación de la oxigenación
5. Interpretación clínica y posibles causas
6. Recomendaciones de manejo inicial`,
          votes: 38,
          is_recommended: true,
        },
        {
          title: 'Dosis Pediátricas de Medicamentos',
          description:
            'Cálculo seguro de dosis de medicamentos en pediatría según peso y edad.',
          content: `Actúa como un pediatra especializado en farmacología pediátrica.

Paciente pediátrico:
- Edad: [edad]
- Peso: [kg]
- Diagnóstico: [diagnóstico]
- Medicamento a prescribir: [nombre del medicamento]

Por favor, proporciona:
1. Dosis recomendada en mg/kg/dosis
2. Dosis total calculada para este paciente
3. Frecuencia de administración
4. Vía de administración recomendada
5. Dosis máxima permitida
6. Precauciones específicas
7. Alternativas terapéuticas si las hay

Asegúrate de verificar contraindicaciones por edad y peso.`,
          votes: 52,
          is_recommended: true,
        },
      ])
      .select();

    if (promptsError) throw promptsError;
    console.log(`✅ ${prompts.length} prompts insertados`);

    // Relacionar prompts con tags
    console.log('\n5️⃣ Relacionando prompts con tags...');
    const cardiologiaTag = tags.find((t) => t.name === 'Cardiología');
    const diagnosticoTag = tags.find((t) => t.name === 'Diagnóstico');
    const pediatriaTag = tags.find((t) => t.name === 'Pediatría');
    const tratamientoTag = tags.find((t) => t.name === 'Tratamiento');

    const promptTagRelations = [];

    if (prompts[0] && cardiologiaTag && diagnosticoTag) {
      promptTagRelations.push(
        { prompt_id: prompts[0].id, tag_id: cardiologiaTag.id },
        { prompt_id: prompts[0].id, tag_id: diagnosticoTag.id }
      );
    }

    if (prompts[2] && pediatriaTag && tratamientoTag) {
      promptTagRelations.push(
        { prompt_id: prompts[2].id, tag_id: pediatriaTag.id },
        { prompt_id: prompts[2].id, tag_id: tratamientoTag.id }
      );
    }

    const { error: relError } = await supabaseAdmin
      .from('prompt_tags')
      .insert(promptTagRelations);

    if (relError) throw relError;
    console.log(`✅ ${promptTagRelations.length} relaciones prompt-tag creadas`);

    // Relacionar prompts con plataformas
    console.log('\n6️⃣ Relacionando prompts con plataformas IA...');
    const chatGPT = platforms.find((p) => p.name === 'ChatGPT');
    const claude = platforms.find((p) => p.name === 'Claude');

    const promptPlatformRelations = [];

    if (prompts[0] && chatGPT && claude) {
      promptPlatformRelations.push(
        { prompt_id: prompts[0].id, platform_id: chatGPT.id },
        { prompt_id: prompts[0].id, platform_id: claude.id }
      );
    }

    if (prompts[1] && chatGPT && claude) {
      promptPlatformRelations.push(
        { prompt_id: prompts[1].id, platform_id: chatGPT.id },
        { prompt_id: prompts[1].id, platform_id: claude.id }
      );
    }

    if (prompts[2] && chatGPT && claude) {
      promptPlatformRelations.push(
        { prompt_id: prompts[2].id, platform_id: chatGPT.id },
        { prompt_id: prompts[2].id, platform_id: claude.id }
      );
    }

    const { error: platError } = await supabaseAdmin
      .from('prompt_platforms')
      .insert(promptPlatformRelations);

    if (platError) throw platError;
    console.log(`✅ ${promptPlatformRelations.length} relaciones prompt-plataforma creadas`);

    console.log('\n✨ ¡Setup completado exitosamente!\n');
    console.log('📊 Resumen:');
    console.log(`   - Tags: ${tags.length}`);
    console.log(`   - Plataformas IA: ${platforms.length}`);
    console.log(`   - Prompts: ${prompts.length}`);
    console.log('\n🔑 Próximos pasos:');
    console.log('   1. Crea un usuario admin en Supabase Dashboard');
    console.log('   2. Authentication → Users → Add user');
    console.log('   3. Email: admin@biblioprompt.com, Password: admin123');
    console.log('   4. Ejecuta: UPDATE user_profiles SET role = \'admin\' WHERE email = \'admin@biblioprompt.com\';');
    console.log('\n🚀 Inicia la app:');
    console.log('   Backend: npm run dev');
    console.log('   Frontend: cd ../frontend && npm run dev\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error durante el setup:', error);
    process.exit(1);
  }
};

setupSupabase();
