export interface Popup {
  message: string;
  type: 'Error' | 'Success';
  displayTime: number;
}

//for scheduler:

export interface Deck {
  id: number;
  name: string;
  crt: number;
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
  deck: Deck;
}

export interface Note {
  id: number;
  flashcard: Flashcard;
  front: string;
  back: string;
}

export interface CourseStudent {
  id: number;
  name: string;
}

export interface DeckStudent {
  id: number;
  name: string;
}
