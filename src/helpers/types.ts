import { FormControl } from '@angular/forms';
import { IconEnum } from './enum';

export type actionButton = {
  id: string;
  label: string;
  action: () => void;
  keepOpenOnClick?: boolean;
};

export type Option = actionButton & { icon?: IconEnum };

export type Position = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};

export type CustomFormControl = FormControl<string> & {
  metadata: Partial<TextFieldMetaData>;
};

export type TextFieldMetaData = {
  label: string;
  type: string;
  prefix: IconEnum;
  sufix: IconEnum;
  helpText: string;
  formName: string;
};
