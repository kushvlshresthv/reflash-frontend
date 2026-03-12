import id from "@angular/common/locales/id";
import { queue } from "rxjs";

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
}




export interface Flashcard {
  id: number;
  note: Note;
  crt: number;
  queue: 'SUSPENDED' | 'NEW' | 'LEARNING' | 'REVIEW';
  type: 'NEW' | 'LEARNING' | 'REVIEW' | 'RELEARNING';
  ivl: number;
  factor: number;
  reps: number;
  lapses: number;
  left: number;
  due: number;
}


export interface Note {
  id: number;
  front: string;
  back: string;
  additionalContext: string;
  tags: string[];
}

export interface CourseStudent {
  id: number;
  name: string;
}

export interface DeckStudent {
  id: number;
  name: string;
}
