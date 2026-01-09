import { Component, inject, input, signal } from '@angular/core';
import { ButtonComponent } from '@app/components/action/base-button.component';
import { TabViewComponent } from '@app/components/action/tab-view.component';
import { IconComponent } from '@app/components/icons/icon.component';
import { ToggleDirective } from '@app/directives/toggleShow.directive';
import { LocaleService } from '@app/services/locale.service';
import { Store } from '@app/store/store';
import { Division, Form, Page } from '@cs-forms/shared';
import { IconEnum } from '@src/helpers/enum';
import { Translation } from '@src/helpers/translationTypes';
import { toggler } from '@src/helpers/utils';

type ItemType = {
  label: string;
  items: Translation[];
};

@Component({
  imports: [TabViewComponent, IconComponent, ButtonComponent, ToggleDirective],
  selector: 'content-collection',
  template: `
    <tab-view
      [tabs]="[
        { label: 'List', template: list },
        { label: 'Tree', template: tree },
      ]"
      [(selected)]="selectedEntryViewType"
    />
    <ng-template #list>
      <div class="frame">
        @for (section of mainItem(); track section.label) {
          <div layout-section class="layout" animate.enter="'enter'" animate.leave="'leave'">
            <button
              class="h2 accordion-trigger"
              base-button
              (click)="toggler.trigger(section.label, true)"
              [class.expanded]="toggler.target(section.label)()"
            >
              <icon class="arrow" [icon]="IconEnum.Down" />
              {{ section.label }} ({{ section.items.length }})
            </button>
            <div *toggle="toggler.target(section.label)()" class="default-animation accordion-container" animate.enter="enter" animate.leave="leave">
              @for (label of section.items; track label) {
                <div class="accordion-item">
                  {{ localeService.translate(label) }}
                </div>
              }
            </div>
          </div>
        }
      </div>
    </ng-template>
    <div class="frame">
      <ng-template #tree> Tree </ng-template>
    </div>
  `,
  styles: `
    .h2 {
      display: flex;
      white-space: nowrap;
      width: min-content;
      font-size: 0.875rem;
      padding-left: 0;
      .arrow {
        transition: rotate 0.25s;
        rotate: -90deg;
        font-size: 1rem;
      }
    }
    .can-save {
      color: var(--p-500);
    }
    .frame {
      padding-inline: 1.5rem;
      box-shadow: 0 0 0 0.0625rem inset var(--n-200);
      border-radius: 0.5rem;
    }
    .layout {
      gap: 0;
    }
    .accordion-trigger {
      margin-bottom: 0;
      transition: margin 0.25s;
      &.expanded {
        margin-bottom: 1rem;
        .arrow {
          rotate: 0deg;
        }
      }
    }
    .accordion-container {
      font-size: 0.875rem;

      .accordion-item {
        display: flex;
        align-items: center;
        height: 2rem;
      }
    }
  `,
})
export class ContentCollectionComponent {
  protected IconEnum = IconEnum;
  protected localeService = inject(LocaleService);
  protected store = inject(Store);

  mainItem = input.required<ItemType[], Form | Page | Division>({
    transform: item => {
      let pages: Translation[] = [];
      let divisions: Translation[] = [];
      let entries: Translation[] = [];
      if (Object.hasOwn(item, 'pages'))
        pages =
          this.store
            .pages()
            ?.values()
            .filter(p => (item as Form).pages.includes(p.id))
            .map(p => p.label) || [];
      else if (Object.hasOwn(item, 'division'))
        divisions =
          this.store
            .divisions()
            ?.values()
            .filter(d => (item as Page).divisions.includes(d.id))
            .map(d => d.label) || [];
      else
        entries = divisions =
          this.store
            .entries()
            ?.values()
            .filter(e => (item as Division).entries.includes(e.id))
            .map(e => e.label) || [];

      return [
        { label: 'Pages', items: pages },
        { label: 'Divisions', items: divisions },
        { label: 'Entries', items: entries },
      ];
    },
  });

  protected selectedEntryViewType = signal<'tree' | 'list'>('tree');
  protected toggler = toggler();
}
