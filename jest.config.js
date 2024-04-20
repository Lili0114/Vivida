/*module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|@react-navigation|@react-native/js-polyfills|@react-native/virtualized-lists|@react-native/assets-registry|react-native-safe-area-context|@react-navigation/native-stack|@react-navigation/bottom-tabs|firebase|@react-navigation)',
  ],
};*/

module.exports = {
  preset: 'react-native',
  /*transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  }*/
  setupFilesAfterEnv: ['./jest.setup.js'],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest"
  },
  transformIgnorePatterns: [
    "node_modules/(?!react-native|react-navigation)/"
  ]
};