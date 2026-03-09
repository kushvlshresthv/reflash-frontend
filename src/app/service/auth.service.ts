import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subscription } from "rxjs";
import { BACKEND_URL } from "../utils/global_constants";
import { ApiResponse } from "../utils/api_response";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  loggedIn$ = this.loggedIn.asObservable();

  authStatus = true;

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  initAuthService() {
    this.checkAuthOnLoad();
  }

  checkAuthOnLoad() {
    this.httpClient
      .get<ApiResponse<Object>>(`${BACKEND_URL}/isAuthenticated`, {
        withCredentials: true,
      })
      .subscribe({
        next: (isAuth) => {
	  if(isAuth.message == "true") {
	    this.authStatus = true;
	  } else {
	    this.authStatus = false;
	  }
          this.loggedIn.next(this.authStatus);
        },
	error: (error) => {
	  console.log(error);
	  this.authStatus = false;
	  this.loggedIn.next(this.authStatus);
	}
      });
  }

  isAuthenticated() {
    return this.authStatus;
  }

  removeAuthentication() {
    this.authStatus = false;
    this.loggedIn.next(this.authStatus);
    this.router.navigateByUrl('/login');
  }

  subscription!: Subscription;

  login(formattedCredentials: string) {
    const formattedEncodedCredentials = btoa(formattedCredentials);

    const headers = new HttpHeaders({
      Authorization: `Basic ${formattedEncodedCredentials}`,
      role: 'Student', 
    });

    this.subscription = this.httpClient
      .get<ApiResponse<Object>>(BACKEND_URL + '/login', {
        headers: headers,
        withCredentials: true,
      })
      .subscribe({
        next: (response) => {
	  this.authStatus = true;
	  this.loggedIn.next(this.authStatus);
          this.router.navigateByUrl('/home');
        },
        error: (error) => {
          console.log(error.error.message);
	  this.authStatus = false;
	  this.loggedIn.next(this.authStatus);
          this.router.navigateByUrl('/login');
        },
      });
  }

  // logout() {
  //   return this.http
  //     .post(
  //       `${BACKEND_URL}/logout`,
  //       {},
  //       {
  //         withCredentials: true,
  //       },
  //     )
  //     .pipe(tap(() => this.loggedIn.next(false)));
  // }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
