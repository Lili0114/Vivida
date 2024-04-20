module.exports = {
  presets: ['module:@react-native/babel-preset','@babel/preset-typescript'],
  plugins: [
    'react-native-reanimated/plugin',
    '@babel/plugin-transform-flow-strip-types'
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
  
};