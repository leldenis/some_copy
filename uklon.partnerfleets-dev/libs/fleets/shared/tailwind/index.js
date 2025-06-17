// a tailwind preset

/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  corePlugins: {
    preflight: true
  },
  theme: {
    extend: {
      gridTemplateRows: {
        addCardDialog: 'repeat(4, max-content) 1fr',
        confirmAddCardDialog: 'repeat(2, max-content) 1fr',
      },
      container: {
        inherit: {
          display: 'inherit'
        }
      },
      screens: {
        'xs': '400px',
        '3xl': '1920px',
      },
    }
  },
  plugins: [
    require('./plugins/shadows'),
    require('./plugins/spacing'),
    require('./plugins/colors'),
    require('./plugins/typography'),
    require('./plugins/grid'),
  ],
};
