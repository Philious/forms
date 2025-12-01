import { AfterContentInit, ChangeDetectionStrategy, Component, computed, input, OnInit, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ErrorMessages } from '@app/app/components/action/input-layout/input.types';
import { errorMessages } from '@app/app/components/action/input-layout/input.utils';
import { IconComponent } from '@app/app/components/icons/icon.component';
import { IconEnum } from '@app/helpers/enum';

let uid = 0;

@Component({
  selector: 'input-layout',
  imports: [IconComponent],
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
export class InputLayoutComponent implements OnInit, AfterContentInit {
  // private readonly inputContainer = viewChild<ElementRef<HTMLElement>>('inputContainer');

  id = input(`input-${uid++}`);
  type = input<string>('text');
  label = input<string>('');
  prefix = input<IconEnum | string>();
  sufix = input<IconEnum | string>();

  control = input<FormControl>(new FormControl());
  controlElement = input<HTMLInputElement>();

  errorMessages = input<ErrorMessages, Partial<ErrorMessages>>(errorMessages, {
    transform: messages => ({ ...errorMessages, ...messages }),
  });
  contextMessage = input<string>('');

  valueUpdate = signal(0);

  errorMessage = computed(() => {
    this.valueUpdate();
    const errors = this.control().errors;

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
    this.control().valueChanges.forEach(() => {
      this.valueUpdate.update(val => val + 1);
      console.log('ngOnInit', this.valueUpdate());
    });
    const input = this.controlElement();
    if (input) {
      input.setAttribute('id', this.id());
      let styles = '';
      if (this.sufix()) styles += 'padding-right: var(--height-input)';
      if (this.prefix()) styles += 'padding-left: var(--height-input)';
      input.setAttribute('style', styles);
    }
  }
  ngAfterContentInit(): void {
    console.dir(this.controlElement());
  }
}
