import { AfterViewInit, Directive, ElementRef, inject, input, OnChanges } from '@angular/core';
import { v4 } from 'uuid';
@Directive({ selector: '[slideInOut]' })
export class SlideInOutDirective implements OnChanges, AfterViewInit {
  slideInOut = input('slideInOut');
  visible = input<boolean>(true);
  duration = input<number>(10000);

  private animationId = v4();
  private el = inject(ElementRef<HTMLElement>);
  private style = document.createElement('style');
  private steps = {
    animation: '',
    inStart: '',
    inEnd: '',
    outStart: '',
    outEnd: '',
  };
  private firstChange = true;

  ngOnChanges() {
    if (this.firstChange) {
      this.firstChange = false;
      return;
    }
    const element = this.el.nativeElement as HTMLElement;
    if (this.visible()) {
      let previousElement = this.el.nativeElement.parentElement;
      previousElement.prepend(this.style);
      element.classList.add(this.steps.inStart);
      setTimeout(() => {
        element.classList.add(this.steps.animation);
        element.classList.add(this.steps.inEnd);
        element.classList.remove(this.steps.inStart);
      });
      setTimeout(() => {
        element.classList.remove(this.steps.animation);
        element.classList.remove(this.steps.inEnd);
      }, this.duration());

      console.log(element);
    } else {
      element.classList.add(this.steps.outStart);
      setTimeout(() => {
        element.classList.add(this.steps.animation);
        element.classList.add(this.steps.outEnd);
        element.classList.remove(this.steps.outStart);
      });
      setTimeout(() => {
        element.classList.remove(this.steps.animation);
        element.classList.remove(this.steps.outEnd);
      }, this.duration());
    }
  }

  ngAfterViewInit(): void {
    this.steps = Object.fromEntries(Object.entries(this.steps).map(([key]) => [key, `.${key}-${this.animationId}`])) as typeof this.steps;

    this.style.setAttribute('id', this.animationId);
    this.style.innerHTML = `
      ${this.steps.animation} {
        transition: height ${this.duration()}ms, opacity ${this.duration()}ms;
      }
      ${this.steps.inStart} {
        max-height: ${this.el.nativeElement.style.height / 16 + 'rem'};
        opacity: 1;
        overflow: hidden;
      }
      ${this.steps.inEnd} {
        height: 0;
        opacity: 0;
      }
      ${this.steps.outStart} {
        height: 0;
        opacity: 0;
        overflow: hidden;
      }
      ${this.steps.outEnd} {
        max-height: ${this.el.nativeElement.style.scrollHeight / 16 + 'rem'}
      }
    `;
  }
}
