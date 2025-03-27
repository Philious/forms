import { Component, computed, inject, input, output, signal } from "@angular/core";
import { IconButtonComponent } from "./action/iconButton.component";
import { ButtonStyleEnum, IconEnum } from "../../helpers/enum";
import { QuestionTree } from "../../helpers/types";
import { QuestionService } from "./questions/question.service";
import { IconComponent } from "./icons/icon.component";
import { FolderComponent as DuplicateFoldComponent } from "./folder.component";
import { CommonModule, KeyValue } from '@angular/common';
import { QuestionsItemComponent } from "./questions/questionItem.component";

@Component({
  selector: 'folder',
  template: `

    <div class="fold-item-wrapper">
      <button class="fold-item" (click)="toggleFold()">
        <icon class="fold-icon" [icon]="IconEnum.Down" [class.open]="isOpen()" />
        <span>{{title()}}</span>
      </button>
      @if (lastValue() && isOpen()) {
        <button>Remove</button>
      }
    </div>
      @if (foldData() && isOpen()) {
        <ul >
          @for (d of foldData() | keyvalue; let idx = $index; track d) {
            <li class="list-item">
              <folder [data]="d.value" [title]="d.key" (state)="updateChildState($event)"/>
            </li>
          }
          @if(!childState()) {
            <li class="list-item add">
              <icon-button [icon]="IconEnum.Add" (onClick)="add()" [buttonStyle]="ButtonStyleEnum.Border"/> 
            </li>
          }
        </ul>
        
      }
      
      @let formId = lastValue();
      @if (typeof formId === 'string' && isOpen()) {
        <question-item [formGroup]="questionService.getLanguageFormGroup(isString(formId))"/>
      }
  `,
  styles: `
    .list-item {
      margin-left: 1rem;
    }
    .add {
      margin: .5rem 3rem 1.5rem;
    }
    .fold-item-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .fold-item {
      display: flex;
      background-color: transparent;
      border: none;
      align-items: center;
      gap: .5rem;
      // height: 2.5rem;
    }
    .fold-icon {
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
  questionService = inject(QuestionService);
  IconEnum = IconEnum;
  ButtonStyleEnum = ButtonStyleEnum;

  title = input<string>();
  parent = input<string>();
  data = input.required<QuestionTree | string>();

  isOpen = signal<boolean>(false);
  childState = signal<number>(0);
  state = output<boolean>();

  foldData = computed(() => typeof this.data() === 'object' ? this.data() as QuestionTree : null)
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