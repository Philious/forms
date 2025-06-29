import { AbstractControl, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { IconEnum } from './enum';

export type actionButton = {
  id: string;
  label: string;
  action: () => void;
  keepOpenOnClick?: boolean;
};

export type Option<T = string> = {
  label: string;
  value: T;
};

export type Position = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};

export type TextFieldMetaData = {
  label: string;
  type: string;
  prefix: IconEnum;
  sufix: IconEnum;
  helpText: string;
  formName: string;
};

export type ValidatorsType = {
  min: number;
  max: number;
  required: AbstractControl;
  requiredTrue: AbstractControl;
  email: AbstractControl;
  minLength: number;
  maxLength: number;
  pattern: string;
  nullValidator: AbstractControl;
  compose: (ValidatorFn | null | undefined)[];
  composeAsync: (AsyncValidatorFn | null)[];
};

export type NotNone = string | number | boolean | bigint | symbol | object | ((...args: unknown[]) => unknown);

export type StrictNotNone<T> = 0 extends 1 & T
  ? never // filters out 'any'
  : T extends null | undefined | void
    ? never
    : T;
