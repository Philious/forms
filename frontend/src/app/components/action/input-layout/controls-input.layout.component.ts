import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, OnInit, TemplateRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { DefaultErrorMessages } from '@src/app/components/action/input-layout/input.types';
import { errorMessages } from '@src/app/components/action/input-layout/input.utils';
import { IconComponent } from '@src/app/components/icons/icon.component';
import { IconEnum } from '@src/helpers/enum';

let uid = 0;

@Component({
  selector: 'control-input-layout',
  imports: [IconComponent, NgTemplateOutlet],
  host: {
    class: 'input-layout',
    '[class]': '[type()]',
    '[class.prefix]': 'prefix()',
    '[class.sufix]': 'sufix()',
    '[class.disabled]': 'control().disabled',
    '[class.error]': 'this.control().invalid && this.control().touched',
  },
  templateUrl: './input.layout.component.html',
  styleUrls: ['./input.layout.component.scss', './input-override.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlInputLayoutComponent implements OnInit {
  // private readonly inputContainer = viewChild<ElementRef<HTMLElement>>('inputContainer');

  id = input(`input-${uid++}`);
  type = input<string>('text');
  label = input<string | TemplateRef<HTMLElement>>();
  labelElement = input<TemplateRef<HTMLElement>>();
  prefix = input<IconEnum | string>();
  sufix = input<IconEnum | string>();
  showLabel = input<boolean>(true);

  control = input<FormControl>(new FormControl());
  controlElement = input<HTMLInputElement>();

  errorMessages = input<DefaultErrorMessages, Partial<DefaultErrorMessages>>(errorMessages, {
    transform: messages => ({ ...errorMessages, ...messages }),
  });
  contextMessage = input<string>('');

  valueChanges = toSignal(this.control().valueChanges);

  errorMessage = computed(() => {
    this.valueChanges();
    const errors = this.control().errors;

    if (errors) {
      const error = Object.keys(errors).shift() as keyof DefaultErrorMessages;
      return this.errorMessages()[error];
    } else {
      return null;
    }
  });

  isIcon(fix: unknown) {
    return Object.values(IconEnum).find(v => v === fix) ? (fix as IconEnum) : null;
  }
  isString(key: unknown): boolean {
    return typeof key === 'string';
  }
  constructor() {}

  ngOnInit(): void {
    const input = this.controlElement();
    if (input) {
      input.setAttribute('id', this.id());
      let styles = '';
      if (this.sufix()) styles += 'padding-right: var(--height-input)';
      if (this.prefix()) styles += 'padding-left: var(--height-input)';
      input.setAttribute('style', styles);
    }
  }
}
