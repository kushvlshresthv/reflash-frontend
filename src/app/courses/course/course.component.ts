import { Component, input, output } from '@angular/core';
import { CourseStudent } from '../../models/models';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-course',
  imports: [RouterLink],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss',
})
export class CourseComponent {
  course = input.required<CourseStudent>();
  showMenuOptions = false;
  constructor (private httpClient: HttpClient, private router: Router) {
    
  }

  toggleMenu = output<{event: Event, id: number}>();

  toggleMenuEvent(eventObj: Event) {
    this.toggleMenu.emit({event: eventObj, id: this.course().courseId});
  }
}
