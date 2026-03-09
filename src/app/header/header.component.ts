import { Component, ElementRef, HostListener, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  showCreateOptions = false;
  onCreateSvgClick() {
    this.showCreateOptions = !this.showCreateOptions;
  }

  constructor(private elementRef: ElementRef) {}

  //remove the options when clicked anywhere in the document
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    //skip if the clicked element is in the header itself
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.showCreateOptions = false;
    }
  }
}
