/**
 * WebMCP — exposes read-only portfolio actions to in-browser AI agents.
 *
 * Uses the emerging WebMCP API (navigator.modelContext). Feature-detected:
 * on browsers/agents without support this is a silent no-op with zero cost.
 * Spec: https://webmachinelearning.github.io/webmcp/
 *
 * All tools are read-only and hit the same public JSON the site itself renders.
 */

const BASE = '/data';

// Language the site is currently showing (mirrors the app's own logic).
function currentLang() {
  const stored = localStorage.getItem('language') || localStorage.getItem('lang');
  if (stored === 'pt' || stored === 'en') return stored;
  return (navigator.language || 'en').toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

function dataUrl(name, lang = currentLang()) {
  return lang === 'pt' ? `${BASE}/${name}-pt.json` : `${BASE}/${name}.json`;
}

const cache = new Map();
async function fetchData(name, lang) {
  const url = dataUrl(name, lang);
  if (cache.has(url)) return cache.get(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${name} (${res.status})`);
  const json = await res.json();
  cache.set(url, json);
  return json;
}

function text(payload) {
  const body = typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2);
  return { content: [{ type: 'text', text: body }] };
}

function slim(p) {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    url: p.url,
    category: p.category,
    tags: p.tags,
  };
}

const tools = [
  {
    name: 'list_projects',
    description:
      "List Arturo Vaine's projects. Optionally filter by category or tag. Returns id, title, description, url, category, and tags.",
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string', description: 'Filter by category, e.g. "open-source".' },
        tag: { type: 'string', description: 'Filter by a tag (case-insensitive).' },
      },
    },
    async execute({ category, tag } = {}) {
      let projects = await fetchData('projects');
      if (category) projects = projects.filter((p) => p.category === category);
      if (tag) {
        const t = tag.toLowerCase();
        projects = projects.filter((p) => (p.tags || []).some((x) => x.toLowerCase() === t));
      }
      return text({ count: projects.length, projects: projects.map(slim) });
    },
  },
  {
    name: 'get_project',
    description: 'Get full detail for a single project by its id (see list_projects).',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string', description: 'The project id.' } },
      required: ['id'],
    },
    async execute({ id }) {
      const projects = await fetchData('projects');
      const project = projects.find((p) => p.id === id);
      if (!project) return text(`No project with id "${id}". Use list_projects to see valid ids.`);
      return text(project);
    },
  },
  {
    name: 'list_experience',
    description: "List Arturo Vaine's professional experience timeline.",
    inputSchema: { type: 'object', properties: {} },
    async execute() {
      return text(await fetchData('experience'));
    },
  },
  {
    name: 'get_contact',
    description: 'Get contact and social links for Arturo Vaine.',
    inputSchema: { type: 'object', properties: {} },
    async execute() {
      return text({
        name: 'Arturo Vaine',
        role: 'Engineer & Product Designer',
        email: 'arturo.vaine@gmail.com',
        github: 'https://github.com/arturovaine',
        linkedin: 'https://linkedin.com/in/arturovaine',
      });
    },
  },
  {
    name: 'open_project',
    description:
      "Open a project's external link in a new browser tab. Provide a project id (see list_projects).",
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string', description: 'The project id to open.' } },
      required: ['id'],
    },
    async execute({ id }) {
      const projects = await fetchData('projects');
      const project = projects.find((p) => p.id === id);
      if (!project) return text(`No project with id "${id}".`);
      if (!project.url) return text(`Project "${id}" has no external URL.`);
      window.open(project.url, '_blank', 'noopener');
      return text(`Opened ${project.title}: ${project.url}`);
    },
  },
];

export const WebMCP = {
  init() {
    try {
      const ctx = navigator.modelContext;
      if (!ctx || typeof ctx.provideContext !== 'function') return; // unsupported → no-op
      ctx.provideContext({ tools });
    } catch {
      /* never let discovery wiring break the page */
    }
  },
};
