// eslint-disable-next-line unicorn/prefer-module
module.exports = {
  default: {
    parallel: 1,
    formatOptions: {
      snippetInterface: 'async-await',
    },
    requireModule: ['ts-node/register'],
    paths: ['tests/features/**/*.feature'],
    require: ['tests/steps/**/*.ts'],
    format: [
      'json:report/cucumber_report.json',
      'html:report/cucumber_report.html',
      'progress-bar',
    ],
  },
};
