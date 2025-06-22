export const addToMap = (map, obj) => {
    const ids = [];
    Object.entries(obj).forEach(([k, v]) => {
        ids.push(k);
        map.set(k, v);
    });
    return ids;
};
