export const setCookie = (name: string, value: string, hours: number): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + hours * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

export const getCookie = (name: string): string | undefined => {
  const cookieString: string = document.cookie || '';
  const cookies: Record<string, string> = cookieString
    .split('; ')
    .reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

  return cookies[name];
};

export const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export function handleValue(event: Event) {
  console.log(event);
  return (event.target as HTMLInputElement)?.value;
}
