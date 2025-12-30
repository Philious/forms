import { CdkConnectedOverlay, ConnectionPositionPair } from '@angular/cdk/overlay';
import { Component, ComponentRef, Directive, ElementRef, inject, input, inputBinding, signal, TemplateRef, ViewContainerRef } from '@angular/core';

@Component({
  imports: [CdkConnectedOverlay],
  template: `
    @let trigger = tooltipTrigger();
    @if (trigger) {
      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="trigger"
        [cdkConnectedOverlayOpen]="true"
        [cdkConnectedOverlayPositions]="positionStrategy"
      >
        @if (show() && tooltipContent()) {
          <div class="tooltip" animate.enter="enter" animate.leave="leave">
            <div class="wrapper">{{ tooltipContent() }}</div>
          </div>
        }
      </ng-template>
    }
  `,
  styles: `
    :host {
      position: absolute;
    }
    .wrapper {
      min-height: 0;
      padding: 0.5rem 0.75rem;
    }
    .tooltip {
      background-color: var(--black);
      border-radius: 0.25rem;
      transform-origin: center bottom;
      display: grid;

      @mixin show {
        opacity: 1;
        translate: 0 0;
        scale: 1 1;
      }
      @mixin hide {
        transition-duration: 0.2s;
        opacity: 0;
        translate: 0 0.5rem;
        scale: 1 0.85;
      }

      transition:
        opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1),
        translate 0.5s cubic-bezier(0.22, 1, 0.36, 1),
        scale 0.5s cubic-bezier(0.22, 1, 0.36, 1);

      &.enter {
        @include show;
        @starting-style {
          @include hide;
        }
      }
      &.leave {
        @include hide;
        @starting-style {
          @include show;
        }
      }
    }
  `,
})
class TooltipComponent<T> {
  positionStrategy = positionStrategy;
  show = input<boolean>(false);
  tooltipTrigger = input<HTMLElement | null>(null);
  tooltipContent = input<string | TemplateRef<T> | null>(null);
}

@Directive({
  selector: '[tooltip]',
  providers: [TooltipComponent],
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class TooltipDirective<T> {
  private _vcr = inject(ViewContainerRef);
  private _componentRef?: ComponentRef<TooltipComponent<T>>;
  private _triggerElement = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);

  tooltipContent = input<string | TemplateRef<T> | null>(null, { alias: 'tooltip' });

  show = signal<boolean>(false);

  constructor() {
    this._componentRef = this._vcr.createComponent(TooltipComponent<T>, {
      bindings: [
        inputBinding('tooltipTrigger', () => this._triggerElement),
        inputBinding('tooltipContent', this.tooltipContent),
        inputBinding('show', this.show),
      ],
    });
  }

  onMouseEnter() {
    setTimeout(() => {
      this.show.set(true);
    });
  }
  onMouseLeave() {
    this.show.set(false);
  }
}

const positionStrategy: ConnectionPositionPair[] = [
  // top
  {
    originX: 'center', // left corner of the button
    originY: 'bottom', // bottom corner of the button
    overlayX: 'center', // left corner of the overlay to the origin
    overlayY: 'top', // top corner of the overlay to the origin
    offsetY: 4,
  },

  // bottom
  {
    originX: 'center', // right corner of the button
    originY: 'top', // bottom corner of the button
    overlayX: 'center', // right corner of the overlay to the origin
    overlayY: 'bottom', // top corner of the overlay to the origin
    offsetY: -4,
  },

  // bottom-left
  {
    originX: 'end', // left corner of the button
    originY: 'center', // top corner of the button
    overlayX: 'start', // left corner of the overlay to the origin
    overlayY: 'center', // top corner of the overlay to the origin
    offsetX: 4,
  },
  // bottom-right
  {
    originX: 'start', // right corner of the button
    originY: 'center', // top corner of the button
    overlayX: 'end', // right corner of the overlay to the origin
    overlayY: 'center', // top corner of the overlay to the origin
    offsetX: -4,
  },
];
