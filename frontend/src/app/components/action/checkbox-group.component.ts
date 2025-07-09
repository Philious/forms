import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxComponent } from './checkbox.component';

let uid = 0;
type Checkbox = { id: string; value: boolean };

type CheckboxGroups = { id: string; values: Checkbox[] }[];
@Component({
  selector: 'check-box-group',
  imports: [FormsModule, CheckboxComponent, CommonModule],
  template: `
    @let groups = checkboxGroups();

    @for (group of groups; let idx = $index; track idx) {
      @for (checkbox of group.values; let idx = $index; track idx) {
        <check-box [modelValue]="checkbox.value" (emitUpdate)="update($event, group.id)" />
      }
    }
  `,
})
export class CheckboxGroupComponent {
  id = input(`checkbox-group-${uid++}`);

  checkboxGroups = input<CheckboxGroups>([]);
  emitUpdate = output<CheckboxGroups>();

  update(event: Checkbox, groupId: string) {
    const groups = this.checkboxGroups();
    const groupIndex = groups.findIndex(g => g.id === groupId);
    const index = groups[groupIndex].values.findIndex(v => v.id === event.id);
    groups[groupIndex].values[index].value = event.value;
    this.emitUpdate.emit(groups);
  }
}
