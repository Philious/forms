import { Directive, inject, input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[toggle]' })
export class ToggleDirective {
  templateRef = inject(TemplateRef<HTMLElement>);
  viewContainer = inject(ViewContainerRef);

  toggle = input<boolean, boolean>(false, {
    transform: val => {
      console.log(val);
      if (val) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
      return val;
    },
  });
}
