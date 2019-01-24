/** returns the first not-null value excluding NaN */
const coalesce = (...args: any) => {
  for (let i = 0; i < args.length; i++) {
    // args[i] === args[i] is to avoid NaN, because NaN !== NaN
    if (args[i] != null && args[i] === args[i]) {
      return args[i];
    }
  }
  return null;
};

export default coalesce;
