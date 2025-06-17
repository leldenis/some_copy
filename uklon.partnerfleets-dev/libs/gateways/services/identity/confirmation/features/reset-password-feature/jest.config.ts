export default {
  displayName: '@uklon/gateways/services/identity/confirmation/confirmation-reset-password-feature',
  preset: '../../../../../../../jest.preset.ts',
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
  coverageDirectory:
    '../../../../../../../coverage/libs/gateways/services/identity/confirmation/features/confirmation-reset-password-feature',
};
