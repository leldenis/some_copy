export default {
  displayName: '@uklon/gateways/services/identity/core/domain',
  preset: '../../../../../../jest.preset.ts',
  globals: {},
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../../../coverage/libs/gateways/services/identity/core/domain',
};
