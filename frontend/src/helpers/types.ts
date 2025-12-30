import { AbstractControl, AsyncValidatorFn, Form } from '@angular/forms';
import { Division, DivisionId, Entry, EntryId, FormId, Page, PageId } from '@cs-forms/shared';
import { IconEnum } from './enum';

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

export type ValidatorFn = <T>(v: T) => boolean;
export type Answer = Record<AnswerId, string>;
export type Validator = Record<ValidatorId, ValidatorFn>;

export type Section = {
  id: SectionId;
  name: string;
  updated: number;
  description: string;
  questions: QuestionId[];
};

export type SectionPayload = {
  id: SectionId;
  name: string;
  updated: number;
  description: string;
  questions: QuestionPayload[];
};

export type QuestionCore = {
  id: QuestionId;
  entry: string;
  updated: number;
  answerType?: EntryTypeEnum;
};

export type Question<C extends Conditions<string | number | symbol> | string = Conditions<string | number | symbol>> = QuestionCore & {
  answers: AnswerId[];
  validators: ValidatorId[];
  conditions: C;
};

export type QuestionPayload = QuestionCore & {
  answers: Answer;
  validators: ValidatorId[];
  conditions: string;
};

export type ActionButton = {
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
