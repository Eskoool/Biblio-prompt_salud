import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import Tag from '../models/Tag';
import AIPlatform from '../models/AIPlatform';
import Prompt from '../models/Prompt';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/biblio-prompt-salud';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Tag.deleteMany({});
    await AIPlatform.deleteMany({});
    await Prompt.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      email: 'admin@biblioprompt.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'admin',
    });
    console.log('👤 Admin user created');

    // Create tags
    const tags = await Tag.create([
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
    ]);
    console.log('🏷️  Tags created');

    // Create AI platforms
    const platforms = await AIPlatform.create([
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
    ]);
    console.log('🤖 AI Platforms created');

    // Create prompts
    const prompts = await Prompt.create([
      {
        title: 'Diagnóstico Diferencial en Dolor Torácico',
        description: 'Ayuda a establecer un diagnóstico diferencial completo para pacientes con dolor torácico agudo.',
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
        tags: [tags[0]._id, tags[3]._id, tags[7]._id], // Cardiología, Diagnóstico, Principiante
        aiPlatforms: [platforms[0]._id, platforms[1]._id], // ChatGPT, Claude
        votes: 45,
        isRecommended: true,
        author: 'admin@biblioprompt.com',
      },
      {
        title: 'Interpretación de Gasometría Arterial',
        description: 'Prompt para ayudar en la interpretación sistemática de gasometrías arteriales.',
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
        tags: [tags[1]._id, tags[3]._id, tags[8]._id], // Medicina Interna, Diagnóstico, Avanzado
        aiPlatforms: [platforms[0]._id, platforms[1]._id],
        votes: 38,
        isRecommended: true,
        author: 'admin@biblioprompt.com',
      },
      {
        title: 'Dosis Pediátricas de Medicamentos',
        description: 'Cálculo seguro de dosis de medicamentos en pediatría según peso y edad.',
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
        tags: [tags[2]._id, tags[4]._id, tags[7]._id], // Pediatría, Tratamiento, Principiante
        aiPlatforms: [platforms[0]._id, platforms[1]._id, platforms[2]._id],
        votes: 52,
        isRecommended: true,
        author: 'admin@biblioprompt.com',
      },
      {
        title: 'Búsqueda de Literatura Científica Actualizada',
        description: 'Prompt para encontrar y resumir evidencia científica reciente sobre un tema específico.',
        content: `Actúa como un investigador médico especializado en revisión bibliográfica.

Tema de investigación: [tema específico]
Enfoque clínico: [pregunta PICO si aplica]

Por favor:
1. Busca y resume los estudios más relevantes de los últimos 5 años
2. Incluye ensayos clínicos, metaanálisis y revisiones sistemáticas
3. Proporciona el nivel de evidencia de cada estudio
4. Resume las conclusiones principales
5. Identifica controversias o áreas de debate
6. Sugiere implicaciones para la práctica clínica
7. Proporciona las referencias en formato Vancouver

Prioriza evidencia de alta calidad (Cochrane, NEJM, Lancet, JAMA, BMJ).`,
        tags: [tags[5]._id, tags[8]._id], // Investigación, Avanzado
        aiPlatforms: [platforms[3]._id, platforms[1]._id], // Perplexity, Claude
        votes: 29,
        isRecommended: false,
        author: 'admin@biblioprompt.com',
      },
      {
        title: 'Redacción de Historia Clínica Estructurada',
        description: 'Ayuda a organizar y redactar historias clínicas de forma profesional y completa.',
        content: `Actúa como un médico experto en documentación clínica.

Ayúdame a estructurar una historia clínica con la siguiente información:

Datos del paciente: [edad, sexo, procedencia]
Motivo de consulta: [síntoma principal]
Enfermedad actual: [evolución de los síntomas]
Antecedentes: [personales, familiares, medicación]
Exploración física: [hallazgos]
Pruebas complementarias: [resultados]

Organiza la información en formato SOAP (Subjetivo, Objetivo, Análisis, Plan):
1. Subjetivo: Síntomas y narrativa del paciente
2. Objetivo: Hallazgos de exploración y pruebas
3. Análisis: Diagnóstico o impresión diagnóstica
4. Plan: Tratamiento, seguimiento y educación al paciente

Usa lenguaje médico profesional pero claro.`,
        tags: [tags[6]._id, tags[7]._id], // Documentación, Principiante
        aiPlatforms: [platforms[0]._id, platforms[1]._id],
        votes: 34,
        isRecommended: false,
        author: 'admin@biblioprompt.com',
      },
      {
        title: 'Manejo de Crisis Hipertensiva',
        description: 'Protocolo de actuación ante urgencia hipertensiva y emergencia hipertensiva.',
        content: `Actúa como un médico de urgencias especializado en patología cardiovascular.

Paciente con:
- TA: [valor sistólica/diastólica] mmHg
- Síntomas asociados: [cefalea, visión borrosa, dolor torácico, disnea, etc.]
- Antecedentes cardiovasculares: [HTA conocida, tratamiento actual]
- Exploración de órganos diana: [fondo de ojo, cardiovascular, neurológico]

Determina:
1. ¿Es urgencia o emergencia hipertensiva? Justifica
2. Objetivos terapéuticos (% de reducción de TA y tiempo)
3. Tratamiento farmacológico específico (fármaco, dosis, vía)
4. Monitorización necesaria
5. Criterios de ingreso vs alta
6. Seguimiento ambulatorio recomendado
7. Educación al paciente sobre prevención

Considera las guías ESC/ESH actuales.`,
        tags: [tags[0]._id, tags[4]._id, tags[8]._id], // Cardiología, Tratamiento, Avanzado
        aiPlatforms: [platforms[0]._id, platforms[1]._id],
        votes: 41,
        isRecommended: true,
        author: 'admin@biblioprompt.com',
      },
    ]);
    console.log('📝 Prompts created');

    console.log('\n✨ Seed completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Users: ${await User.countDocuments()}`);
    console.log(`   - Tags: ${await Tag.countDocuments()}`);
    console.log(`   - AI Platforms: ${await AIPlatform.countDocuments()}`);
    console.log(`   - Prompts: ${await Prompt.countDocuments()}`);
    console.log('\n🔑 Admin credentials:');
    console.log('   Email: admin@biblioprompt.com');
    console.log('   Password: admin123\n');

    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
