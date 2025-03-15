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
    <div class="header">
      <ng-content select="[slot=content]"> {{ contentString() }} </ng-content>
    </div>
    <div class="footer">
      <ng-container select="[slot=footer]">
        @for (button of footerButtons(); track button.id) {
          <text-button [label]="button.label" (onClick)="button.action()"/>
        }
      </ng-container>
    </div>
  `,
  styles: [
    `
      @use 'media-size.mixins' as media;

      :host {
        background: var(--overlay-bg-clr);
        color: var(--overlay-clr);
        border-radius: 8px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        min-width: 18rem;
        display: grid;
        gap: 1.5rem;
        box-sizing: border-box;
        @include media.mobile {
          transform: translate(0, 0);
          inset: auto 1rem 1rem 1rem;
          width: auto;
        }
      }
      .close-btn {
        margin-top: 15px;
        padding: 5px 10px;
        background-color: #f44336;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
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
