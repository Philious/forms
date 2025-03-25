import { Component, TemplateRef, viewChild, input, computed } from '@angular/core';
import { actionButton } from '../../../helpers/types';
import { TextButton } from '../action/textButton.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'dialog-layout',
  imports: [TextButton, CommonModule],
  template: `
    <div class="header">
      <ng-content select="[slot=header]"> {{ headerString() }} </ng-content>
    </div>
    <div class="content">
      <ng-content select="[slot=content]"> {{ contentString() }} </ng-content>
    </div>
    <div class="footer">
      <ng-content select="[slot=footer]">
        @for (button of footerButtons(); track button.id) {
          <text-button [label]="button.label" (onClick)="button.action()"/>
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
        gap: 1.5rem;
        box-sizing: border-box;
        @include media.mobile {
          transform: translate(0, 0);
          inset: auto 1rem 1rem 1rem;
          width: auto;
        }
      }
      .footer {
        margin-top: 1.5rem;
        display: flex;
        gap: 1rem;
        @include media.mobile {
          flex-direction: column-reverse;
        }
      }
    `,
  ],
})
export class DialogComponent {


  readonly headerString = input<string>();
  readonly contentString = input<string>();
  readonly footerButtons = input<actionButton[]>();

}
