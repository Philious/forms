import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { Question } from '../helpers/types';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  // Define the signal to manage questions state
  private questions = signal<Question[]>([]);

  constructor() { }

  // Add a new question
  addQuestion(question: Question): void {
    this.questions.update((currentQuestions) => [...currentQuestions, question]);
  }

  // Update an existing question by ID
  updateQuestion(updatedQuestion: Question): void {
    this.questions.update((currentQuestions) =>
      currentQuestions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    );
  }

  // Delete a question by ID
  deleteQuestion(id: string): void {
    this.questions.update((currentQuestions) =>
      currentQuestions.filter((q) => q.id !== id)
    );
  }

  // Get the current questions signal
  getQuestions() {
    return this.questions;
  }
}
