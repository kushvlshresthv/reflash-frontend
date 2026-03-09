import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { AuthService } from './service/auth.service';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from './right-sidebar/right-sidebar.component';
import { PopupComponent } from './popup/popup.component';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from './utils/api_response';
import { BACKEND_URL } from './utils/global_constants';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    LeftSidebarComponent,
    RightSidebarComponent,
    PopupComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class App {
  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private httpClient: HttpClient,
  ) {
    this.authService.initAuthService();
    this.authService.loggedIn$.subscribe((value) => (this.isLoggedIn = value));
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Using Alt + N instead to avoid browser conflict
    const isAltPressed = event.altKey;
    const isNPressed = event.code === 'KeyN';
    const isHPressed = event.code == 'KeyH';
    const isLPressed = event.code == 'KeyL';

    if (isAltPressed && isNPressed) {
      event.preventDefault();
      this.router.navigate(['/create-todo']);
    } else if(isAltPressed && isHPressed) {
      event.preventDefault();
      this.router.navigate(['/create-habit'])
    } else if(isAltPressed && isLPressed) {
      event.preventDefault();
      this.httpClient.get<ApiResponse<Object>>(BACKEND_URL+"/api/logout", {withCredentials: true}).subscribe({
	next: (response) => {
	  console.log("Logged out: ", response);
	  this.router.navigate(['/login']);
	}
      })
      
    }
  }
}
