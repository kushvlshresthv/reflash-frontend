import id from '@angular/common/locales/id';
import { queue } from 'rxjs';

export interface Popup {
  message: string;
  type: 'Error' | 'Success';
  displayTime: number;
}

//for scheduler:

export interface Deck {
  id: number;
  courseName: string;
  deckName: string;
  flashcards: Flashcard[];
  crt: number;
}

export interface Flashcard {
  id: number;
  note: Note;
  // crt: number;
  queue: 'SUSPENDED' | 'NEW' | 'LEARNING' | 'REVIEW';
  type: 'NEW' | 'LEARNING' | 'REVIEW' | 'RELEARNING';
  ivl: number;
  factor: number;
  reps: number;
  lapses: number;
  left: number;
  due: number;
  dirty: boolean;
}

export interface Note {
  id: number;
  front: string;
  back: string;
  additionalContext: string;
  tags: string[];
  crt: number;
}

export interface CourseStudent {
  courseId: number;
  courseName: string;
  courseDescription: string;
  deckCount: number;
  teacherNames: string[];
}

export interface CourseTeacher {
  courseId: number;
  courseName: string;
  courseDescription: string;
  deckCount: number;
  studentCount: number;
  grade: string;
}

export interface DeckStudent {
  deckId: number;
  deckName: string;
  deckDescription: string;
  cardCount: number;
}


export interface DeckTeacher {
  deckId: number;
  deckName: string;
  deckDescription: string;
  cardCount: number;
}
