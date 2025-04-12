import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';
@Directive({
  selector: '[slim]',
  standalone: true,
})
export class SlimDirective implements AfterViewInit {
  private element = inject(ElementRef) as ElementRef<HTMLElement>;

  ngAfterViewInit() {
    const els = [
      this.element.nativeElement.getElementsByClassName('input-wrapper')[0],
      this.element.nativeElement.getElementsByTagName('input')[0],
    ] as (HTMLElement | null)[];
    els.forEach((el) => {
      if (el) el.style.height = '2rem';
    });
  }
}
