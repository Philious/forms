export const addToMap = <K extends string, P, T extends Record<K, P>>(map: Map<K, P>, obj: T): K[] => {
  const ids: K[] = [];
  Object.entries(obj).forEach(([k, v]) => {
    ids.push(k as K);
    map.set(k as K, v as P);
  });

  return ids;
};
