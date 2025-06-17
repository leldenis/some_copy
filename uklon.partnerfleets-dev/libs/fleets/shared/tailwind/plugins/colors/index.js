const plugin = require('tailwindcss/plugin');

const neutral = {
  black: 'hsla(0, 0%, 0%, 1)',
  onyx: 'hsla(210, 6%, 14%, 1)',
  carbon: 'hsla(228, 9%, 22%, 1)',
  graphite: 'hsla(232, 10%, 30%, 1)',
  shale: 'hsla(231, 7%, 39%, 1)',
  smoke: 'hsla(229, 5%, 47%, 1)',
  granit: 'hsla(240, 4%, 69%, 1)',
  fog: 'hsla(220, 3%, 82%, 1)',
  mist: 'hsla(0, 0%, 80%, 1)', // something
  cloud: 'hsla(180, 2%, 90%, 1)',
  silver: 'hsla(0, 0%, 95%, 1)',
  white: 'hsla(0, 0%, 100%, 1)',
};

const accent = {
  coral: {
    light: 'hsla(0, 73%, 68%, 1)',
    dark: 'hsla(0, 73%, 68%, 0.2)',
  },
  mint: {
    light: 'hsla(163, 60%, 50%, 1)',
    dark: 'hsla(152, 43%, 88%, 1)',
  },
  blue: {
    light: 'hsla(190, 77%, 46%, 1)',
    dark: 'hsla(190, 77%, 46%, 0.2)',
  },
  lime: {
    light: 'hsla(61, 54%, 60%, 1)',
    dark: 'hsla(61, 54%, 60%, 0.2)',
  },
};
const alert = {
  blue: {
    light: 'hsla(191, 86%, 31%, 1)',
    dark: 'hsla(190, 100%, 94%, 1)',
  },
  green: { // bright-green
    light: 'hsla(127, 91%, 36%, 1)',
    dark: 'hsla(190, 75%, 92%, 1)',
  },
  grass: { // green
    light: 'hsla(151, 100%, 23%, 1)',
    dark: 'hsla(152, 43%, 88%, 1)',
  },
  yellow: {
    light: 'hsla(40, 100%, 26%, 1)',
    dark: 'hsla(46, 92%, 81%, 1)',
  },
  red: { // bright red
    light: 'hsla(345, 87%, 47%, 1)',
    dark: 'hsla(0, 80%, 98%, 1)',
  },
  blood: { // red
    light: 'hsla(0, 71%, 93%, 1)',
    dark: 'hsla(2, 92%, 39%, 1)',
  },
  violet: {
    light: 'hsla(250, 71%, 56%, 1)',
    dark: 'hsla(250, 100%, 95%, 1)',
  },
};

module.exports = plugin(({}) => {}, {
  theme: {
    extend: {
      colors: {
        neutral,
        accent,
        alert
      }
    }
  }
});

