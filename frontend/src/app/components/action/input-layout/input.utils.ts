import { DefaultErrorMessages, ValidationCompositionFn } from './input.types';

export const errorMessages: DefaultErrorMessages = {
  min: 'Värdet behöver vara högre än $1',
  minlength: '$1 för få tecken,värdet behöver vara minst $2 tecken',
  max: 'Värdet behöver vara lägre än $1',
  maxlength: '$1 för många tecken, värdet kan max vara $2 tecken',
  required: 'Fältet är obligatoriskt',
  requiredtrue: 'För att komma vidare behöver du acceptera vilkoren',
  email: 'E-posten är inte korrekt ifylld',
  pattern: 'Fältet är inte korrekt ifyllt',
  nullvalidator: 'Fältet är inte korrekt ifyllt',
  compose: 'Fältet är inte korrekt ifyllt',
  composeasync: 'Fältet är inte korrekt ifyllt',
};
const replace = (messageKey: keyof DefaultErrorMessages, keys: [string, string | number][]) => {
  const message = errorMessages[messageKey];
  keys.forEach(([key, value]) => message.replace(key, value.toString()));

  return message;
};
export const min: ValidationCompositionFn<number> =
  (min: number, message?: string) =>
  (val: string): string | null => {
    return parseFloat(val) <= min ? message || replace('min', [['$1', min]]) : null;
  };
export const minLength: ValidationCompositionFn<number> =
  (min: number, message?: string) =>
  (val: string): string | null => {
    const string = typeof val === 'number' ? val : val;
    return string.length <= min
      ? message ||
          replace('minlength', [
            ['$1', min - string.length],
            ['$2', min],
          ])
      : null;
  };
export const max: ValidationCompositionFn<number> =
  (max: number, message?: string) =>
  (val: string): string | null => {
    return parseFloat(val) >= max ? message || replace('max', [['$1', max]]) : null;
  };
export const maxLength: ValidationCompositionFn<number> =
  (max: number, message?: string) =>
  (val: string): string | null => {
    return val.length >= max
      ? message ||
          replace('maxlength', [
            ['$1', val.length - max],
            ['$2', max],
          ])
      : null;
  };
export const required: ValidationCompositionFn<number> =
  (equalTo?: number, message?: string) =>
  (val: unknown): string | null => {
    return (equalTo && equalTo !== val) || equalTo === undefined || val === '' || val === null || (typeof val === 'number' && isNaN(val))
      ? message || 'Required field'
      : '';
  };
const regexEmail = /^(\/d|\/D)+@(\/d|\/D)'.(\/d|\/D)/g;
export const email: ValidationCompositionFn<RegExp> =
  (pattern: RegExp | false, message?: string) =>
  (val: string): string | null =>
    !(pattern || regexEmail).test(val) ? message || 'Not a valid email adress' : null;

export const pattern: ValidationCompositionFn<RegExp> =
  (pattern: RegExp, message?: string) =>
  (val: string): string | null => {
    return new RegExp(pattern).test(val) ? message || 'Pattern not recognized' : null;
  };

export const defaultValidators = {
  min,
  minLength,
  max,
  maxLength,
  required,
  email,
  pattern,
};

export type DefaultValidators = typeof defaultValidators;
export type DefaultValidatorValues = DefaultValidators[keyof DefaultValidators];
