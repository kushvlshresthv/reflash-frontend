import { inject } from "@angular/core";
import { Route, UrlSegment, UrlTree, Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { AuthService } from "./service/auth.service";

export function isNotAuthenticated(
  route: Route,
  segment: UrlSegment[],
): Observable<Boolean | UrlTree> {
  const authService = inject(AuthService);
  const router = inject(Router);
  const authStatus = authService.isAuthenticated();
  console.log("notAuthenticatedGuardCalled");
  console.log(authStatus);
  if(!authStatus) {
    return of(true);
  } else {
    return of(router.parseUrl('/home'));
  }
}


// export function isAuthenticated(
//   route: Route,
//   segment: UrlSegment[],
// ): Observable<Boolean | UrlTree> {
//   const authService = inject(AuthService);
//   const router = inject(Router);
//   const authStatus = authService.isAuthenticated();

//   if(authStatus) {
//     return of(true);
//   } else {
//     return of(router.parseUrl('/login'));
//   }
// }
