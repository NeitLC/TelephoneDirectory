import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {AppConfigService} from "../configuration/app-config.service";
import {Observable} from "rxjs";
import {Token} from "../models/token";
import {UserRoles} from "../models/user-roles";
import {RegisterModel} from "../models/register-model";
import {RefreshToken} from "../models/refresh-token";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accountUrl: string = "account";
  private loginUrl: string = "login";
  private registerUrl: string = "register";
  private refreshTokenUrl: string = "refresh-token";

  private tokenKey: string = "token";
  private refreshTokenKey: string = "refreshToken";
  private userNameKey: string = "userName";
  private inRoleUrl: string = "in-role"

  constructor(private httpClient: HttpClient, private router: Router, private config: AppConfigService) { }

  public register(registerModel: RegisterModel): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const requestBody = JSON.stringify(registerModel);

    return this.httpClient
      .post(`${this.config.apiBaseUrl}/${this.accountUrl}/${this.registerUrl}`, requestBody, {headers: headers});
  }

  public login(userName: string, password: string): Observable<Token> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const requestBody = JSON.stringify({
      'userName': userName,
      'password': password
    });

    return this.httpClient
      .post<Token>(`${this.config.apiBaseUrl}/${this.accountUrl}/${this.loginUrl}`, requestBody, {headers: headers});
  }

  public saveUserInfo(token: Token, userName: string) {
    localStorage.setItem(this.tokenKey, token.token);
    localStorage.setItem(this.refreshTokenKey, token.refreshToken);
    localStorage.setItem(this.userNameKey, userName);
  }

  public refreshToken(): Observable<RefreshToken> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const accessToken = this.getToken();
    const refreshToken = this.getRefreshToken();
    if (accessToken === null || refreshToken === null) {
      this.router.navigate(['/login']);
      throw Error("Unauthorized.");
    }
    const token: RefreshToken = new RefreshToken(accessToken, refreshToken);
    const requestBody = JSON.stringify(token);
    return this.httpClient.post<RefreshToken>(`${this.config.apiBaseUrl}/${this.accountUrl}/${this.refreshTokenUrl}`,
      requestBody, {headers: headers});
  }

  public updateToken(refreshToken: RefreshToken) {
    localStorage.setItem(this.tokenKey, refreshToken.accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken.refreshToken);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  public getUserName(): string | null {
    return localStorage.getItem(this.userNameKey);
  }

  public loggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey) && !!localStorage.getItem(this.refreshTokenKey);
  }

  public logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userNameKey);
    this.router.navigate(['/login']);
  }

  public userInRole(role: string): Observable<boolean> {
    const userName: string | null = this.getUserName();

    if (userName === null) {
      throw Error("Username cannot be null");
    }

    return this.httpClient.get<boolean>(`${this.config.apiBaseUrl}/${this.accountUrl}/${userName}/${this.inRoleUrl}/${role}`);
  }

  public isAdmin(): Promise<boolean> {
    return this.userInRole(UserRoles.Admin).toPromise();
  }

  public isUser(): Promise<boolean> {
    return this.userInRole(UserRoles.User).toPromise();
  }
}
