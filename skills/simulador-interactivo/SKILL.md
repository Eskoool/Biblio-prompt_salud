---
name: simulador-interactivo
description: Construye simuladores, juegos y experiencias de aprendizaje interactivas en un único HTML autocontenido (JS vanilla, sin librerías), con corrección razonada de errores, dificultad adaptativa y rigor de contenido, usando como plantilla de estructura el "prompt del mago" (pixel art). Úsala cuando Yared pida un simulador, juego, quiz, caso clínico interactivo, entrenador, gamificar un tema, "experiencia interactiva", formación para residentes/enfermería/pacientes, o pegue la frase "adáptame este prompt para…". English: interactive simulator, training game, gamified learning HTML.
---

# Simulador interactivo

Convierte una intención ("quiero un juego para que los residentes practiquen ajuste renal") en un prompt completo con los corchetes rellenos y, después, en el HTML terminado.

Ficheros de apoyo (léelos al usar la skill):
- `references/plantilla.md`: la plantilla con corchetes. Es lo que hay que rellenar.
- `references/prompt-base-mago.md`: el prompt original del mago. Úsalo como referencia de **estructura y rigor** (secciones con requisitos medibles, máquina de estados, pool sin asignaciones, QUALITY BAR), no de contenido.
- `references/estilos.md`: catálogo de estilos visuales y tipos de mecánica.

## Flujo

1. **Detecta la intención y rellena los corchetes tú.** Deduce de la petición, del contexto de la conversación y de lo que sabes de Yared (farmacéutico hospitalario, forma a residentes, trabaja con Lean y circuitos de farmacia) cada campo de la plantilla: TEMA, PÚBLICO, NIVEL, OBJETIVOS, MECÁNICA, TIPOS DE ERROR, FUENTE, ESTILO, DURACIÓN, N.º DE CASOS.
2. **Pregunta solo lo que no puedas deducir y cambie el resultado**, en una sola llamada a AskUserQuestion (máximo 3 preguntas). Lo habitual que falta:
   - Estilo visual (ofrece 3-4 de `estilos.md` que encajen con el tema y el público, con tu recomendación primero).
   - Fuente de referencia del contenido, si es clínico (ficha técnica, guía, protocolo del servicio).
   - Público, si no está claro.
   Si Yared ya dio todo, no preguntes.
3. **Muestra el prompt relleno** en un bloque, de forma breve, para que pueda corregirlo. Si dijo "hazlo directamente", sáltate la espera y sigue.
4. **Construye el HTML siguiendo tu propio prompt relleno** como especificación. Reglas fijas:
   - Un solo `.html`, sin red, sin librerías, abre con doble clic.
   - Máquina de estados explícita (INTRO → PRÁCTICA → FEEDBACK → REPASO → RETO FINAL o equivalente).
   - Cada error explica el porqué y cita la fuente; los errores de seguridad críticos se marcan aparte y obligan a repetir.
   - Los fallos se vuelven a preguntar al final.
   - Banco de casos generado con datos plausibles y coherentes; si un dato clínico no es seguro, márcalo "a verificar" en el propio contenido y avísalo en la respuesta.
   - Responsive (móvil y escritorio), barra de progreso, puntuación, botón de reiniciar.
   - Si el estilo es pixel art o canvas, aplica las reglas técnicas del prompt del mago (resolución lógica, escalado entero, paleta fija, timestep fijo, pool de partículas).
5. **Verifica** abriéndolo en el navegador integrado: sin errores de consola, recorre al menos un acierto, un fallo y un fallo crítico.
6. **Entrega**: guarda el fichero en la carpeta de trabajo (`simuladores/<tema>.html` si no dice otra cosa) y ofrece en una línea publicarlo como Artifact para compartir con residentes. Si necesita guardar resultados de varios usuarios, eso requiere capacidad de base de datos del Artifact (carga `artifact-capabilities`).

## Rigor del contenido clínico

- No inventes dosis, rangos ni interacciones. Usa conocimiento consolidado y, si hay herramientas de fuentes (PubMed, ficha técnica), verifica los datos dudosos.
- Indica en la respuesta qué datos convendría que Yared revise antes de usarlo con residentes.
