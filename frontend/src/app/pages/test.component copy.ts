import { Component, computed, model, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { genSound, percentToDecibels, playTone } from 'src/helpers/audio.utils';
import { animateValue, decimals } from 'src/helpers/utils';
import { InputLayoutComponent } from '../components/action/input-layout/input.layout.component';
import { SwitchComponent } from '../components/action/switch.component';

const frqs = [250, 500, 1000, 2000, 4000, 8000];
const animationSpeed = 10;

@Component({
  selector: 'test-page',
  imports: [FormsModule, SwitchComponent, InputLayoutComponent],
  template: `
    <div class="container">
      <form class="radio-group control group-layout pan">
        <legend>L/R</legend>
        <label class="control"><input name="speakers" type="radio" value="0" id="both" [(ngModel)]="pan" checked />Both</label>
        <label class="control"><input name="speakers" type="radio" value="-1" id="left" [(ngModel)]="pan" />Left</label>
        <label class="control"><input name="speakers" type="radio" value="1" id="right" [(ngModel)]="pan" />Right</label>
      </form>
      <div class="control-group sld">
        <div class="group-layout db">
          <div>
            <div class="row">
              <switch slim flex [label]="'Set max decibels'" [(active)]="useDecibels" />
            </div>
            @if (useDecibels()) {
              <input-layout
                animate.enter="default-enter"
                animate.leave="default-leave"
                slim
                [label]="'Max Decibel output'"
                class="default-animation"
                [sufix]="'dB'"
              >
                <input slim type="number" min="0" max="90" step="1" [(ngModel)]="maxdB" />
              </input-layout>
            }
          </div>
        </div>
        <div class="control group-layout vol">
          <label>Volume</label>
          <input type="range" min="0" max="1" [step]="useDecibels() ? 0.00001 : 0.01" [(ngModel)]="vol" />
          <span class="number">{{ volMeter() }}</span>
        </div>
        <div class="control group-layout frq">
          <label for="frq">Frequency</label>
          <input
            type="range"
            list="pan-vals"
            step="1"
            min="250"
            max="8000"
            [(ngModel)]="frq"
            (ngModelChange)="frequencyUpdate($event)"
            (pointerup)="onBlur()"
            (keyup)="onKeyup($event)"
            name="frq"
            step="range"
          /><span class="number">{{ frq() }} Hz</span>
          <datalist id="pan-vals">
            <option value="250" label="250"></option>
            <option value="500" label="500"></option>
            <option value="1000" label="1000"></option>
            <option value="2000" label="2000"></option>
            <option value="4000" label="4000"></option>
            <option value="8000" label="8000"></option>
          </datalist>
        </div>
      </div>

      <div class="actions act">
        <div class="diod" [class.on]="soundOn()"></div>
        <button btn text-btn (click)="play()">Start</button>
        <button btn text-btn (click)="sound.stop()">Stop</button>
      </div>
    </div>
  `,
  styles: `
    :host {
      flex: 1;
      align-content: center;
    }
    .row {
      display: flex;
    }
    .flex {
      flex: 1;
    }
    label {
      font-size: 0.875rem;
    }
    .container {
      display: grid;
      gap: 1rem;
      grid-template-columns: 10rem 30rem;
      margin: auto;
      place-content: center;
      .pan {
        grid-area: 1 / 1 / 3 / 2;
      }
      .sld {
        display: contents;
      }
      .act {
        grid-area: 3 / 1 / 4 / 2;
      }
    }
    .radio-group {
      display: grid;
      margin: 0;
    }
    .group-layout {
      padding: 0.5rem;
      box-sizing: border-box;
      border-radius: 0.25rem;
      border: none;
      font-size: 0.875rem;
      box-shadow: 0 0 0 0.0625rem var(--n-200);
    }
    .control-group {
      display: grid;
      gap: 1rem;
      .control {
        position: relative;
        display: grid;
        grid-template-columns: 1fr 3.5rem;

        gap: 0rem 0.5rem;
        label {
          grid-area: 1 /1 /2 /3;
        }
      }
    }
    .actions {
      width: 100%;
      display: flex;
      align-items: center;
      padding: 0.5rem;
      gap: 1rem;
    }
    .control {
      gap: 0.5rem;
    }
    .number {
      text-align: right;
      white-space: nowrap;
    }
    .diod {
      &.on {
        transition: box-shadow 0s;
        box-shadow:
          0 0 0px 0.5px hsl(150, 100%, 15%),
          -0.5px -1px 0.5px 0.25px hsl(150, 10%, 100%),
          0 -0.1px 0px 1px hsl(150, 10%, 65%),
          0 0 2px 0.5px inset hsl(150, 100%, 20%),
          -1px -1px 0.5px 3.25px inset hsl(150, 100%, 66%),
          0 0 0px 7px inset hsl(150, 100%, 100%),
          0 0 4px hsl(150, 100%, 66%),
          0 0 8px hsl(150, 100%, 66%),
          0 0 16px hsl(150, 100%, 66%),
          0 0 24px hsl(150, 100%, 66%);
      }

      width: 0.75rem;
      height: 0.75rem;
      border-radius: 50%;
      box-shadow:
        0 0 0px 0.5px hsl(150, 100%, 0%),
        -0.5px -1px 0.5px 0.25px hsl(150, 10%, 55%),
        0 -0.1px 0px 1px hsl(150, 10%, 35%),
        0 0 2px 2px inset hsl(150, 100%, 5%),
        -1px -1px 1px 5px inset hsl(150, 100%, 16%),
        0 0 0px 7px inset hsl(150, 100%, 90%);
      transition: box-shadow 0.15s;
    }
  `,
})
export class TestPageComponent implements OnDestroy {
  frq = model<number>(440); // value in hertz
  vol = model<number>(0.1); // value 0-1
  pan = model<number>(0); // value -1-(1)

  soundOn = signal<boolean>(false);
  useDecibels = model<boolean>(false);
  maxdB = model<number | null>(null);

  keyboardAnimation = signal<boolean>(false);

  quintGain = computed(() => this.vol() ** 3);

  volMeter = computed(() =>
    this.useDecibels()
      ? `${this.maxdB() ? Math.round(percentToDecibels(this.quintGain() * 100, this.maxdB()!) * 10) / 10 : '- '} dB`
      : `${
          this.vol() < 0.25
            ? decimals(this.quintGain() * 100, 2)
            : this.vol() < 0.5
              ? decimals(this.quintGain() * 100, 1)
              : Math.round(this.quintGain() * 100)
        } %`
  );

  protected sound = genSound({
    frequency: this.frq(),
    frqType: 'sine',
    durationMs: 1000,
    gainDb: this.quintGain(),
    pan: this.pan(),
  });

  protected play() {
    if (!this.maxdB() && this.useDecibels()) return;
    this.soundOn.set(true);
    playTone(this.frq(), 1000, this.quintGain(), this.pan(), () => this.soundOn.set(false));
  }

  protected onKeyup(event: Event) {
    this.animation = null;
    const key = (event as KeyboardEvent).key;

    if (!['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(key)) return;
    this.keyboardAnimation.set(true);
    const value = parseInt((event.target as HTMLInputElement).value);
    const start = Math.round(value / 10) * 10;
    const startIdx = frqs.findIndex(frq => start === frq);
    let end = start;

    if (key === 'ArrowUp') {
      end = frqs[frqs.length - 1];
    } else if (key === 'ArrowRight') {
      end = frqs[startIdx === frqs.length - 1 ? startIdx : startIdx + 1];
    } else if (key === 'ArrowDown') {
      end = frqs[0];
    } else if (key === 'ArrowLeft') {
      end = frqs[startIdx === 0 ? startIdx : startIdx - 1];
    }

    if (start === end) return;

    this.animation = animateValue(
      start,
      end,
      animationSpeed,
      (v: number) => this.frq.set(v),
      this.easeOutCubic,
      () => this.keyboardAnimation.set(false)
    );
  }

  protected onBlur() {
    this.animation = null;
    if (this.keyboardAnimation()) return;

    const start = this.frq();
    const idx = frqs.findIndex(frq => frq >= start);
    const min = frqs[idx - 1] - start;
    const max = frqs[idx] - start;
    const end = Math.abs(min) < max ? frqs[idx - 1] : frqs[idx];

    this.animation = animateValue(start, end, animationSpeed, (v: number) => this.frq.set(v), this.easeOutCubic);
  }

  protected frequencyUpdate(value: number) {
    this.frq.set(value);
    this.sound.frequency(value);
  }

  protected animation: Promise<void> | null = null;

  private easeOutCubic(x: number): number {
    return 1 - Math.pow(1 - x, 3);
  }

  ngOnDestroy(): void {
    this.sound.stop();
  }
}
