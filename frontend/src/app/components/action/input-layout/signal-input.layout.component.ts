import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, model, OnInit, output, signal, TemplateRef } from '@angular/core';
import { IconComponent } from '@src/app/components/icons/icon.component';
import { IconEnum } from '@src/helpers/enum';
import { Validator } from './input.types';

let uid = 0;

@Component({
  selector: 'signal-input-layout',
  imports: [IconComponent, NgTemplateOutlet],
  host: {
    class: 'input-layout',
    '[class]': '[type()]',
    '[class.prefix]': 'prefix()',
    '[class.sufix]': 'sufix()',
    '[class.disabled]': 'disabled()',
    '[class.error]': 'errorMessage()',
  },
  templateUrl: './input.layout.component.html',
  styleUrls: ['./input.layout.component.scss', './input-override.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalInputLayoutComponent<
  T extends 'text' | 'number',
  S = T extends 'text' ? string : T extends 'number' ? number : never,
> implements OnInit {
  id = input(`input-${uid++}`);
  type = input.required<T>();
  label = input<string>();
  labelElement = input<TemplateRef<HTMLElement>>();
  prefix = input<IconEnum | string>();
  sufix = input<IconEnum | string>();
  disabled = input<boolean>(false);
  validators = input<Validator[]>([]);
  contextMessage = input<string>('');
  inputElement = input<HTMLInputElement>();
  valueChanges = model<S>();
  forceUpdate = model<boolean>(false);

  hasError = output<boolean>();

  touched = signal<boolean>(false);
  writeValue = signal<string>('');
  changed = signal<boolean>(false);

  errorMessage = computed<string | null>(() => {
    const value = this.writeValue();
    const validators = this.validators();
    if (this.changed()) {
      const errors = validators.map(fn => fn(value)).filter(e => e !== null);
      if (errors.length) {
        this.hasError.emit(true);
        return errors.shift() + (errors.length > 0 ? `. And ${errors.length} more.` : '');
      } else this.hasError.emit(false);
    }
    return null;
  });

  isIcon(fix: unknown) {
    return Object.values(IconEnum).find(v => v === fix) ? (fix as IconEnum) : null;
  }

  constructor() {
    effect(() => {
      if (this.forceUpdate()) {
        this.forceUpdate.set(true);
        this.changed();
      }
    });
  }

  ngOnInit(): void {
    const input = this.inputElement();
    if (input) {
      input.setAttribute('id', this.id());
      input.onfocus = () => {
        this.touched.set(true);
      };
      input.oninput = () => {
        this.writeValue.set(input.value);
        this.changed.set(false);
      };
      input.onblur = () => {
        this.changed.set(true);
      };
      let styles = '';
      if (this.sufix()) styles += 'padding-right: var(--height-input)';
      if (this.prefix()) styles += 'padding-left: var(--height-input)';
      input.setAttribute('style', styles);
    }
  }
}
