export interface Project {
  id: string;
  index: string;
  name: string;
  description: string;
  githubUrl: string;
  /** Optional showcase / demo / website link. Only rendered when present. */
  showcaseUrl?: string;
  /** Optional extra / companion link. Only rendered when present. */
  extraUrl?: string;
  /** Label for the extra link (required when extraUrl is set). */
  extraLabel?: string;
  tags: string[];
}

export const projects: Project[] = [
  {
    id: 'convallaria',
    index: 'N°001',
    name: 'Convallaria',
    description:
      'Agentic design suite for brand systems, visual identity, design tokens, logo/icon production, image optimization, export handoff, and visual QA. It helps turn rough creative intent into production-ready design assets and implementation guidance.',
    githubUrl: 'https://github.com/iCyris/Convallaria',
    tags: ['design systems', 'brand', 'visual QA'],
  },
  {
    id: 'iris',
    index: 'N°002',
    name: 'Iris',
    description:
      'Report layer for AI analysis. It turns research notes, codebase readings, technical explanations, strategy judgments, and agent-authored findings into polished single-page HTML reading reports with editorial typography and clear evidence structure.',
    githubUrl: 'https://github.com/iCyris/Iris',
    showcaseUrl: 'https://iris.cyris.moe/',
    extraUrl: 'https://iris-shelf.cyris.moe/',
    extraLabel: 'Shelf',
    tags: ['reports', 'analysis', 'editorial'],
  },
  {
    id: 'roselle',
    index: 'N°003',
    name: 'Roselle',
    description:
      'Restores image-born graphics into real, editable SVG assets. It turns PNG, JPG, and WebP files into vector geometry and pairs each conversion with structured diagnostics, so people and AI agents can inspect the result together.',
    githubUrl: 'https://github.com/iCyris/Roselle',
    tags: ['SVG conversion', 'vectorization', 'fidelity'],
  },
  {
    id: 'hue',
    index: 'N°004',
    name: 'Hue',
    description:
      'Requirement documents people actually read. Describe it in natural language, get a self-contained HTML doc with live demos.',
    githubUrl: 'https://github.com/iCyris/Hue',
    tags: ['requirements', 'HTML docs', 'live demos'],
  },
];
