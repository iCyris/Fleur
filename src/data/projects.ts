export interface Project {
  id: string;
  index: string;
  name: string;
  description: string;
  githubUrl: string;
  /** Optional showcase / demo / website link. Only rendered when present. */
  showcaseUrl?: string;
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
    tags: ['reports', 'analysis', 'editorial'],
  },
];
