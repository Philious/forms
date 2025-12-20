import { EntryTypeEnum } from './types.js';
export type Expand<T> = T extends infer O ? {
    [K in keyof O]: O[K];
} : never;
export type ExpandRecursively<T> = T extends object ? (T extends infer O ? {
    [K in keyof O]: ExpandRecursively<O[K]>;
} : never) : T;
export declare enum Locale {
    EN = "en-US",
    NB = "nb-NO",
    SE = "sv-SE",
    XX = "translationKey"
}
export type Translation = Record<Locale, string>;
export type FormId = string;
export type PageId = string;
export type DivisionId = string;
export type EntryId = string;
export type TextType = 'h2' | 'h3' | 'h4' | 'paragraph';
export type Form<T extends 'set' | 'array' = 'array'> = {
    id: FormId;
    header: Translation;
    pages: T extends 'set' ? Set<PageId> : Array<PageId>;
    divisions: T extends 'set' ? Set<DivisionId> : Array<DivisionId>;
    entries: T extends 'set' ? Set<EntryId> : Array<EntryId>;
    updated: number;
};
export type Page<T extends 'set' | 'array' = 'array'> = {
    id: PageId;
    header: Translation;
    divisions: T extends 'set' ? Set<DivisionId> : Array<DivisionId>;
    entries: T extends 'set' ? Set<EntryId> : Array<EntryId>;
    updated: number;
};
export type Division<T extends 'set' | 'array' = 'array'> = {
    id: DivisionId;
    header: Translation;
    entries: T extends 'set' ? Set<EntryId> : Array<EntryId>;
    updated: number;
};
export type ExtendedEntries = Expand<EntryTypeEnum>;
export type Entry<T extends EntryTypeEnum = EntryTypeEnum> = {
    id: EntryId;
    type: T;
    translations: Translation;
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
export type ExEntry = Expand<Barometer | Text | Number | Date | TextArea | Selector | Check | CheckGroup | CheckGroup | RadioGroup | Texts>;
export type Option<T extends unknown = string> = {
    label: string;
    value: T;
};
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
export type Check = {
    translation: Translation;
    selected: boolean;
};
export type CheckGroupSettings = {
    selected: string[];
    checks: Check[];
};
export type RadioGroupSettings = {
    selected: string;
    options: Option[];
};
export type TextStringSettings = {
    typographyType?: TextType;
};
export type Settings<T extends EntryTypeEnum> = T extends 'barometer' ? BarometerSettings : T extends EntryTypeEnum.Text ? TextSettings : T extends EntryTypeEnum.Number ? NumberSettings : T extends EntryTypeEnum.Number ? DateSettings : T extends EntryTypeEnum.Textarea ? TextAreaSettings : T extends EntryTypeEnum.Selector ? SelectorSettings : T extends EntryTypeEnum.CheckboxGroup ? CheckGroupSettings : T extends EntryTypeEnum.RadioGroup ? RadioGroupSettings : TextStringSettings;
export type Operator = 'and' | 'or' | 'xand' | 'xor';
export type ConditionSymbol = '==' | '!=' | '<=' | '>=' | '<' | '>';
export type Condition = [EntryId, ConditionSymbol, unknown];
export type ExtendedCondition = {
    [K in Operator]: ExtendedCondition | Condition[];
};
