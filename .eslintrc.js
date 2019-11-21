module.exports = {
  'extends': ['airbnb-base', 'plugin:prettier/recommended'],
  'env': {
    'browser': true,
    'node': true
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        'max-len': 'off',
        'no-param-reassign': 0,
        'class-methods-use-this': 0,
        'no-underscore-dangle': 0,
        'no-console': 0,
      }
    }
  ]
};
