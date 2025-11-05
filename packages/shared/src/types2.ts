import { EntryTypeEnum } from './types';

// expands object types one level deep
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

// expands object types recursively
export type ExpandRecursively<T> = T extends object ? (T extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]> } : never) : T;

export type FormId = string;
export type PageId = string;
export type DivisionId = string;
export type EntryId = string;
export type TextType = 'h2' | 'h3' | 'h4' | 'paragraph';

export type Form<T extends 'id' | 'map' = 'id'> = {
  id: FormId;
  header?: string;
  pages: Set<PageId>;
  divisions: Set<DivisionId>;
  entries: T extends 'id' ? Set<EntryId> : T extends 'map' ? Map<EntryId, Entry> : never;
  updated: number;
};

export type Page<T extends 'id' | 'map' = 'id'> = {
  id: PageId;
  header?: string;
  divisions: Set<DivisionId>;
  entries: T extends 'id' ? Set<EntryId> : T extends 'map' ? Map<EntryId, Entry> : never;
  updated: number;
};

export type Division<T extends 'id' | 'map' = 'id'> = {
  id: DivisionId;
  header?: string;
  entries: T extends 'id' ? Set<EntryId> : T extends 'map' ? Map<EntryId, Entry> : never;
  updated: number;
};

// #region Entry
export type ExtendedEntries = Expand<EntryTypeEnum>;
export type Entry<T extends ExtendedEntries = ExtendedEntries> = {
  id: EntryId;
  type: T;
  label: string;
  updated: number;
  group?: EntryId[];
  validation?: boolean;
  condition?: Condition | ExtendedCondition;
} & Settings<T>;

export type Barometer = Entry<EntryTypeEnum.Barometer>;
export type Text = Entry<EntryTypeEnum.Text>;
export type Number = Entry<EntryTypeEnum.Number>;
export type Date = Entry<EntryTypeEnum.Date>;
export type TextArea = Entry<EntryTypeEnum.Textarea>;
export type Selector = Entry<EntryTypeEnum.Selector>;
export type Check = Entry<EntryTypeEnum.Checkbox>;
export type CheckGroup = Entry<EntryTypeEnum.CheckboxGroup>;
export type RadioGroup = Entry<EntryTypeEnum.RadioGroup>;
export type Texts = Entry<EntryTypeEnum.TextString>;

export type ExEntry = Expand<Barometer | Text | Number | Date | TextArea | Selector | Check | CheckGroup | CheckGroup | RadioGroup | Texts>;

// #region Entry extended props
export type Option<T extends unknown = string> = { label: string; value: T };

export type BarometerSettings = {
  value: string;
};

export type TextSettings = {
  value: string;
};

export type NumberSettings = {
  value: number;
};

export type DateSettings = {
  value: number;
};

export type TextAreaSettings = {
  value: string;
};

export type SelectorSettings = {
  options: Option[];
  selected?: string[];
  filterable?: boolean;
  multiselect?: boolean;
};

export type CheckSettings = {
  option: Option;
};

export type CheckGroupSettings = {
  value: string;
  checks: Check[];
};

export type RadioGroupSettings = {
  selected: string;
  options: Option[];
};
export type TextStringSettings = {
  variatiion?: TextType;
};

export type Settings<T extends EntryTypeEnum> = T extends 'barometer'
  ? BarometerSettings
  : T extends EntryTypeEnum.Text
  ? TextSettings
  : T extends EntryTypeEnum.Number
  ? NumberSettings
  : T extends EntryTypeEnum.Number
  ? DateSettings
  : T extends EntryTypeEnum.Textarea
  ? TextAreaSettings
  : T extends EntryTypeEnum.Selector
  ? SelectorSettings
  : T extends EntryTypeEnum.Checkbox
  ? CheckSettings
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
