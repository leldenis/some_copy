const plugin = require('tailwindcss/plugin');

module.exports = plugin(({}) => {}, {
  theme: {
    extend: {
      dropShadow: {
        sm: '0px 2px 4px rgba(0, 0, 0, 0.16);',
        md: '0px 2px 6px rgba(0, 0, 0, 0.24);',
        lg: '0px 3px 8px rgba(0, 0, 0, 0.15);',
      },
      boxShadow: {
        sm: '0px 2px 4px rgba(0, 0, 0, 0.16)',
        md: '0px 2px 6px rgba(0, 0, 0, 0.24)',
        lg: '0px 3px 8px rgba(0, 0, 0, 0.15);',
        widget: '0 2px 8px rgba(69, 71, 84, 0.24);',
      }
    }
  }
});
