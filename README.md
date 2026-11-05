# Biblio-prompt_salud

Biblioteca de prompts y skills para salud y farmacia hospitalaria.

## Contenido

| Recurso | Qué es |
|---|---|
| [Prompt del mago](skills/simulador-interactivo/references/prompt-base-mago.md) | Prompt original: mago en pixel art (HTML + Canvas 2D). Plantilla base de estructura y rigor. |
| [Skill `simulador-interactivo`](skills/simulador-interactivo/SKILL.md) | Skill para Claude que convierte el prompt del mago en simuladores, juegos y casos clínicos interactivos en un único HTML, con corrección razonada de errores. |
| [Plantilla con corchetes](skills/simulador-interactivo/references/plantilla.md) | Meta-prompt para adaptar el prompt del mago a cualquier tema. |
| [Estilos y mecánicas](skills/simulador-interactivo/references/estilos.md) | 9 estilos visuales y 6 mecánicas de juego. |

## Instalar la skill

Con [skills.sh](https://skills.sh/):

```bash
npx skills add Eskoool/Biblio-prompt_salud --skill simulador-interactivo
```

O a mano: copia la carpeta `skills/simulador-interactivo` en `~/.claude/skills/`.

## Usar el prompt sin la skill

Abre [plantilla.md](skills/simulador-interactivo/references/plantilla.md), rellena los corchetes y pega debajo el [prompt del mago](skills/simulador-interactivo/references/prompt-base-mago.md).

## Licencia

CC0 1.0. Ver [LICENSE](LICENSE).
