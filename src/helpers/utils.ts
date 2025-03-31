import { Position } from "../app/components/questions/types";

export const setCookie = (name: string, value: string, hours: number): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + hours * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

export const getCookie = (name: string): string | undefined => {
  const cookieString: string = document.cookie || "";
  const cookies: Record<string, string> = cookieString.split("; ").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return cookies[name];
}

export const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}


export const getPosition = (parent: Position, child: Position, place: 'top' | 'right' | 'bottom' | 'left' = 'bottom', padding: number = 0, margin: number = 4) => {
  const p = parent
  const c = child
  const maxX = window.innerWidth;
  const maxY = window.innerHeight;

  let y = 0;
  let x = 0;

  if (place === 'top') {
    y = p.top - c.height - padding;
    x = p.left;

  } else if (place === 'right') {
    y = p.top + (p.height / 2)
    x = p.right + padding;

  } else if (place === 'bottom') {
    y = p.top + p.height + padding;
    x = p.left;
  } else {
    y = p.top + (p.width / 2)
    x = p.left - padding;
  }

  const resultingMargins = {
    top: Math.min(y, p.top),
    right: Math.max(maxX - (x + c.width), maxX - p.right),
    bottom: Math.min(maxY - p.bottom, maxY - (y + c.height)),
    left: Math.min(x, p.left)
  }

  // Fix check if outside of view
  /*
  y = y > margin ? y : p.bottom + padding;
  y = y + c.top + margin > (maxY + margin) ? y : p.bottom + padding;
  x = x < (maxX + margin) ? x : p.right + margin;
  x = x > margin ? x : p.left - c.width;
*/
  return { x: `${x}px`, y: `${y}px` }
};
