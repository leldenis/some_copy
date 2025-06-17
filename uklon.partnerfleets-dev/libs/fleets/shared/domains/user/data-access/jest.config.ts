export default {
  displayName: 'fleets-shared-domains-user-data-access',
  preset: '../../../../../../jest.preset.ts',
  globals: {},
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../../../coverage/libs/fleets/shared/domains/user/data-access',
};
