import { ErrorMessages, Validator } from './input.types';

export const min =
  (min: number, message?: string) =>
  (val: number): string | null => {
    return val < min ? message || `The value needs to be more than ${min}` : null;
  };
export const minLength =
  (min: number, message?: string): Validator =>
  (val: string | number): string | null => {
    return (typeof val === 'number' ? val.toLocaleString() : val).length < min ? message || `The value can't be more than ${min} characters` : null;
  };
export const max =
  (max: number, message?: string) =>
  (val: number): string | null => {
    return val > max ? message || `The value needs to be more than ${max}` : null;
  };
export const maxLength =
  (max: number, message?: string) =>
  (val: string | number): string | null => {
    return (typeof val === 'number' ? val.toLocaleString() : val).length > max ? message || `The value can't be more than ${max} characters` : null;
  };
export const required =
  (equalTo?: number, message?: string) =>
  (val: unknown): string | null => {
    return (equalTo && equalTo !== val) || equalTo === undefined || val === '' || val === null || (typeof val === 'number' && isNaN(val))
      ? message || 'Required field'
      : '';
  };

export const email =
  (message?: string) =>
  (val: string): string | null =>
    !/^(\/d|\/D)+@(\/d|\/D)'.(\/d|\/D)/g.test(val) ? message || 'Not a valid email adress' : null;
export const pattern =
  (pattern: string, message?: string) =>
  (val: string): string | null => {
    return new RegExp(pattern).test(val) ? message || 'Pattern not recognized' : null;
  };

export const errorMessages: ErrorMessages = {
  min: 'Värdet behöver vara högre',
  minlength: 'För få tecken',
  max: 'Värdet behöver vara lägre',
  maxlength: 'För många tecken',
  required: 'Fältet är obligatoriskt',
  requiredtrue: 'För att komma vidare behöver du acceptera vilkoren',
  email: 'E-posten är inte korrekt ifylld',
  pattern: 'Fältet är inte korrekt ifyllt',
  nullvalidator: 'Fältet är inte korrekt ifyllt',
  compose: 'Fältet är inte korrekt ifyllt',
  composeasync: 'Fältet är inte korrekt ifyllt',
};
