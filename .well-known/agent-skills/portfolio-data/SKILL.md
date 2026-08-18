---
name: portfolio-data
description: Query Arturo Vaine's portfolio — projects, experience, awards, posts, artworks, volunteering, and contact — via public read-only JSON endpoints.
version: 0.1.0
---

# Skill: Query Arturo Vaine's Portfolio

Arturo Vaine's portfolio (https://arturovaine.github.io) exposes its content as
public, read-only JSON. Use these endpoints instead of scraping the rendered HTML.

## Endpoints

Base: `https://arturovaine.github.io/data/`

| File | Contents |
|------|----------|
| `projects.json` | Work & open-source projects |
| `experience.json` | Professional experience |
| `awards.json` | Awards & recognitions |
| `posts.json` | Writing / posts |
| `artworks.json` | Creative & 3D artwork |
| `volunteering.json` | Volunteering |
| `bootstrapping.json` | Bootstrapping / ventures |

For Portuguese, insert `-pt` before `.json` (e.g. `projects-pt.json`).

## Project object shape

```json
{
  "id": "kaggle-datasets",
  "title": "Kaggle Datasets",
  "description": "...",
  "url": "https://...",
  "category": "open-source",
  "tags": ["Kaggle", "Datasets"],
  "modal": { "subtitle": "...", "fullDescription": "..." }
}
```

## Recipes

- **List all projects:** `GET /data/projects.json` → array of project objects.
- **Filter by tag/category:** fetch `projects.json`, then filter client-side on
  `category` or `tags`.
- **Look up one project:** fetch `projects.json`, find the object whose `id` matches.
- **Get contact info:** parse the `schema.org/Person` JSON-LD in the homepage `<head>`,
  or see `/llms.txt`.

## Constraints
- Read-only. There is no authentication and no write API.
- Content-Signal (see `/robots.txt`): search=yes, ai-input=yes, ai-train=no.
