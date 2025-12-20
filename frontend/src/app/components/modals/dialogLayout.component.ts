import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { actionButton } from '../../../helpers/types';
import { TextButtonComponent } from '../action/base-button.component';

@Component({
  selector: 'dialog-layout',
  imports: [TextButtonComponent, CommonModule],
  host: {
    role: 'dialog',
  },
  template: `
    <div class="header" [class.padding]="sectionPadding()">
      {{ title() }}
      <ng-content select="[dialog-title]"> {{ title() }} </ng-content>
    </div>
    <div class="content">
      <ng-content select="[dialog-content]"> {{ content() }} </ng-content>
    </div>
    <div class="footer" [class.padding]="sectionPadding()">
      <ng-content select="[dialog-footer]">
        @for (button of footerButtons(); track button.id) {
          <button base-button [label]="button.label" (clicked)="button.action()"></button>
        }
      </ng-content>
    </div>
  `,
  styles: [
    `
      @use 'media-size.mixins' as media;

      :host {
        background: var(--overlay-bg-clr);
        color: var(--overlay-clr);
        border-radius: 0.5rem;
        box-shadow: 0px 0.25rem 0.375rem rgba(0, 0, 0, 0.1);
        min-width: 18rem;
        padding: 1.5rem;
        display: grid;
        box-sizing: border-box;
        @include media.mobile {
          transform: translate(0, 0);
          inset: auto 1rem 1rem 1rem;
          width: auto;
        }
      }
      .header,
      .content,
      .footer {
        &:empty {
          display: none;
        }
      }
      .header {
        font-size: 1.25rem;
        &.padding {
          padding-bottom: 1.5rem;
        }
      }
      .footer {
        &.padding {
          padding-top: 1.5rem;
        }
        display: flex;
        gap: 1rem;
        @include media.mobile {
          flex-direction: column-reverse;
        }
      }
    `,
  ],
})
export class DialogLayoutComponent {
  title = input<string>();
  content = input<string>();
  footerButtons = input<actionButton[]>();
  sectionPadding = input<boolean>(true);
}
