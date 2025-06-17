const plugin = require('tailwindcss/plugin');

module.exports = plugin(({}) => {}, {
  theme: {
    extend: {
      maxWidth: {
        'screen': '100vh'
      },
      spacing: {
        'badge': '24px',
        'cell': '36px',
        'cell-0': '48px',
        'cell-1': '56px',
        'cell-2': '70px',
        'cell-3': '80px',
      }
    }
  }
});
