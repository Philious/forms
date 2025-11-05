import { computed, Injectable, signal } from '@angular/core';
import { Question, QuestionId, QuestionPayload } from '@cs-forms/shared';
// import { Api } from './api.config';

@Injectable({ providedIn: 'root' })
export class QuestionResource {
  //private api = inject(Api);

  private reloadTrigger = signal(0);
  private reload = () => {
    console.log('question update');
    this.reloadTrigger.update(v => v + 1);
  };

  questions = computed<Map<QuestionId, Question>>(() => new Map()); //this.questionResource.value());
  isLoading = computed<boolean>(() => false); // this.questionResource.isLoading());
  error = computed(() => null); //this.questionResource.error());
  /*
  questionResource = resource<Map<QuestionId, Question>, number>({
    params: () => this.reloadTrigger(),
    loader: ({ abortSignal }) => this.api.request('/api/questions/all', 'GET', undefined, abortSignal).then(arrayToMap<QuestionId, Question>),
    defaultValue: new Map(),
  });

  
  

  constructor() {
    effect(() => {
      console.log('\nQuestions: \n', this.questions());
    });
    effect(() => {
      // console.log('\ncurrentSectionQuestions: \n', this.currentSectionQuestions());
    });
    effect(() => {
      // console.log('\nError: \n', this.error());
    });
  }
*/
  add = async (question: Question, callback?: () => void): Promise<void> => {
    console.log('add question to resource: ', question);
    // await this.api.request(`/api/questions/add`, 'POST', question);
    this.reload();
    callback?.();
  };
  update = async (question: QuestionPayload, callback?: () => void): Promise<void> => {
    console.log('questions resource updated');
    // await this.api.request(`/api/questions/update`, 'POST', question);
    this.reload();
    callback?.();
  };
  remove = async (id: QuestionId, callback?: () => void): Promise<void> => {
    // await this.api.request(`/api/questions/remove/${id}`, 'DELETE');
    this.reload();
    callback?.();
  };
}
