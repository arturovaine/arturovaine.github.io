/**
 * Unit tests for ProjectFilter — collapse/expand ("View more projects") behaviour
 */
import { ProjectFilter } from '../../js/components/ProjectFilter.js';

function makeCard(branch = 'data') {
  const card = document.createElement('div');
  card.className = 'card project project-card';
  card.setAttribute('data-branch', branch);
  card.setAttribute('data-search', 'x');
  document.body.appendChild(card);
  return card;
}

function visible(cards) {
  return cards.filter(c => c.style.display !== 'none' && !c.classList.contains('hidden'));
}

describe('ProjectFilter collapse/expand', () => {
  let cards;

  beforeEach(() => {
    document.body.innerHTML = '';
    // 8 cards total, more than the collapsed limit of 6
    cards = Array.from({ length: 8 }, () => makeCard());

    const wrap = document.createElement('div');
    wrap.id = 'projects-more-wrap';
    wrap.hidden = true;
    const btn = document.createElement('button');
    btn.id = 'projects-more-btn';
    wrap.appendChild(btn);
    document.body.appendChild(wrap);

    // Wire up the object directly (bypass async translation fetch)
    ProjectFilter.translations = { en: { projects: { viewMore: 'View more projects', viewLess: 'Show less' } } };
    ProjectFilter.currentLang = 'en';
    ProjectFilter.activeFilter = 'all';
    ProjectFilter.searchQuery = '';
    ProjectFilter.expanded = false;
    ProjectFilter.collapsedLimit = 6;
    ProjectFilter.chips = [];
    ProjectFilter.searchInput = null;
    ProjectFilter.cards = cards;
    ProjectFilter.moreWrap = wrap;
    ProjectFilter.moreBtn = btn;
  });

  afterEach(() => { document.body.innerHTML = ''; });

  test('collapsed state shows only the first 6 cards and the button', () => {
    ProjectFilter.applyFilters();

    expect(visible(cards)).toHaveLength(6);
    expect(ProjectFilter.moreWrap.hidden).toBe(false);
    expect(ProjectFilter.moreBtn.textContent).toBe('View more projects');
    expect(ProjectFilter.moreBtn.getAttribute('aria-expanded')).toBe('false');
  });

  test('expanded state shows all cards and flips the button label', () => {
    ProjectFilter.expanded = true;
    ProjectFilter.applyFilters();

    expect(visible(cards)).toHaveLength(8);
    expect(ProjectFilter.moreWrap.hidden).toBe(false);
    expect(ProjectFilter.moreBtn.textContent).toBe('Show less');
    expect(ProjectFilter.moreBtn.getAttribute('aria-expanded')).toBe('true');
  });

  test('button hidden when matches do not exceed the limit', () => {
    // Filter down to fewer than the limit
    cards.forEach((c, i) => c.setAttribute('data-branch', i < 3 ? 'data' : 'development'));
    ProjectFilter.activeFilter = 'data';
    ProjectFilter.applyFilters();

    expect(visible(cards)).toHaveLength(3);
    expect(ProjectFilter.moreWrap.hidden).toBe(true);
  });
});
