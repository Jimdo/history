export default function(history, done) {
  const spy = jest.fn();
  const unlisten = history.listen(spy);

  expect(spy).not.toHaveBeenCalled();

  unlisten();
  done();
}
