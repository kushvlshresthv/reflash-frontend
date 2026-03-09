import { HttpRequest, HttpHandlerFn, HttpEventType, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, tap, throwError } from "rxjs";
import { AuthService } from "./service/auth.service";
import { Router } from "@angular/router";


export function checkResponseStatus(request:HttpRequest<unknown>, next: HttpHandlerFn) {
  const authService = inject(AuthService);
  const router = inject(Router);
	return next(request).pipe(
	  catchError((error:HttpErrorResponse)=> {
	    if(error.status === 401) {
	      console.log("Redirecting..");
	      authService.removeAuthentication();
	      router.navigateByUrl("/login");
	    }
	    return throwError(()=> error);
	  })
	);
}
