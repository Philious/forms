import { Component, computed, effect, model, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'test-page',
  imports: [FormsModule],
  template: `
    <div class="container">
      <fieldset (change)="updatePanning($event)" class="radio-group control">
        <legend>L/R</legend>
        <div class="control"><input name="speakers" type="radio" value="0" id="both" checked />Both</div>
        <div class="control"><input name="speakers" type="radio" value="-1" id="left" />Left</div>
        <div class="control"><input name="speakers" type="radio" value="1" id="right" />Right</div>
      </fieldset>
      <div class="control-group">
        <div class="control">
          <label>Volume</label>
          <input type="range" min="0" max="1" step="0.01" [(ngModel)]="vol" (input)="updateVol()" (keydown)="moveFrq($event)" /><span
            class="number"
            >{{ volPerc() }}</span
          >
        </div>
        <div class="control">
          <label for="frq">Frequency</label>
          <input
            type="range"
            list="pan-vals"
            step="1"
            min="250"
            max="8000"
            [(ngModel)]="frq"
            (change)="onBlur($event)"
            name="frq"
            step="range"
          /><span class="number">{{ frq() }}</span>
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

      <div class="actions">
        <button (click)="start()">Start</button>
        <button (click)="stop()">Stop</button>
      </div>
    </div>
  `,
  styles: `
    :host {
      flex: 1;
      align-content: center;
    }
    .container {
      display: grid;
      gap: 3rem;
      grid-template-columns: 10rem 20rem;
      margin: auto;
      place-content: center;
    }
    .radio-group {
      display: grid;
      gap: 0.5rem;
      border-radius: 4px;
      padding: 1rem;
    }
    .control-group {
      display: grid;

      gap: 1rem;
      .control {
        position: relative;
        display: grid;
        grid-template-columns: 1fr 2.25rem;
        gap: 0rem 0.5rem;
        label {
          grid-area: 1 /1 /2 /3;
        }
      }
    }
    .actions {
      width: 100%;
      display: flex;
      gap: 1rem;
    }
    .control {
      gap: 0.5rem;
    }

    .number {
      text-align: right;
    }
  `,
})
export class TestPageComponent implements OnInit, OnDestroy {
  frq = model<number>(440);
  vol = model<number>(1);
  volPerc = computed(() => `${Math.round(this.vol() * 100)}%`);
  pan = model<number>(0);

  audioCtx = new AudioContext();
  gainModule = new GainNode(this.audioCtx);
  panModule = new StereoPannerNode(this.audioCtx);
  oscModule = new OscillatorNode(this.audioCtx);

  protected start = () => {
    console.log(this.audioCtx.state);
    this.audioCtx.resume();
  };
  protected stop = () => {
    console.log(this.audioCtx.state);
    this.audioCtx.suspend();
  };

  protected updateVol() {
    this.gainModule.gain.value = this.vol();
  }

  protected updatePanning(event: Event) {
    this.panModule.pan.value = parseInt((event.target as HTMLInputElement).value);
    console.log(this.panModule.pan.value);
  }
  private easeOutCubic(x: number): number {
    return 1 - Math.pow(1 - x, 3);
  }
  protected onBlur(event: Event) {
    console.log(event);
    const frqs = [250, 500, 1000, 2000, 4000, 8000];
    const cFrq = this.frq();
    const idx = frqs.findIndex(frq => frq >= cFrq);

    const min = frqs[idx - 1] - cFrq;
    const max = frqs[idx] - cFrq;
    const x = Math.abs(min) < max ? min : max;

    const animate = (dx: number) => {
      const acc = Math.abs(this.easeOutCubic(dx / x));
      console.log(acc);
      if (Math.abs(acc) < 1) {
        setTimeout(() => {
          this.frq.update(() => Math.round(cFrq + acc * x));
          animate(acc * x);
        }, 10);
      }
    };

    animate(1);
  }
  protected moveFrq(event: Event) {
    const key = (event as KeyboardEvent).key;
    console.log(key);
  }
  constructor() {
    this.gainModule.gain.setValueAtTime(this.vol(), this.audioCtx.currentTime);
    this.oscModule.type = 'sine';
    this.oscModule.frequency.setValueAtTime(this.frq(), this.audioCtx.currentTime); // value in hertz
    this.oscModule.connect(this.gainModule).connect(this.panModule).connect(this.audioCtx.destination);
    effect(() => {
      this.oscModule.frequency.setValueAtTime(this.frq(), this.audioCtx.currentTime);
    });
  }

  ngOnInit(): void {
    this.oscModule.start();
    this.audioCtx.suspend();
  }
  ngOnDestroy(): void {
    this.oscModule.stop();
  }
}
