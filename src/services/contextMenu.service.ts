import { Injectable, ApplicationRef, ComponentRef, createComponent, EnvironmentInjector } from '@angular/core';
import { ContextMenuComponent } from '../app/components/modals/contextMenu.component';
import { Option } from '../helpers/types';

@Injectable({ providedIn: 'root' })
export class ContextMenuService {
  private contextMenuRef: ComponentRef<ContextMenuComponent> | null = null;

  constructor(
    private appRef: ApplicationRef,
    private environmentInjector: EnvironmentInjector
  ) { }

  open(options: Option[], parent: HTMLElement): void {
    const componentRef = createComponent(ContextMenuComponent, {
      environmentInjector: this.environmentInjector,
    });

    componentRef.instance.options = options;
    componentRef.instance.parentPostition = parent.getBoundingClientRect();
    componentRef.instance.close.subscribe(() => this.close());

    this.appRef.attachView(componentRef.hostView);
    document.getElementById('app')!.appendChild(componentRef.location.nativeElement);

    this.contextMenuRef = componentRef;
  }

  close(): void {
    if (this.contextMenuRef) {
      this.appRef.detachView(this.contextMenuRef.hostView);
      this.contextMenuRef.destroy();
      this.contextMenuRef = null;
    }
  }
}
