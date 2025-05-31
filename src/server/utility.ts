export const mergeDeep = (a: any, b: any) => {
  const keys = Object.keys(b);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (a[key] === undefined) {
      a[key] = b[key];
      continue;
    }

    if (Array.isArray(a[key]) && Array.isArray(b[key])) {
      a[key] = b[key].concat(a[key]);
      continue;
    }

    if (a[key] instanceof Object && b[key] instanceof Object) {
      a[key] = mergeDeep(a[key], b[key]);
      continue;
    }
  }
  return a;
};
