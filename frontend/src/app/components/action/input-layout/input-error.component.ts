/*
import { Component, computed, ElementRef, input, OnInit, output, signal, viewChild } from '@angular/core';
import { IconEnum, InputState } from '../../../../helpers/enum';
import { IconComponent } from '../../icons/icon.component';
import { InputStatus, Validator } from './input.types';

let uid = 0;

@Component({
  selector: 'input-layout',
  imports: [IconComponent],
  host: {
    class: 'input-layout',
    '[class]': '[type(), status()]',
    '[class.prefix]': 'prefix()',
    '[class.sufix]': 'sufix()',
  },
  templateUrl: './input.layout.component.html',
  styleUrls: ['./input.layout.component.scss', './input-override.scss'],
})
export class InputLayoutComponent implements OnInit {
  protected InputState = InputState;
  private readonly inputContainer = viewChild<ElementRef<HTMLElement>>('inputContainer');

  id = input(`input-${uid++}`);
  type = input<string>('text');
  contextMessage = input<string>('');
  label = input<string>('');
  prefix = input<IconEnum | string>();
  sufix = input<IconEnum | string>();
  validators = input<Validator[]>([]);

  statusUpdate = output<InputStatus>();

  protected status = signal<InputStatus>('default');
  contextText = computed<string>(() => this._errorString() ?? this.contextMessage());

  private _errorString = computed<string>(() => {
    const error = this.validators().reduce((acc, fn) => {
      if (acc) return acc;
      const val = this._value();
      if (val && fn(val)) acc = fn(val)!;
      return acc;
    }, '');
    console.log(error);
    return error;
  });

  private _value = computed(() => {
    return this.inputContainer()?.nativeElement.getElementsByTagName('input')?.[0]?.value;
  });
  isIcon(fix: unknown) {
    if (Object.values(IconEnum).find(v => v === fix)) {
      return fix as IconEnum;
    }
    return null;
  }

  constructor() {}

  ngOnInit(): void {
    const container = this.inputContainer();
    const input = container?.nativeElement.getElementsByTagName('input')?.[0];

    if (input) {
      input.setAttribute('id', this.id());
      let styles = '';
      if (this.sufix()) styles += 'padding-right: var(--height-input)';
      if (this.prefix()) styles += 'padding-left: var(--height-input)';
      input.setAttribute('style', styles);
    }
    console.dir(input);
  }
}
*/
