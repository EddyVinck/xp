module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  // moduleDirectories: ['node_modules', path.join(__dirname, 'src'), 'shared'],
  moduleNameMapper: {
    '\\.s?css': require.resolve('./test/style-mock.ts'),
  },
  setupFilesAfterEnv: [require.resolve('./test/setup-test.ts')],
};
