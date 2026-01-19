import { EntryTypeEnum } from './types.js';

// expands object types one level deep
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

// expands object types recursively
export type ExpandRecursively<T> = T extends object ? (T extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]> } : never) : T;

export enum Locale {
  EN = 'en-US',
  NB = 'nb-NO',
  SV = 'sv-SE',
  XX = 'translationKey',
}

export type Translation = Record<Locale, string>;

export type FormId = string;
export type PageId = string;
export type DivisionId = string;
export type EntryId = string;
export type TextType = 'h2' | 'h3' | 'h4' | 'paragraph';

export type Form<T extends 'set' | 'array' = 'array'> = {
  id: FormId;
  label: Translation;
  pages: T extends 'set' ? Set<PageId> : Array<PageId>;
  divisions: T extends 'set' ? Set<DivisionId> : Array<DivisionId>;
  entries: T extends 'set' ? Set<EntryId> : Array<EntryId>;
  updated: number;
};

export type Page<T extends 'set' | 'array' = 'array'> = {
  id: PageId;
  label: Translation;
  forms: T extends 'set' ? Set<FormId> : Array<FormId>;
  divisions: T extends 'set' ? Set<DivisionId> : Array<DivisionId>;
  entries: T extends 'set' ? Set<EntryId> : Array<EntryId>;
  updated: number;
};

export type Division<T extends 'set' | 'array' = 'array'> = {
  id: DivisionId;
  label: Translation;
  forms: T extends 'set' ? Set<FormId> : Array<FormId>;
  pages: T extends 'set' ? Set<PageId> : Array<PageId>;
  entries: T extends 'set' ? Set<EntryId> : Array<EntryId>;
  updated: number;
};

// #region Entry
export type ExtendedEntries = Expand<EntryTypeEnum>;
export type Entry<T extends EntryTypeEnum = EntryTypeEnum> = {
  id: EntryId;
  type: T;
  label: Translation;
  updated: number;
  group?: EntryId[];
  entrySpecific: Settings<T>;
  validation?: boolean;
  condition?: Condition | ExtendedCondition;
};

export type Barometer = Entry<EntryTypeEnum.Barometer>;
export type Text = Entry<EntryTypeEnum.Text>;
export type Number = Entry<EntryTypeEnum.Number>;
export type Date = Entry<EntryTypeEnum.Date>;
export type TextArea = Entry<EntryTypeEnum.Textarea>;
export type Selector = Entry<EntryTypeEnum.Selector>;
export type CheckGroup = Entry<EntryTypeEnum.CheckboxGroup>;
export type RadioGroup = Entry<EntryTypeEnum.RadioGroup>;
export type Texts = Entry<EntryTypeEnum.TextString>;

export type ExEntry = Expand<Barometer | Text | Number | Date | TextArea | Selector | CheckGroup | CheckGroup | RadioGroup | Texts>;

// #region Entry extended props

export type Option<T extends unknown = string> = { label: string; value: T };

export type BarometerSettings = {
  value: string;
};

export type CheckGroupSettings = {
  options: { label: Translation; value: boolean }[];
};

export type DateSettings = {
  value: number;
};

export type NumberSettings = {
  value: number;
};

export type RadioGroupSettings = {
  selected?: number;
  options: { label: Translation; value: number }[];
};

export type SelectorSettings = {
  options: { label: Translation; value: number }[];
  selected?: string[];
  filterable?: boolean;
  multiselect?: boolean;
};

export type TextSettings = {
  value: string;
};

export type TextStringSettings = {
  typographyType?: TextType;
  value: string;
};

export type TextAreaSettings = {
  value: string;
};

export type Settings<T extends EntryTypeEnum> = T extends EntryTypeEnum.Barometer
  ? BarometerSettings
  : T extends EntryTypeEnum.Text
    ? TextSettings
    : T extends EntryTypeEnum.Number
      ? NumberSettings
      : T extends EntryTypeEnum.Date
        ? DateSettings
        : T extends EntryTypeEnum.Textarea
          ? TextAreaSettings
          : T extends EntryTypeEnum.Selector
            ? SelectorSettings
            : T extends EntryTypeEnum.CheckboxGroup
              ? CheckGroupSettings
              : T extends EntryTypeEnum.RadioGroup
                ? RadioGroupSettings
                : TextStringSettings;

// #region Condition */
export type Operator = 'and' | 'or' | 'xand' | 'xor';
export type ConditionSymbol = '==' | '!=' | '<=' | '>=' | '<' | '>';
export type Condition = [EntryId, ConditionSymbol, unknown];
export type ExtendedCondition = { [K in Operator]: ExtendedCondition | Condition[] };
