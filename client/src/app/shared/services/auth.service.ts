import {Injectable} from '@angular/core';

import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from '@angular/common/http';
import {tap} from "rxjs/operators";

import {JwtToken} from "../models/jwt-token.model";
import {User} from "../models/user.model";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public jwtToken: BehaviorSubject<JwtToken> = new BehaviorSubject<JwtToken>({
    isAuthenticated: null,
    token: null
  })

  constructor(
    private http: HttpClient,
  ) {
    this.initToken();
  }

  // Initialization of the token
  private initToken(): void {
    const token = localStorage.getItem('jwt');
    if (token) {
      this.jwtToken.next({
        isAuthenticated: true,
        token: token
      });
    } else {
      this.jwtToken.next({
        isAuthenticated: false,
        token: null
      });
    }
  }

  // Sign up User => Create a new user
  public signup(user: User): Observable<User> {
    return this.http.post<User>('/api/auth/signup', user);
  }

  // Sign in User => Check the credential
  public signin(credentials: { email: string, password: string }): Observable<string> {
    return this.http.post<string>('/api/auth/signin', credentials).pipe(
      tap((token: string) => {
        this.jwtToken.next({
          isAuthenticated: true,
          token: token
        });
        localStorage.setItem('jwt', token);
      })
    )
  }

  public logout(): void {
    this.jwtToken.next({
      isAuthenticated: false,
      token: null
    });
    localStorage.removeItem('jwt');
  }
}
