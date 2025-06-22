import { computed, inject, Injectable, resource, signal } from '@angular/core';
import { Condition, ConditionId } from '@cs-forms/shared';
import { Api } from './api.config';

@Injectable({ providedIn: 'root' })
export class ConditionResource {
  private api = inject(Api);
  protected conditionMap = new Map<ConditionId, Condition>();

  reloadTrigger = signal(0);

  reload = () => {
    console.log('condition update');
    this.reloadTrigger.update(v => v + 1);
  };

  conditionResource = resource<Map<ConditionId, Condition>, number>({
    params: () => this.reloadTrigger(),
    loader: ({ abortSignal }) => this.api.request('/api/conditions/all', 'GET', undefined, abortSignal),
    defaultValue: new Map(),
  });

  conditions = computed<Map<ConditionId, Condition>>(() => this.conditionResource.value() ?? []);
  isLoading = computed<boolean>(() => this.conditionResource.isLoading());
  error = computed(() => this.conditionResource.error());

  constructor() {
    /*
    effect(() => {
      console.log('\nConditions: \n', this.conditions());
    });
    effect(() => {
      console.log('\Loading: \n', this.isLoading());
    });
    effect(() => {
      console.log('\nError: \n', this.error());
    });
    */
  }

  add = async (condition: Condition): Promise<void> => {
    await this.api.request(`/api/conditions/add`, 'POST', condition);
    this.reload();
  };
  update = async (condition: Condition): Promise<void> => {
    await this.api.request(`/api/conditions/update`, 'POST', condition);
    this.reload();
  };
  remove = async (id: ConditionId): Promise<void> => {
    await this.api.request(`/api/conditions/remove/${id}`, 'DELETE');
    this.reload();
  };
}
