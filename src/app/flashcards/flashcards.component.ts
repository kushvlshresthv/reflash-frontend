import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Deck, Flashcard } from '../models/models';
import { ApiResponse } from '../utils/api_response';
import { BACKEND_URL } from '../utils/global_constants';
import { Scheduler } from '../scheduler/Scheduler';

@Component({
  selector: 'app-flashcards',
  imports: [],
  templateUrl: './flashcards.component.html',
  styleUrl: './flashcards.component.scss',
})
export class FlashcardsComponent {
  deck: Deck | null = null;
  scheduler: Scheduler | null = null;
  currentCard: Flashcard | null = null;
  deckLoaded = false;
  sessionComplete = false;
  showAnswer = false;
  showAdditionalContext = false;
  currentButtonValues: {
    easy: string;
    good: string;
    hard: string;
    again: string;
  } | null = null;
  queueCounts: { newCount: number; learnCount: number; reviewCount: number } = {
    newCount: 0,
    learnCount: 0,
    reviewCount: 0,
  };

  constructor(
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      const deckId = params['deckId'];
      if (deckId) {
        this.loadDeck(deckId);
      }
    });
  }

  loadDeck(deckId: number) {
    this.httpClient
      .get<
        ApiResponse<Deck>
      >(BACKEND_URL + `/api/student/flashcards?deckId=${deckId}`, { withCredentials: true })
      .subscribe({
        next: (response) => {
          this.deck = response.mainBody;
          this.deckLoaded = true;
          this.scheduler = new Scheduler(this.httpClient, this.deck);
          this.nextCard();
        },
      });
  }

  nextCard() {
    if (!this.scheduler) return;
    this.currentCard = this.scheduler.getCard();
    this.currentButtonValues = this.scheduler.getButtonValues(this.currentCard as Flashcard);
    this.queueCounts = this.scheduler.getQueueCounts();
    this.showAnswer = false;
    this.showAdditionalContext = false;
    if (this.currentCard === null) {
      this.sessionComplete = true;
    }
  }

  revealAnswer() {
    this.showAnswer = true;
  }

  toggleAdditionalContext() {
    this.showAdditionalContext = !this.showAdditionalContext;
  }

  answerCard(ease: number) {
    if (!this.scheduler || !this.currentCard) return;
    this.scheduler.answerCard(this.currentCard, ease);
    this.nextCard();
  }
}
