export type EventFormator<T> = (val: unknown) => T;

export type FormatOnEvent<T = unknown> = {
  init: EventFormator<T>;
  focus: EventFormator<T>;
  change: EventFormator<T>;
  blur: EventFormator<T>;
};
export type Validator = (val: string) => string | null;
export type ValidationCompositionFn<T, M = string> = (errorValue: T, message: M) => Validator;

export type Errors =
  | 'min'
  | 'minlength'
  | 'max'
  | 'maxlength'
  | 'required'
  | 'requiredtrue'
  | 'email'
  | 'pattern'
  | 'nullvalidator'
  | 'compose'
  | 'composeasync';

export type DefaultErrorMessages = Record<Errors, string>;

export type InputState = 'default' | 'warning' | 'error' | 'disabled';
