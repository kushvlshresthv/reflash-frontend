import { Component, input } from '@angular/core';
import { CourseStudent } from '../models/models';
import { CourseComponent } from './course/course.component';
import { ApiResponse } from '../utils/api_response';
import { BACKEND_URL } from '../utils/global_constants';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courses',
  imports: [CourseComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent {
  courses: CourseStudent[] = [];
  coursesLoaded = false;


  constructor(private httpClient: HttpClient,  private router: Router) {
    this.getCourses();
  }

  showMenuOptions = false;
  dropdownTop = -1;
  dropdownRight = -1;
  id = -1; //set when the option display is clicked

  onMenuOptionClick(eventObj: { event: Event; id: number }) {
    this.id = eventObj.id;
    eventObj.event.stopPropagation();
    const input = eventObj.event.target as HTMLElement;
    const rect = input.getBoundingClientRect();
    const newDropdownTop = rect.bottom + 10;
    // so both rect.right and left.right gives the distance from left edge of the view port, but right property of css expects distance from right edge of the viewport
    const newDropdownRight = window.innerWidth - rect.right - 10;
    if (
      this.dropdownTop == newDropdownTop &&
      this.dropdownRight == newDropdownRight
    ) {
      this.showMenuOptions = false;
      this.dropdownRight = -1;
      this.dropdownTop = -1;
      return;
    }
    this.showMenuOptions = true;
    this.dropdownRight = newDropdownRight;
    this.dropdownTop = newDropdownTop;
  }

  onEditOptionClick(event: Event) {
    event.stopPropagation();
    this.router.navigate(['/home/members-list/edit'], {
      queryParams: {
        id: this.id,
      },
    });
  }

  closeMenuOptionsIfOpen() {
    if (this.showMenuOptions) {
      this.showMenuOptions = false;
      //resetting these variables because onMenuOptionClick() uses them for comparison
      this.dropdownRight = -1;
      this.dropdownTop = -1;
    }
  }




  getCourses() {
    this.httpClient.get<ApiResponse<CourseStudent[]>>(BACKEND_URL + "/api/student/courses", {
      withCredentials: true, 
    }).subscribe({
      next: (response) =>  {
        this.courses = response.mainBody;
        this.coursesLoaded = true;
        //TODO: handle error and showing the dialog
      }
    });
  }

}
