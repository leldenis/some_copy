const plugin = require('tailwindcss/plugin');

const SPANS = Array.from({ length: 24 }, (_, index) => ([
  `span-${index + 1}`, `span ${index + 1} / span ${index + 1}`
]));

module.exports = plugin(({}) => {}, {
  theme: {
    extend: {
      gridTemplateColumns: {
        '24': 'repeat(24, minmax(0, 1fr))',
      },
      gridColumn: {
        ...Object.fromEntries(SPANS)
      }
    }
  }
});
