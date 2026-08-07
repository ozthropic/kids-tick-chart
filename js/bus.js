// bus.js — tiny shared registry wired by main.js at boot.
// Lets views trigger navigation without circular imports.

export const app = {
  show: null,      // (screenName) => void — set by main.js
  celebrate: null  // (stickerId) => void  — set by main.js
};
