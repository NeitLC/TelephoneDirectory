import { Injectable } from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {AuthService} from "./auth.service";
import {catchError, filter, switchMap, take} from "rxjs/operators";
import {RefreshToken} from "../models/refresh-token";

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  private isRefreshing: boolean = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let tokenizedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });

    return next.handle(tokenizedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !req.url.includes('/login')) {
          return this.handle401Error(tokenizedRequest, next);
        }
        throw error;
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const token = this.authService.getRefreshToken();
      if (token) {
        return this.authService.refreshToken().pipe(
          switchMap((token: RefreshToken) => {
            this.isRefreshing = false;
            this.authService.updateToken(token);
            let tokenizedRequest = request.clone({
              setHeaders: {
                Authorization: `Bearer ${this.authService.getToken()}`
              }
            });
            return next.handle(tokenizedRequest);
          }),
          catchError((err) => {
            console.log(err);
            this.isRefreshing = false;
            this.authService.logout();
            return throwError(err);
          })
        )
      }
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(() => next.handle(request))
    );
  }
}
