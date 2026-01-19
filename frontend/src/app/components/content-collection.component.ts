import { Component, computed, inject, input, signal } from '@angular/core';
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
import { TreeComponent, TreeNode } from './folder.component';

type ItemType = {
  label: string;
  items: Translation[] | null;
};

@Component({
  imports: [TabViewComponent, IconComponent, ButtonComponent, ToggleDirective, TreeComponent],
  selector: 'content-collection',
  template: `
    {{ selectedEntryViewType() }}
    <tab-view
      [tabs]="[
        { label: 'Tree', template: treeRef },
        { label: 'List', template: listRef },
      ]"
      [(selected)]="selectedEntryViewType"
    />

    <ng-template #listRef>
      <div class="frame">
        @for (section of list(); track section.label) {
          @if (section.items) {
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
              <div
                *toggle="toggler.target(section.label)()"
                class="default-animation accordion-container"
                animate.enter="enter"
                animate.leave="leave"
              >
                @for (label of section.items; track label) {
                  <div class="accordion-item">
                    {{ localeService.translate(label) }}
                  </div>
                }
              </div>
            </div>
          } @else {
            <div layout-section class="layout" animate.enter="'enter'" animate.leave="'leave'">
              <div class="h2">|&#39;&#175;&#96;&#730;{{ section.label }}&#730;&#180;&#175;&#39;|</div>
            </div>
          }
        }
      </div>
    </ng-template>

    <ng-template #treeRef>
      <div class="frame">
        <tree-node [nodes]="tree()" />
      </div>
    </ng-template>
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
      box-shadow: 0 0 0 0.0625rem inset var(--lvl-2);
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

  mainItem = input.required<Form | Page | Division>();

  protected list = computed<ItemType[]>(() => {
    const item = this.mainItem();
    console.log(item);
    const forms = Object.hasOwn(item, 'forms')
      ? this.store
          .forms()
          ?.values()
          .filter(p => (item as Page)?.forms.includes(p.id))
          .map(p => p.label) || []
      : null;

    const pages = Object.hasOwn(item, 'pages')
      ? this.store
          .pages()
          ?.values()
          .filter(p => (item as Form).pages.includes(p.id))
          .map(p => p.label) || []
      : null;

    const divisions = Object.hasOwn(item, 'divisions')
      ? this.store
          .divisions()
          ?.values()
          .filter(d => (item as Page).divisions.includes(d.id))
          .map(d => d.label) || []
      : null;

    const entries = Object.hasOwn(item, 'entries')
      ? this.store
          .entries()
          ?.values()
          .filter(e => item.entries.includes(e.id))
          .map(e => e.label) || []
      : null;

    return [
      { label: 'Forms', items: forms },
      { label: 'Pages', items: pages },
      { label: 'Divisions', items: divisions },
      { label: 'Entries', items: entries },
    ];
  });

  protected tree = computed<TreeNode[]>(() => {
    return this.treeIterator(this.mainItem());
  });

  treeIterator(item: { forms?: string[]; pages?: string[]; divisions?: string[]; entries?: string[] }): TreeNode[] {
    let node: TreeNode[] = [];

    if (!item?.forms) {
      console.log('form');

      node =
        this.store
          .pages()
          ?.values()
          .reduce(
            (acc, page) => [
              ...acc,
              ...(item.pages && item.pages.includes(page.id)
                ? [{ id: page.id, label: page.label, children: this.treeIterator({ forms: [''], divisions: page.divisions, entries: page.entries }) }]
                : []),
            ],
            [] as TreeNode[]
          ) ?? [];
    } else if (!item?.pages) {
      console.log('pages');

      node =
        this.store
          .divisions()
          ?.values()
          .reduce(
            (acc, division) => [
              ...acc,
              ...(item.divisions && item.divisions.includes(division.id)
                ? [
                    {
                      id: division.id,
                      label: division.label,
                      children: this.treeIterator({ forms: [''], pages: division.pages, entries: division.entries }),
                    },
                  ]
                : []),
            ],
            [] as TreeNode[]
          ) ?? [];
    } else if (!item?.divisions) {
      console.log('divisions');
      node =
        this.store
          .entries()
          ?.values()
          .reduce(
            (acc, entry) => [...acc, ...(item.entries && item.entries.includes(entry.id) ? [{ id: entry.id, label: entry.label }] : [])],
            [] as TreeNode[]
          ) ?? [];
    }

    return node;
  }

  protected selectedEntryViewType = signal<'Tree' | 'List'>('Tree');
  protected toggler = toggler();
}
