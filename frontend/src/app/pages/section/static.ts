import { AnswerTypeEnum } from '@cs-forms/shared';
import { Option } from '../../../helpers/types';

export const awnserTypeOptions: Option<AnswerTypeEnum>[] = [
  {
    label: 'Barometer',
    value: AnswerTypeEnum.Barometer,
  },
  {
    label: 'Checkbox',
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
