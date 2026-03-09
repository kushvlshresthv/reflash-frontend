// import { Component } from '@angular/core';
// import { FormHabitComponent } from '../form-habit/form-habit.component';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { HabitCreation } from '../models/models';
// import { BACKEND_URL } from '../utils/global_constants';
// import { PopupService } from '../popup/popup.service';

// @Component({
//   selector: 'app-create-habit',
//   imports: [FormHabitComponent],
//   templateUrl: './create-habit.component.html',
//   styleUrl: './create-habit.component.scss',
// })
// export class CreateHabitComponent {
//   habitFormData: HabitCreation = {
//     name: '',
//     startDate: new Date().toISOString().split('T')[0],
//     endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//     frequencies: [],
//     cheatDays: 0,
//   };

//   constructor(
//     private httpClient: HttpClient,
//     private router: Router,
//     private popupService: PopupService
//   ) {}

//   onFormSave(requestBody: HabitCreation) {
//     console.log('Habit Creation:', requestBody);

//     this.httpClient
//       .post<Response>(BACKEND_URL + '/api/habit', requestBody, {
//         withCredentials: true,
//       })
//       .subscribe({
//         next: (response) => {
//           console.log(response);
//           this.router.navigateByUrl('/home');
//           this.popupService.showPopup('Habit Created!', 'Success', 2000);
//         },
//         error: (error) => {
//           console.log(error.error.message);
//           this.popupService.showPopup('Habit Creation Failed!', 'Error', 2000);
//         },
//       });

//     this.popupService.showPopup('Habit Created!', 'Success', 2000);
//     this.router.navigateByUrl('/home');
//   }
// }
