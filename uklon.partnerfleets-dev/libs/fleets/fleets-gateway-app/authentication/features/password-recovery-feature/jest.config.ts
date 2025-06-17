export default {
  displayName: '@uklon/fleets-gateway-app/authentication/password-recovery-feature',
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
  coverageDirectory:
    '../../../../../../coverage/libs/fleets/fleets-gateway-app/authentication/features/password-recovery-feature',
};
