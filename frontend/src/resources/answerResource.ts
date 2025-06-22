import { computed, inject, Injectable, resource, signal } from '@angular/core';
import { Answer, AnswerId } from '@cs-forms/shared';
import { Api } from './api.config';

@Injectable({ providedIn: 'root' })
export class AnswerResource {
  private api = inject(Api);
  protected answerMap = new Map<AnswerId, Answer>();

  reloadTrigger = signal(0);

  reload = () => {
    console.log('answer update');
    this.reloadTrigger.update(v => v + 1);
  };

  answerResource = resource<Map<AnswerId, Answer>, number>({
    params: () => this.reloadTrigger(),
    loader: ({ abortSignal }) => this.api.request('/api/answers/all', 'GET', undefined, abortSignal),
    defaultValue: new Map(),
  });

  answers = computed<Map<AnswerId, Answer>>(() => this.answerResource.value());
  isLoading = computed<boolean>(() => this.answerResource.isLoading());
  error = computed(() => this.answerResource.error());

  constructor() {
    /*
    effect(() => {
      console.log('\nAnswers: \n', this.answers());
    });
    effect(() => {
      console.log('\Loading: \n', this.isLoading());
    });
    effect(() => {
      console.log('\nError: \n', this.error());
    });
    */
  }

  add = async (answer: Answer): Promise<void> => {
    await this.api.request(`/api/answers/add`, 'POST', answer);
    this.reload();
  };
  update = async (answer: Answer): Promise<void> => {
    await this.api.request(`/api/answers/update`, 'POST', answer);
    this.reload();
  };
  remove = async (id: AnswerId): Promise<void> => {
    await this.api.request(`/api/answers/remove/${id}`, 'DELETE');
    this.reload();
  };
}
