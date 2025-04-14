let testData;

beforeEach(() => {
  testData = { value: 10 };
});

afterEach(() => {
  testData = null;
});

test('test with setup/teardown', () => {
  testData.value += 5;
  expect(testData.value).toBe(15);
});