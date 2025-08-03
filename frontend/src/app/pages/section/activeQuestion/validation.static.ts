import { ValidatorsType } from 'src/helpers/types';
import { Option } from '../../../../helpers/types';

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
