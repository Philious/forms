export const setCookie = (name: string, value: string, hours: number): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + hours * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

export const getCookie = (name: string): string | undefined => {
  const cookieString: string = document.cookie || '';
  const cookies: Record<string, string> = cookieString.split('; ').reduce(
    (acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>
  );

  return cookies[name];
};

export const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export function handleValue(event: Event) {
  console.log(event);
  return (event.target as HTMLInputElement)?.value;
}

export function relateKeyValue<O extends object, K extends keyof O>(obj: O, key: K, value?: O[K]) {
  return value ?? obj[key];
}

export type ExtendedArray<T> = T[] & { remove: (item: T) => ExtendedArray<T>; toggle: (item: T) => ExtendedArray<T> };
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

  return array as ExtendedArray<T>;
}
