test('object snapshot', () => {
  const config = {
    env: 'test',
    timeout: 5000
  };
  expect(config).toMatchSnapshot();
});