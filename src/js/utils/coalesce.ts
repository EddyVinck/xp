/** returns the first not-null value excluding NaN */
// xeslint-disable-next-line @typescript-eslint/explicit-function-return-type
const coalesce = (...args: any): any => {
  for (let i = 0; i < args.length; i++) {
    // args[i] === args[i] is to avoid NaN, because NaN !== NaN
    if (args[i] != null && args[i] === args[i]) {
      return args[i];
    }
  }
  return null;
};

export default coalesce;
