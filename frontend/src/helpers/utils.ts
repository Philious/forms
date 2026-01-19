import { signal, WritableSignal } from '@angular/core';
import cloneDeep from 'lodash.clonedeep';

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

export function hasOwnProperty<O extends object, K extends PropertyKey>(obj: O, key: K): obj is O & Record<K, unknown> {
  return Object.hasOwn(obj, key);
}

function defineOwnProperty<O extends object, K extends PropertyKey, V>(
  obj: O,
  key: K,
  descriptor: TypedPropertyDescriptor<V>
): asserts obj is O & Record<K, V> {
  Object.defineProperty(obj, key, descriptor);
}

export const array = {
  remove: <T = unknown>(item: T, array: T[]): T[] => {
    const index = array.findIndex(storedItem => storedItem === item);
    if (index !== -1) {
      array.splice(index, 1);
    }
    return array;
  },
  toggle: <T = unknown>(item: T, array: T[]): T[] => {
    const index = array.findIndex(storedItem => storedItem === item);
    if (index !== -1) {
      array.splice(index, 1);
    } else {
      array.push(item);
    }
    return array;
  },
  clear: <T = unknown>(array: T[]): T[] => {
    array.length = 0;
    return array;
  },
  unique: <T = unknown>(item: T, array: T[]): T[] => {
    const seen = new Set<T>();
    const uniqueItems = array.filter(i => !seen.has(i) && seen.add(i));
    array.splice(0, array.length, ...uniqueItems);
    return array;
  },
};

export type ExtendedArrayType<T> = T[] & {
  remove: (item: T) => ExtendedArrayType<T>;
  toggle: (item: T) => ExtendedArrayType<T>;
  clear: () => ExtendedArrayType<T>;
  unique: () => ExtendedArrayType<T>;
};

export function extendedArray<T>(array?: T[]) {
  array = array ? array : [];
  defineOwnProperty(array, 'remove', {
    value: (item: T): T[] => {
      array.splice(array.findIndex(storedItem => storedItem === item, 1));
      return array;
    },
    writable: false,
  });

  defineOwnProperty(array, 'toggle', {
    value: (item: T): T[] => {
      if (array.includes(item)) array.splice(array.findIndex(storedItem => storedItem === item, 1));
      else array.push(item);
      return array;
    },
    writable: false,
  });

  return array;
}

export class ExtendedArray<T> extends Array<T> {
  constructor(initialItems: T[] = []) {
    super(...initialItems);
  }

  static override get [Symbol.species](): ArrayConstructor {
    return Array;
  }

  remove(item: T): this {
    const index = this.findIndex(storedItem => storedItem === item);
    if (index !== -1) {
      this.splice(index, 1);
    }
    return this;
  }

  toggle(item: T): this {
    const index = this.findIndex(storedItem => storedItem === item);
    if (index !== -1) {
      this.splice(index, 1);
    } else {
      this.push(item);
    }
    return this;
  }

  clear(): this {
    this.length = 0;
    return this;
  }

  unique(): this {
    const seen = new Set<T>();
    const uniqueItems = this.filter(i => !seen.has(i) && seen.add(i));
    this.splice(0, this.length, ...uniqueItems);
    return this;
  }
}

type Entry<O> = {
  [K in keyof O]: [K, O[K]];
}[keyof O];

export type ExtendedObjectType<O extends Record<PropertyKey, unknown>> = O & {
  has: (item: string) => boolean;
  size: () => number;
  update: () => void;
  values: () => O[keyof O][];
  keys: () => (keyof O)[];
  entries: () => Entry<O>;
};

export function extendedRecord<O extends Record<PropertyKey, any>>(object?: O): ExtendedObjectType<O> {
  object = object ? object : ({} as O);

  Object.defineProperty(object, 'has', {
    value: (item: string): boolean => {
      return Object.keys(object).filter(o => o === item).length > 0;
    },
    writable: false,
  });

  Object.defineProperty(object, 'size', {
    value: (): number => {
      return Object.keys(object).length;
    },
    writable: false,
  });

  Object.defineProperty(object, 'update', {
    value: (): O => {
      return cloneDeep<O>(object);
    },
    writable: false,
  });

  Object.defineProperty(object, 'values', {
    value: (): Array<O[keyof O]> => {
      return Object.values(object);
    },
    writable: false,
  });

  Object.defineProperty(object, 'keys', {
    value: (): Array<keyof O> => {
      return Object.keys(object);
    },
    writable: false,
  });

  Object.defineProperty(object, 'entries', {
    value: (): ArrayLike<Entry<O>> => {
      return Object.entries(object);
    },
    writable: false,
  });

  return object as ExtendedObjectType<O>;
}

export function toggler() {
  const map = new Map<string, WritableSignal<boolean>>();

  function trigger(name: string, initial = false): void {
    if (map.has(name)) map.get(name)!.update(val => !val);
    else map.set(name, signal<boolean>(initial));
  }

  function target(name: string): WritableSignal<boolean> {
    if (map.has(name)) return map.get(name)!;
    else return signal(false);
  }

  return { trigger, target };
}

export function svgCircleAsPath(cx: number, cy: number, r: number) {
  return `M${cx - r},${cy}
        a${r},${r} 0 1,0${r * 2},0
        a${r},${r} 0 1,0-${r * 2},0`;
}

type EasingFunction = (t: number) => number;
export function animateValue(
  start: number,
  end: number,
  speed: number,
  onUpdate: (value: number) => void,
  easing: EasingFunction = (n: number) => n,
  onResolve: (value: number) => void = (n: number) => n
): Promise<void> {
  console.log('animate', start, end, speed);
  return new Promise(resolve => {
    const diff = Math.abs(end - start);
    const duration = diff / speed; // Convert to milliseconds
    const startTime = performance.now();

    function step(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);
      const currentValue = Math.round(start + (end - start) * easedProgress);

      onUpdate(currentValue);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        console.log('resolve');
        onUpdate(end);
        onResolve(end);
        resolve();
      }
    }

    requestAnimationFrame(step);
  });
}

export function delay(delayMs: number, callback: () => void) {
  const stopTime = performance.now() + delayMs;
  new Promise<void>(resolve => {
    function step(now: number) {
      if (stopTime > now) {
        requestAnimationFrame(step);
      } else {
        callback();
        resolve();
      }
    }
    requestAnimationFrame(step);
  });
}

export function decimals(v: number, d: number) {
  return Math.round(v * 10 ** d) / 10 ** d;
}
