const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      fontSize: {
        xs: '.65rem',
        sm: '.75rem',
        tmp: '1rem',
        xl: '1.25rem',
      },
      spacing: {
        xs: '.65rem',
        sm: '.75rem',
        md: '1rem',
        lg: '1.25rem',
      },
      colors: {
        'neutral-granit': 'var(--grey50-color)',
        'alerts-green-light': 'var(--alerts-bg-green-light)',
        'alerts-bg-green': 'var(--alerts-bg-green)',
        'alerts-text-green': 'var(--alerts-text-green)',
        'alerts-yellow-light': 'var(--alerts-bg-yellow-light)',
        'alerts-bg-yellow': 'var(--alerts-bg-yellow)',
        'alerts-text-yellow': 'var(--alerts-text-yellow)',
        'alerts-red-light': 'var(--alerts-bg-red-light)',
      },
    },
  },
  plugins: [],
  // eslint-disable-next-line
  presets: [require('../../libs/fleets/shared/tailwind')],
};
