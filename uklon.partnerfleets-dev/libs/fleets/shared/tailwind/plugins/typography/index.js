const plugin = require('tailwindcss/plugin');

module.exports = plugin(() => {}, {
  theme: {
    extend: {
      fontSize: {
        base: ['14px', '18px'],
        // mediator name Web_Body
        md: ['12px', '14px'],
        body: ['12px', '14px'],
        button: ['14px', '28px'],
        //
        money: ['26px', '28px'],
        title: ['20px', '28px'],
        // mediator name Web_Headline
        headline: ['20px', '28px'],
        input: ['14px', '18px'],
        label: ['10px', '14px'],
        outerLabel: ['14px', '20px'],
        dialogTitle: ['16px', '24px'],
        icon: ['1.25rem', '1.25rem'],
        heading: ['16px', '20px'],
        inherit: ['inherit', 'inherit']
      },
      fontFamily: {
        sans: [
          'Roboto', 'Helvetica', 'Arial', 'sans-serif'
        ]
      }
    }
  }
});
