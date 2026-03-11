import { Component } from '@angular/core';
import { DeckStudent } from '../models/models';
import { DeckComponent } from './deck/deck.component';
import { ApiResponse } from '../utils/api_response';
import { BACKEND_URL } from '../utils/global_constants';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-decks',
  imports: [DeckComponent],
  templateUrl: './decks.component.html',
  styleUrl: './decks.component.scss',
})
export class DecksComponent {
  decks: DeckStudent[] = [];
  decksLoaded = false;

  showMenuOptions = false;
  dropdownTop = -1;
  dropdownRight = -1;
  id = -1;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      const courseId = params['courseId'];
      if (courseId) {
        this.getDecks(courseId);
      }
    });
  }

  onMenuOptionClick(eventObj: { event: Event; id: number }) {
    this.id = eventObj.id;
    eventObj.event.stopPropagation();
    const input = eventObj.event.target as HTMLElement;
    const rect = input.getBoundingClientRect();
    const newDropdownTop = rect.bottom + 10;
    const newDropdownRight = window.innerWidth - rect.right - 10;
    if (this.dropdownTop == newDropdownTop && this.dropdownRight == newDropdownRight) {
      this.showMenuOptions = false;
      this.dropdownRight = -1;
      this.dropdownTop = -1;
      return;
    }
    this.showMenuOptions = true;
    this.dropdownRight = newDropdownRight;
    this.dropdownTop = newDropdownTop;
  }

  closeMenuOptionsIfOpen() {
    if (this.showMenuOptions) {
      this.showMenuOptions = false;
      this.dropdownRight = -1;
      this.dropdownTop = -1;
    }
  }

  getDecks(courseId: number) {
    this.httpClient
      .get<
        ApiResponse<DeckStudent[]>
      >(BACKEND_URL + `/api/student/decks?courseId=${courseId}`, { withCredentials: true })
      .subscribe({
        next: (response) => {
          this.decks = response.mainBody;
          this.decksLoaded = true;
        },
      });
  }
}
