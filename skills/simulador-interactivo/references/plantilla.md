# Plantilla (rellenar los corchetes)

```
Usa el prompt base de abajo como plantilla de ESTRUCTURA y RIGOR (no de contenido)
para crear un único archivo HTML autocontenido (JS vanilla, sin librerías ni red)
que sea [un simulador / un juego / una experiencia de aprendizaje] sobre [TEMA].

CONTEXTO
- Público: [quién: residentes de farmacia, enfermería, pacientes, alumnos…]
- Nivel de partida: [básico / intermedio / experto]
- Objetivos de aprendizaje: al terminar, el usuario sabrá [3 objetivos concretos y verificables].
- Idioma: [español].

MECÁNICA (máquina de estados, como IDLE→CHARGE→CAST→RECOVER)
- [INTRO → PRÁCTICA → FEEDBACK → REPASO → RETO FINAL] (adaptar a la mecánica).
- Tipo de interacción: [casos clínicos / arrastrar y soltar / cálculo con entrada numérica / elegir entre opciones / simulación paso a paso / tiempo real].
- Dificultad adaptativa: si acierta, el siguiente caso es más difícil; si falla, uno similar más sencillo.

CORRECCIÓN DE ERRORES DEL ALUMNO
- Cada respuesta incorrecta explica POR QUÉ es incorrecta (no solo "mal"), con la regla o fuente.
- Tipos de error: [conceptual / de cálculo / de unidades / de seguridad / de secuencia].
- Los errores críticos de seguridad se marcan de forma distinta y obligan a repetir.
- Los fallos se guardan y se vuelven a preguntar al final.

RIGOR
- Contenido basado en [fuente: ficha técnica, guía X, protocolo del servicio]; cita la fuente en cada feedback.
- Nada de datos inventados: si un dato no es seguro, márcalo como "a verificar".
- Banco mínimo de [N] casos variados.

DISEÑO
- Estilo: [ver estilos.md], con su paleta y tipografía definidas como tokens.
- Funciona en móvil y en escritorio, con barra de progreso y puntuación.
- [Requisitos técnicos del estilo: p. ej. para pixel art, las reglas de RENDERING del prompt base].

QUALITY BAR
- Un experto en [TEMA] no encontraría errores en el contenido.
- Un usuario de nivel [nivel] lo completa en [10-15] min y sale sabiendo los objetivos.
- Sin errores de consola y estable en cualquier tamaño de ventana.

--- PROMPT BASE (solo como referencia de estructura) ---
[contenido de prompt-base-mago.md]
```
