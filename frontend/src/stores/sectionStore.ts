import { Injectable } from '@angular/core';
import { Section, SectionPayload } from '@cs-forms/shared';
import { Api } from './api.config';

@Injectable({
  providedIn: 'root',
})
export class SectionStore extends Api {
  constructor() {
    super();
    this.getAll();
  }

  getAll() {
    console.log('getAllSections');
    return this._http.get<Section[]>(`/api/sections/all`, { withCredentials: true });
  }

  add(section: SectionPayload) {
    console.log('add section');
    return this._http.post<Section>(`/api/sections/add`, section, { withCredentials: true });
  }

  update(section: Partial<SectionPayload> & { id: string }) {
    console.log('updateSection');
    return this._http.post<Section>(`/api/sections/update`, section, { withCredentials: true });
  }

  remove(id: string) {
    return this._http.delete<Section>(`/api/sections/${id}`, { withCredentials: true });
  }
}
