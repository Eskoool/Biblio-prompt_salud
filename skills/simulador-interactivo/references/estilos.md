# Catálogo de estilos y mecánicas

Ofrece 3-4 que encajen con el tema y el público. Recomendación por defecto: **Clínico limpio** para formación profesional seria; **Pixel art RPG** cuando se busca enganche o se quiere gamificar.

## Estilos visuales

| Estilo | Cuándo | Rasgos técnicos |
|---|---|---|
| **Pixel art RPG** | Gamificar, enganchar, residentes jóvenes | Reglas de RENDERING del prompt del mago: canvas lógico 128x96 o 160x120, escalado entero, paleta fija ~24 colores, sprites procedurales, partículas en pool. El "hechizo" se lanza al acertar; el monstruo/error ataca al fallar. |
| **Clínico limpio** | Formación profesional, validación, protocolos | Tarjetas, tipografía de sistema, azul/verde hospitalario, mucho aire, iconos SVG inline, modo oscuro. Aspecto de herramienta real. |
| **Simulador de interfaz** | Practicar un programa (prescripción electrónica, SADMES, APD) | Imita una pantalla de software genérico (sin marcas reales): campos, alertas, tablas. El usuario hace clic como en la aplicación. |
| **Escape room / misterio** | Repaso de un tema amplio, sesiones de grupo | Narrativa por salas, candados que se abren con la respuesta correcta, pistas con penalización. Tonos oscuros y acentos. |
| **Concurso televisivo** | Repaso rápido, sesiones docentes en grupo | Pantalla grande, cronómetro, comodines, marcador por equipos, sonidos con WebAudio (sin ficheros). |
| **Laboratorio / mesa de trabajo** | Preparaciones, secuencias, técnica aséptica | Vista cenital SVG, arrastrar y soltar objetos (viales, jeringas, cabina), el orden de pasos importa. |
| **Panel Lean / tablero** | Lean, flujo, mejora de procesos | Tarjetas tipo kanban o VSM, arrastrar para ordenar, métricas que cambian en vivo (lead time, esperas). |
| **Retro terminal** | Público técnico, toque lúdico ligero | Fuente monoespaciada, verde/ámbar sobre negro, efecto de escritura. |
| **Amable para pacientes** | Educación sanitaria | Letra grande, alto contraste, ilustraciones SVG sencillas, lenguaje llano, sin puntuaciones punitivas. |

## Mecánicas

- **Caso clínico ramificado**: cada decisión abre un camino; los errores tienen consecuencias simuladas.
- **Cálculo con entrada numérica**: tolerancia definida, comprobación de unidades, corrección paso a paso.
- **Detecta el error**: se muestra una prescripción/proceso con fallos ocultos; hay que encontrarlos.
- **Ordenar pasos**: arrastrar para secuenciar; marca el primer paso mal colocado.
- **Contrarreloj**: casos cortos con tiempo, para automatizar.
- **Simulación en tiempo real**: variables que evolucionan (niveles plasmáticos, cola de pacientes) y el usuario interviene.

Combina un estilo con una o dos mecánicas. Si Yared pide "diseños diferentes", genera variaciones de estilo sobre el mismo banco de contenido.
