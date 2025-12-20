export const addToMap = (map, obj) => {
    const ids = [];
    Object.entries(obj).forEach(([k, v]) => {
        ids.push(k);
        map.set(k, v);
    });
    return ids;
};
export function extendedArray(array) {
    array = array ? array : [];
    Object.defineProperty(array, 'remove', {
        value: (item) => {
            array.splice(array.findIndex(storedItem => storedItem === item, 1));
            return array;
        },
        writable: false,
    });
    Object.defineProperty(array, 'toggle', {
        value: (item) => {
            if (array.includes(item))
                array.splice(array.findIndex(storedItem => storedItem === item, 1));
            else
                array.push(item);
            return array;
        },
        writable: false,
    });
    return array;
}
