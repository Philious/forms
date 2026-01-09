import { AbstractControl, AsyncValidatorFn, Form } from '@angular/forms';
import { Division, DivisionId, Entry, EntryId, FormId, Page, PageId } from '@cs-forms/shared';

export type Exact<T> = T extends infer U ? (U extends T ? (T extends U ? U : never) : never) : never;
export type GenericEvent<T> = Event & { type: T } & T;
export type FormRecord = Record<FormId, Form> | null;
export type PageRecord = Record<PageId, Page> | null;
export type DivisionRecord = Record<DivisionId, Division> | null;
export type EntryRecord = Record<EntryId, Entry<EntryTypeEnum>> | null;

export enum EntryTypeEnum {
  RadioGroup = 'radio-group',
  Barometer = 'barometer',
  Text = 'text',
  Number = 'number',
  Textarea = 'text-area',
  Date = 'date',
  Selector = 'selector',
  Checkbox = 'check-box',
  CheckboxGroup = 'check-group',
  TextString = 'text-string',
}

export type SectionId = string;
export type QuestionId = string;
export type AnswerId = string;
export type ValidatorId = string;

export type Option<T = string> = {
  label: string;
  value: T;
};

type Validator<T = string> = (value: T) => string | null;
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
  compose: (Validator | undefined)[];
  composeAsync: (AsyncValidatorFn | null)[];
};

export type ValidatorMap = Map<keyof ValidatorsType, ValidatorsType[keyof ValidatorsType]>;

export type NotNone = string | number | boolean | bigint | symbol | object | ((...args: unknown[]) => unknown);

export type StrictNotNone<T> = 0 extends 1 & T
  ? never // filters out 'any'
  : T extends null | undefined | void
    ? never
    : T;

export type ConditionType = '==' | '!=' | '<=' | '>=' | '<' | '>';
export type AndOr = 'and' | 'or' | 'xand' | 'xor';
export type ConditionTuplet = [ConditionType, unknown];
export type LeafCondition<K extends string | number | symbol> = Readonly<[K, ConditionType, unknown]>;

export type Conditions<K extends string | number | symbol> =
  | LeafCondition<K>
  | { and: Conditions<K>[] }
  | { or: Conditions<K>[] }
  | { xand: Conditions<K>[] }
  | { xor: Conditions<K>[] };

export type BaseEntry<I, K extends string | number | symbol> = {
  id: I;
  label: string;
  initialValue: unknown;
  shouldCount?: boolean;
  validators: ValidatorMap;
  displayConditions: Conditions<K>;
};
