/**
 * Performance Templates - Aggregated Exports
 * Re-exports all template categories for single import
 */

import * as loading from './loading.js';
import * as assets from './assets.js';
import * as rendering from './rendering.js';
import * as css from './css.js';

export const perfTemplates = {
  ...loading,
  ...assets,
  ...rendering,
  ...css
};
