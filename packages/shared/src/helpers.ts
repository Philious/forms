export const addToMap = <K extends string, P, T extends Record<K, P>>(map: Map<K, P>, obj: T): K[] => {
  const ids: K[] = [];
  Object.entries(obj).forEach(([k, v]) => {
    ids.push(k as K);
    map.set(k as K, v as P);
  });

  return ids;
};

export type ExtendedArrayType<T> = T[] & {
  remove: (item: T) => ExtendedArrayType<T>;
  toggle: (item: T) => ExtendedArrayType<T>;
  clear: () => ExtendedArrayType<T>;
  unique: () => ExtendedArrayType<T>;
};

export function extendedArray<T>(array?: T[]) {
  array = array ? array : [];
  Object.defineProperty(array, 'remove', {
    value: (item: T): T[] => {
      array.splice(array.findIndex(storedItem => storedItem === item, 1));
      return array;
    },
    writable: false,
  });

  Object.defineProperty(array, 'toggle', {
    value: (item: T): T[] => {
      if (array.includes(item)) array.splice(array.findIndex(storedItem => storedItem === item, 1));
      else array.push(item);
      return array;
    },
    writable: false,
  });

  return array as ExtendedArrayType<T>;
}
