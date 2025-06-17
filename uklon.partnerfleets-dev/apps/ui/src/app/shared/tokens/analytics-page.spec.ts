import { getAnalyticsPage } from '@ui/shared/tokens/analytics-page';

const CASES = [
  {
    url: '/workspace/hello',
    expected: 'hello',
  },
  {
    url: '/workspace/hello/world',
    expected: 'hello_world',
  },
  {
    url: '/workspace/hello/world/a77ca263-3feb-4b4e-8100-970dbc659e27',
    expected: 'hello_world',
  },
  {
    url: '/workspace/hello/world/a77ca263-3feb-4b4e-8100-970dbc659e27?id=test_id',
    expected: 'hello_world',
  },
  {
    url: '/workspace/hello#today',
    expected: 'hello_today',
  },
  {
    url: '/workspace/hello/world#today',
    expected: 'hello_world_today',
  },
  {
    url: '/workspace/hello/world#today?id=test_id',
    expected: 'hello_world_today',
  },
  {
    url: '/workspace/hello/world?id=test_id#today',
    expected: 'hello_world_today',
  },
  {
    url: '/workspace/hello/world?id=test_id&name=test_name#today',
    expected: 'hello_world_today',
  },
  {
    url: '/workspace/hello/world#a-b',
    expected: 'hello_world_a_b',
  },
];

describe('getAnalyticsPage', () => {
  describe.each(CASES)('should generate page name from url', ({ url, expected }) => {
    it(`should return "${expected}"`, () => {
      const actual = getAnalyticsPage(url);
      expect(actual).toBe(expected);
    });
  });
});
