/**
 * Skeleton Loading Utilities
 * Provides reusable skeleton CSS and helpers to reduce CLS
 */

export const skeletonStyles = `
  @keyframes skeleton-shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .skeleton {
    background: linear-gradient(
      90deg,
      var(--skeleton-base, #e0e0e0) 25%,
      var(--skeleton-highlight, #f0f0f0) 50%,
      var(--skeleton-base, #e0e0e0) 75%
    );
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s ease-in-out infinite;
    border-radius: 4px;
  }

  :host-context(body.dark-mode) .skeleton {
    --skeleton-base: #2a3441;
    --skeleton-highlight: #3a4451;
  }

  .skeleton-text {
    height: 1em;
    margin: 0.5em 0;
  }

  .skeleton-text.title {
    height: 1.5em;
    width: 60%;
  }

  .skeleton-text.subtitle {
    height: 1em;
    width: 40%;
  }

  .skeleton-card {
    aspect-ratio: 1;
    width: 100%;
  }

  .skeleton-section {
    padding: 1.5rem;
    margin-bottom: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 0;
  }

  :host-context(body.dark-mode) .skeleton-section {
    border-color: #2a3441;
    background: #171f26;
  }

  .skeleton-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }

  .skeleton-image {
    width: 100%;
    height: 200px;
  }

  .skeleton-hidden {
    display: none;
  }
`;

/**
 * Generate skeleton HTML for portfolio cards
 */
export function portfolioSkeletonHTML(count = 9) {
  return Array(count).fill(0).map(() => `
    <div class="skeleton skeleton-card"></div>
  `).join('');
}

/**
 * Generate skeleton HTML for profile sections
 */
export function profileSkeletonHTML() {
  return `
    <div class="skeleton-section">
      <div class="skeleton skeleton-text title"></div>
      <div class="skeleton skeleton-text" style="width: 90%"></div>
      <div class="skeleton skeleton-text" style="width: 85%"></div>
      <div class="skeleton skeleton-text" style="width: 70%"></div>
    </div>
    <div class="skeleton-section">
      <div class="skeleton skeleton-text title"></div>
      <div class="skeleton skeleton-text" style="width: 80%"></div>
      <div class="skeleton skeleton-text" style="width: 75%"></div>
    </div>
    <div class="skeleton-section">
      <div class="skeleton skeleton-text title"></div>
      <div class="skeleton skeleton-text" style="width: 85%"></div>
    </div>
  `;
}

/**
 * Generate skeleton HTML for skills icons
 */
export function skillsSkeletonHTML(count = 5) {
  return Array(count).fill(0).map(() => `
    <div class="skills__item">
      <div class="skeleton skeleton-avatar"></div>
      <div class="skeleton skeleton-text subtitle" style="width: 60px; margin: 0 auto;"></div>
    </div>
  `).join('');
}

export default {
  skeletonStyles,
  portfolioSkeletonHTML,
  profileSkeletonHTML,
  skillsSkeletonHTML
};
