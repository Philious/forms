import { computed, Injectable, signal } from '@angular/core';
import { Section, SectionId } from '@cs-forms/shared';
// import { Api } from './api.config';

@Injectable({ providedIn: 'root' })
export class SectionResource {
  // private api = inject(Api);
  reloadTrigger = signal(0);

  reload = () => {
    console.log('section update');
    this.reloadTrigger.update(v => v + 1);
  };
  sections = computed<ReadonlyMap<SectionId, Section>>(() => new Map()); //this.sectionResource.value());
  /*
  sectionResource = resource<ReadonlyMap<SectionId, Section>, number>({
    params: () => this.reloadTrigger(),
    loader: ({ abortSignal }) =>
      this.api
        .request<undefined, Array<[SectionId, Section]>>('/api/sections/all', 'GET', undefined, abortSignal)
        .then(arrayToMap<SectionId, Section>),
    defaultValue: new Map(),
  });

  
  isLoading = computed<boolean>(() => this.sectionResource.isLoading());
  error = computed(() => this.sectionResource.error());
  sectionList = computed<{ label: string; value: string }[]>(() => {
    const sectionList: { label: string; value: string }[] = [];
    this.sectionResource.value().forEach(s => sectionList.push({ label: s.name, value: s.id }));
    return sectionList;
  });

  constructor() {
    effect(() => {
      console.log('\nSections: \n', this.sections());
    });
    effect(() => {
      // console.log('\nSection Loading: \n', this.isLoading());
    });
    effect(() => {
      // console.log('\nError: \n', this.error());
    });
  }
*/
  add = async (section: Section, callback?: () => void): Promise<void> => {
    console.log('add');
    await {}; // this.api.request(`/api/sections/add`, 'POST', section);
    this.reload();
    callback?.();
  };
  update = async (section: Section, callback?: () => void): Promise<void> => {
    console.log('update section', section);
    // await this.api.request(`/api/sections/update`, 'POST', section);
    this.reload();
    callback?.();
  };
  remove = async (id: SectionId, callback?: () => void): Promise<void> => {
    // await this.api.request(`/api/sections/remove/${id}`, 'DELETE');
    callback?.();
    this.reload();
  };
}
