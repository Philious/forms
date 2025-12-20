import { ChangeDetectionStrategy, Component, computed, input, model, OnInit } from '@angular/core';
import { ErrorMessages } from '@src/app/components/action/input-layout/input.types';
import { errorMessages } from '@src/app/components/action/input-layout/input.utils';
import { IconComponent } from '@src/app/components/icons/icon.component';
import { IconEnum } from '@src/helpers/enum';

let uid = 0;

@Component({
  selector: 'signal-input-layout',
  imports: [IconComponent],
  host: {
    class: 'input-layout',
    '[class]': '[type()]',
    '[class.prefix]': 'prefix()',
    '[class.sufix]': 'sufix()',
    '[class.disabled]': 'disabled()',
    '[class.error]': 'errors()',
  },
  templateUrl: './input.layout.component.html',
  styleUrls: ['./input.layout.component.scss', './input-override.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalInputLayoutComponent<T extends 'text' | 'number'> implements OnInit {
  id = input(`input-${uid++}`);
  type = input.required<T>();
  label = input<string>('');
  prefix = input<IconEnum | string>();
  sufix = input<IconEnum | string>();
  disabled = input<boolean>(false);
  errors = input<boolean>(false);
  showLabel = input<boolean>(true);

  inputElement = input<HTMLInputElement>();
  valueChanges = model<T extends 'text' ? string : T extends 'number' ? number : never>();
  errorMessages = input<ErrorMessages, Partial<ErrorMessages>>(errorMessages, {
    transform: messages => ({ ...errorMessages, ...messages }),
  });
  contextMessage = input<string>('');

  errorMessage = computed(() => {
    const errors = this.errors();

    if (errors) {
      const error = Object.keys(errors).shift() as keyof ErrorMessages;
      return this.errorMessages()[error];
    } else {
      return null;
    }
  });

  isIcon(fix: unknown) {
    return Object.values(IconEnum).find(v => v === fix) ? (fix as IconEnum) : null;
  }

  constructor() {}

  ngOnInit(): void {
    const input = this.inputElement();
    if (input) {
      input.setAttribute('id', this.id());
      let styles = '';
      if (this.sufix()) styles += 'padding-right: var(--height-input)';
      if (this.prefix()) styles += 'padding-left: var(--height-input)';
      input.setAttribute('style', styles);
    }
  }
}
