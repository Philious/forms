import { EntryTypeEnum, Settings } from '@cs-forms/shared';
import { OptionProps } from '@src/app/components/action/aria-drop.component';
import { spreadTranslation } from '@src/helpers/form.utils';

export const answerOptions: OptionProps<EntryTypeEnum>[] = [
  { label: () => 'Barometer', value: EntryTypeEnum.Barometer },
  { label: () => 'Checkgroup', value: EntryTypeEnum.CheckboxGroup },
  { label: () => 'Date field', value: EntryTypeEnum.Date },
  { label: () => 'Number field', value: EntryTypeEnum.Number },
  { label: () => 'Radiogroup', value: EntryTypeEnum.RadioGroup },
  { label: () => 'Selector', value: EntryTypeEnum.Selector },
  { label: () => 'Text field', value: EntryTypeEnum.Text },
  { label: () => 'Textarea field', value: EntryTypeEnum.Textarea },
  { label: () => 'Text', value: EntryTypeEnum.TextString },
];

export const initialSettings: {
  [K in EntryTypeEnum]: Settings<K>;
} = {
  [EntryTypeEnum.Barometer]: {
    value: '',
  },
  [EntryTypeEnum.CheckboxGroup]: {
    options: [],
  },
  [EntryTypeEnum.Date]: {
    value: 0,
  },
  [EntryTypeEnum.Number]: {
    value: 0,
  },
  [EntryTypeEnum.RadioGroup]: {
    options: [
      { label: spreadTranslation({ 'sv-SE': 'Ja', 'nb-NO': 'Grejt', 'en-US': 'Yes' }, 'general.yes'), value: 1 },
      { label: spreadTranslation({ 'sv-SE': 'Nej', 'nb-NO': 'Naij', 'en-US': 'No' }, 'general.yes'), value: 2 },
    ],
  },
  [EntryTypeEnum.Selector]: {
    options: [],
  },
  [EntryTypeEnum.Text]: {
    value: '',
  },
  [EntryTypeEnum.TextString]: {
    typographyType: 'h3',
    value: '',
  },
  [EntryTypeEnum.Textarea]: {
    value: '',
  },
};

export type SettingsMap = {
  [K in keyof typeof initialSettings]: (typeof initialSettings)[K];
};

export type KeyMap<T> = {
  [K in keyof T]: T[K];
};
