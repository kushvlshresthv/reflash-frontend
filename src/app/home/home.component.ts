import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BACKEND_URL } from '../utils/global_constants';
import { CourseStudent } from '../models/models';
import { CoursesComponent } from '../courses/courses.component';
import { ApiResponse } from '../utils/api_response';

@Component({
  selector: 'app-home',
  imports: [CoursesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})


export class HomeComponent {
}
