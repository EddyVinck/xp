type ExcludeNullIfAnyNotNullHelper<T> = {
  [P in keyof T]-?:
    | (null extends T[P] ? never : null)
    | (undefined extends T[P] ? never : undefined)
}[keyof T];
type ExcludeNullIfAnyNotNull<T extends unknown[]> = Exclude<
  T[number],
  ExcludeNullIfAnyNotNullHelper<T>
>;

function coalesce<T extends unknown[]>(...args: T): ExcludeNullIfAnyNotNull<T>;
function coalesce<T extends unknown[]>(...args: T): T[number] {
  for (let i = 0; i < args.length; i++) {
    // args[i] === args[i] is to avoid NaN, because NaN !== NaN
    if (args[i] != null && args[i] === args[i]) {
      return args[i];
    }
  }
  return null;
}

export default coalesce;
