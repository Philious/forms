import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, computed, input, linkedSignal, model, Signal, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonStyleEnum, IconEnum } from 'src/helpers/enum';
import { TextFieldComponent } from '../../../components/action/textfield.component';

type BarometerType = 'linear' | 'inverted-linear' | 'catenary' | 'inverted-catenary';

@Component({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DialogModule, TextFieldComponent],
  selector: 'answer-barometer',
  template: `
    <div class="row">
      <button (click)="modeSwitch()" class="toggle-state" [title]="this.state().value()">
        <svg viewBox="0 0 24 24" class="toggle-state-icon">
          <path [class]="state().value()" class="path" />
        </svg>
      </button>
      <div class="range" [class]="this.state().value()">
        <div class="color-range first-end" [style.width.%]="firstPerc()"></div>
        <div class="color-range middle-start" [style.width.%]="firstWarningPerc()"></div>
        <div class="color-range middle-end" [style.width.%]="middlePerc()"></div>
        @if (!linear()) {
          <div class="color-range last-start" [style.width.%]="secondWarningPerc()"></div>
          <div class="color-range last-end" [style.width.%]="lastPerc()"></div>
        }
      </div>
    </div>
    <div class="values">
      <div class="row">
        <text-field
          slim
          class="text"
          [type]="'number'"
          [modelValue]="firstEndModel()"
          [align]="'right'"
          (change)="enforceOrder(0, $event)"
          (modelValueChange)="enforceOrder(0)"
          [step]="step()"
          [min]="min()"
          [max]="max()"
        />
        <input class="range-input" type="range" [min]="min()" [max]="max()" [value]="firstEnd()" (input)="enforceOrder(0, $event)" [step]="step()" />
      </div>
      <div class="row">
        <text-field
          slim
          class="text"
          [type]="'number'"
          [modelValue]="middleStartModel()"
          (change)="enforceOrder(1, $event)"
          (modelValueChange)="enforceOrder(1)"
          [align]="'right'"
          [step]="step()"
          [min]="min()"
          [max]="max()"
        />
        <input
          class="range-input"
          type="range"
          [min]="min()"
          [max]="max()"
          [value]="middleStart()"
          (input)="enforceOrder(1, $event)"
          [step]="step()"
        />
      </div>

      <div class="row" [class.hide]="linear()">
        <text-field
          slim
          class="text"
          [type]="'number'"
          [modelValue]="middleEndModel()"
          (change)="enforceOrder(2, $event)"
          (modelValueChange)="enforceOrder(2)"
          [align]="'right'"
          [step]="step()"
          [min]="min()"
          [max]="max()"
        />
        <input class="range-input" type="range" [min]="min()" [max]="max()" [value]="middleEnd()" (input)="enforceOrder(2, $event)" [step]="step()" />
      </div>
      <div class="row" [class.hide]="linear()">
        <text-field
          slim
          class="text"
          [type]="'number'"
          [align]="'right'"
          [modelValue]="lastStartModel()"
          (change)="enforceOrder(3, $event)"
          (modelValueChange)="enforceOrder(3)"
          [step]="step()"
          [min]="min()"
          [max]="max()"
        />
        <input class="range-input" type="range" [min]="min()" [max]="max()" [value]="lastStart()" (input)="enforceOrder(3, $event)" [step]="step()" />
      </div>
    </div>
  `,
  styles: `
    :host {
      display: grid;
      gap: 1.5rem;
    }
    .toggle-state {
      background-color: var(--n-100);
      border: none;
      box-shadow: 0 0 0 1px hsla(0, 0%, 50%, 1) inset;
      border-radius: 0.25rem;
      cursor: pointer;
      width: 1.5rem;
      height: 1.5rem;
      padding: 0;
      overflow: hidden;
      &:hover {
        background-color: var(--n-200);
      }
      .toggle-state-icon {
        width: 1.5rem;
        height: 1.5rem;
      }
      .path {
        stroke: var(--n-500);
        fill: transparent;
      }
      .linear {
        d: path('M0 24 Q 12 12 24 0');
      }
      .inverted-linear {
        d: path('M0 0 Q 12 12 24 24');
      }
      .catenary {
        d: path('M0 24 Q 12 -12 24 24');
      }
      .inverted-catenary {
        d: path('M0 0 Q 12 36 24 0');
      }
    }
    .values .row {
      height: 3rem;
      transform-origin: center top;
      transition:
        opacity 0.25s,
        height 0.25s cubic-bezier(0.22, 1, 0.36, 1),
        transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
      &.hide {
        opacity: 0;
        height: 0;
        transform: scaleY(0);
      }
    }
    .row {
      display: flex;
      gap: 1rem;
      // align-items: center;
      overflow: hidden;
      opacity: 1;
      transform: scaleY(1);
    }
    .text {
      flex-basis: 4rem;
      min-width: 4rem;
      height: 1.5rem;
      font-size: 0.75rem;
    }
    .range-input {
      flex: 1;
      height: 1.5rem;
      margin: 0;
    }
    .range {
      width: 100%;
      height: 0.5rem;
      flex: 1;
      border-radius: 0.25rem;
      overflow: hidden;
      display: flex;
      gap: 1px;
      position: relative;

      &.linear .first-end,
      &.inverted-linear .middle-end,
      &.catenary .first-end,
      &.catenary .last-end,
      &.inverted-catenary .middle-end {
        background-color: red;
      }
      &.linear .middle-end,
      &.inverted-linear .first-end,
      &.catenary .middle-end,
      &.inverted-catenary .first-end,
      &.inverted-catenary .last-end {
        background-color: green;
      }
      .middle-start,
      .last-start {
        background-color: orange;
      }

      .slider {
        width: 1rem;
        height: 1rem;
        cursor: pointer;
        position: absolute;
        box-shadow: 0 0 1px 1px var(--n-400);
        &:hover {
          background-color: var(--n-400);
        }
      }
    }
    input[type='range' i]::-webkit-slider-thumb {
      height: 4rem;
      -webkit-user-modify: read-write !important;
    }
  `,
})
export class BarometerComponent {
  IconEnum = IconEnum;
  ButtonStyleEnum = ButtonStyleEnum;

  type = input<BarometerType>('linear');
  initialValues = input<[number, number, number, number]>();

  min = input<number>(0);
  max = input<number>(0);

  step = input<number | 'any'>(0.1);

  calcRange(min: number, max: number, divisions: number, step: number, init?: number) {
    return init ?? ((max - min) / divisions) * step + min;
  }

  calcPerc(min: number, max: number, val: number) {
    const perc = Math.abs((val / (max - min)) * 100);
    return perc;
  }

  linear = computed(() => this.state().value() === 'linear' || this.state().value() === 'inverted-linear');

  firstEndModel = model<number>(this.calcRange(this.min(), this.max(), 5, 1, this.initialValues()?.[0]));
  middleStartModel = model<number>(this.calcRange(this.min(), this.max(), 5, 2, this.initialValues()?.[1]));
  middleEndModel = model<number>(this.calcRange(this.min(), this.max(), 5, 3, this.initialValues()?.[2]));
  lastStartModel = model<number>(this.calcRange(this.min(), this.max(), 5, 4, this.initialValues()?.[3]));

  firstEnd = linkedSignal<number>(() => this.firstEndModel());
  middleStart = linkedSignal<number>(() => this.middleStartModel());
  middleEnd = linkedSignal<number>(() => (this.linear() ? this.max() : this.middleEndModel()));
  lastStart = linkedSignal<number>(() => (this.linear() ? this.max() : this.lastStartModel()));

  firstPerc = computed(() => this.calcPerc(this.min(), this.max(), this.firstEnd() - this.min()));
  firstWarningPerc = computed(() => this.calcPerc(this.min(), this.max(), this.middleStart() - this.firstEnd()));
  middlePerc = computed(() => this.calcPerc(this.min(), this.max(), this.middleEnd() - this.middleStart()));
  secondWarningPerc = computed(() => this.calcPerc(this.min(), this.max(), this.lastStart() - this.middleEnd()));
  lastPerc = computed(() => this.calcPerc(this.min(), this.max(), this.max() - this.lastStart()));

  modeSwitch() {
    this.state().update();
    [0, 1, 2, 3].forEach(v => this.enforceOrder(v));
  }

  update() {}

  enforceOrder(index: number, ev?: Event): void {
    const result = [this.firstEnd(), this.middleStart(), this.middleEnd(), this.lastStart()];
    if (ev) {
      const value = parseFloat((ev.target as HTMLInputElement).value);
      result[index] = value;
    }
    for (let i = index + 1; i < result.length; i++) result[i] = Math.max(result[i], result[i - 1]);
    for (let i = index - 1; i >= 0; i--) result[i] = Math.min(result[i], result[i + 1]);

    [this.firstEndModel, this.middleStartModel, this.middleEndModel, this.lastStartModel].forEach((point, idx) => {
      point.set(result[idx]);
    });
  }

  state: () => { value: Signal<BarometerType>; update: () => void };

  constructor() {
    this.state = (() => {
      const value = signal(this.type());
      const states: BarometerType[] = ['linear', 'inverted-linear', 'catenary', 'inverted-catenary'];
      const update = () => {
        value.set(states[states.indexOf(value()) < 3 ? states.indexOf(value()) + 1 : 0]);
      };
      return () => ({ value, update });
    })();
    setTimeout(() => {
      this.firstEndModel.set(this.calcRange(this.min(), this.max(), 5, 1, this.initialValues()?.[0]));
      this.middleStartModel.set(this.calcRange(this.min(), this.max(), 5, 2, this.initialValues()?.[1]));
      this.middleEndModel.set(this.calcRange(this.min(), this.max(), 5, 3, this.initialValues()?.[2]));
      this.lastStartModel.set(this.calcRange(this.min(), this.max(), 5, 4, this.initialValues()?.[3]));
    }, 10);
  }
}
