import { Component, input } from '@angular/core';

@Component({
  selector: 'layout',
  template: `
    <div class="items">
      <div class="header">
        <h1 class="h1">
          <ng-content select="[header]"></ng-content>
        </h1>
        <div class="options">
          <ng-content select="[header-options]"></ng-content>
        </div>
      </div>
      <div class="location container">
        <ng-content select="[location]"></ng-content>
      </div>
      <div class="list">
        <ng-content select="[list]"></ng-content>
      </div>
    </div>
    <div list flex class="item-specifics" [attr.content-title]="contentTitle()">
      <ng-content select="[specifics]"></ng-content>
    </div>
  `,
  styles: `
    :host {
      background-color: var(--lvl-2);
      border-radius: 0.5rem;
      flex: 1;
      display: flex;
    }
    .main {
      display: flex;
      width: 100%;
      height: 100%;
      flex: 1;
    }
    .header {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      .options {
        display: flex;
        gap: 0.5rem;
      }
      .can-save {
        position: relative;
        color: hsla(0, 0%, 100%, 0.75);
        &:before {
          inset: 0.25rem 0.25rem 0.375rem;
          content: '';
          position: absolute;

          background-color: var(--p-400);
          filter: drop-shadow(0px 0px 0.0625rem white);
        }
      }
    }

    .container {
      display: grid;
      gap: 1.5rem;
    }
    .divider {
      background-color: var(--n-400);
      height: 0.0625rem;
      width: 100%;
    }
    .items {
      display: grid;
      align-items: start;
      align-content: start;
      gap: 1rem;
      flex: 1;
      width: 100%;
      padding: 1.5rem;
      border-radius: 0.25rem;
    }
    .item-specifics {
      background-color: var(--lvl-1);
      margin: 0.25rem;
      padding: 1.5rem;
      border-radius: 0.25rem;
      &:empty {
        place-content: center;
        &:before {
          content: attr(content-title);
          margin: auto;
          color: var(--n-400);
        }
      }
    }
  `,
})
export class LayoutComponent {
  contentTitle = input<string>('');
}
