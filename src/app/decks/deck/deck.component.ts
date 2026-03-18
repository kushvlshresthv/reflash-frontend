import { Component, input, output } from '@angular/core';
import { DeckStudent } from '../../models/models';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-deck',
  imports: [RouterLink],
  templateUrl: './deck.component.html',
  styleUrl: './deck.component.scss',
})
export class DeckComponent {
  deck = input.required<DeckStudent>();

  constructor(private router: Router) {}

  toggleMenu = output<{ event: Event; id: number }>();

  toggleMenuEvent(eventObj: Event) {
    this.toggleMenu.emit({ event: eventObj, id: this.deck().deckId });
  }
}
