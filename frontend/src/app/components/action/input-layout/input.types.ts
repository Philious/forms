export type EventFormator<T> = (val: unknown) => T;

export type FormatOnEvent<T = unknown> = {
  init: EventFormator<T>;
  focus: EventFormator<T>;
  change: EventFormator<T>;
  blur: EventFormator<T>;
};

export type Validator<E extends string = string> = (val: E) => string | null;

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

export type ErrorMessages = Record<Errors, string>;

export type InputState = 'default' | 'warning' | 'error' | 'disabled';
