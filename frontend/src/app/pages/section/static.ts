import { AnswerTypeEnum } from '@cs-forms/shared';
import { ValidatorsType } from 'src/helpers/types';
import { Option } from '../../../helpers/types';

export const awnserTypeOptions: Option<AnswerTypeEnum>[] = [
  {
    label: 'Barometer',
    value: AnswerTypeEnum.Barometer,
  },
  {
    label: 'Checkbox group',
    value: AnswerTypeEnum.Checkbox,
  },
  {
    label: 'Date',
    value: AnswerTypeEnum.Date,
  },
  {
    label: 'Dropdown',
    value: AnswerTypeEnum.Dropdown,
  },
  {
    label: 'Number',
    value: AnswerTypeEnum.Number,
  },

  {
    label: 'Radio buttons',
    value: AnswerTypeEnum.RadioButton,
  },
  {
    label: 'Textbox',
    value: AnswerTypeEnum.Text,
  },
  {
    label: 'Textarea',
    value: AnswerTypeEnum.Textarea,
  },
];

export const validatiorOptions: Option<keyof ValidatorsType>[] = [
  { label: 'Minimum', value: 'min' },
  { label: 'Maximum', value: 'max' },
  { label: 'Required', value: 'required' },
  { label: 'True value required', value: 'requiredTrue' },
  { label: 'Email', value: 'email' },
  { label: 'Minimum length', value: 'minLength' },
  { label: 'Maximum length', value: 'maxLength' },
  { label: 'Pattern', value: 'pattern' },
  { label: 'Null validator', value: 'nullValidator' },
];
