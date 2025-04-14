test('object equality', () => {
  const user = { 
    name: 'John',
    age: 30
  };
  expect(user).toEqual({ name: 'John', age: 30 });
});

test('object property check', () => {
  const car = { make: 'Toyota', model: 'Camry' };
  expect(car).toHaveProperty('make');
  expect(car).toHaveProperty('model', 'Camry');
});