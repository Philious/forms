import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { Question, Section } from '../helpers/types';

@Injectable({
  providedIn: 'root'
})
export class SectionService {
  // Define the signal to manage sections state
  private sections = signal<Question[]>([]);

  constructor() { }

  addSection(section: Section): void {
    this.sections.update((currentSections) => [...currentSections, section]);
  }

  updateSection(updatedSection: Question): void {
    this.sections.update((currentSections) =>
      currentSections.map((q) => (q.id === updatedSection.id ? updatedSection : q))
    );
  }

  // Delete a question by ID
  deleteSection(id: string): void {
    this.sections.update((currentsections) =>
      currentsections.filter((q) => q.id !== id)
    );
  }

  // Get the current sections signal
  getSections() {
    return this.sections;
  }
}
