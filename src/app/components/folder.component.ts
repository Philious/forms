import { Component, computed, inject, input, output, signal } from "@angular/core";
import { IconButtonComponent } from "./action/iconButton.component";
import { ButtonStyleEnum, IconEnum } from "../../helpers/enum";
import { IconComponent } from "./icons/icon.component";
import { FolderComponent as DuplicateFoldComponent } from "./folder.component";
import { CommonModule, KeyValue } from '@angular/common';
import { QuestionsItemComponent } from "./questions/questionItem.component";
import { TranslationTree } from "./questions/types";
import { TranslationService } from "../../services/translation.service";

@Component({
  selector: 'folder',
  template: `
    @let formId = lastValue();
    @if(!lastValue()) {
      <div class="item-wrapper">
        @if (!lastValue()) {
        <button class="item" (click)="toggleFold()">
          <icon class="icon" [icon]="IconEnum.Down" [class.open]="isOpen()" />
          <span class="label">{{title()}}</span>
        </button>
        }
      </div>
      <ul class="list">
        @if (foldData() && isOpen()) {
        
            @for (d of foldData() | keyvalue; let idx = $index; track d) {
              <li class="list-item">
                @if (typeof d.value === 'string') {
                  <span class="final">{{title()}}</span>
                }@else { 
                
                <folder [data]="d.value" [title]="d.key" (state)="updateChildState($event)"/>
                }
              </li>
            }
          
            @if(!childState()) {
              <li class="list-item add">
                <icon-button [icon]="IconEnum.Add" (onClick)="add()" [buttonStyle]="ButtonStyleEnum.Border"/> 
              </li>
            }
          }
        </ul>
        @if (typeof formId === 'string' && isOpen()) {
          <question-item [formGroup]="questionService.getLanguageFormGroup(isString(formId))"/>
        }
    }
  `,
  styles: `
  :host:has(.final) {
    .add { display: none; }
  }
  .list {
    display: flex;
    flex-direction: column;
  }
    .list-item {
      font-size: 0.875rem;
      margin-left: 1rem;
      order: 1;
      &.last { margin-left: 2rem; order: 2;}
    }
    .add {
      margin: .5rem 3rem 1.5rem;
    }
    .item-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .item {
      font-size: 0.875rem;
      display: flex;
      background-color: transparent;
      border: none;
      align-items: center;
      gap: .5rem;
    }
    .icon {
      transform: rotate(-90deg);
      transition: transform .25s;
      &.open {
        transform: rotate(0);
      }
    }
  `,
  imports: [DuplicateFoldComponent, IconComponent, CommonModule, QuestionsItemComponent, IconButtonComponent]
})
export class FolderComponent {
  questionService = inject(TranslationService);
  IconEnum = IconEnum;
  ButtonStyleEnum = ButtonStyleEnum;

  title = input<string>();
  parent = input<string>();
  data = input.required<TranslationTree | string>();

  isOpen = signal<boolean>(false);
  childState = signal<number>(0);
  state = output<boolean>();

  foldData = computed(() => typeof this.data() === 'object' ? this.data() as TranslationTree : null)
  lastValue = computed(() => typeof this.data() === 'string' ? this.data() : null);

  toggleFold() {
    this.isOpen.update((curr) => !curr)
    this.state.emit(this.isOpen())
  }

  isString(value: any) {
    return value as unknown as string
  }

  updateChildState(isOpen: boolean) {
    this.childState.update(update => {
      isOpen ? update++ : update--;
      return update;
    })
  }

  add() { console.log('title: ', this.title(), '\nfold: ', this.foldData()) }
}